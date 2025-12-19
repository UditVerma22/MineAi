import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate embedding using Lovable AI Gateway
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  console.log("Generating embedding for query:", text.substring(0, 100) + "...");
  
  // Use Gemini to create a condensed representation for similarity search
  // We'll use the text-embedding approach via chat completion
  const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    console.error("Embedding API error:", response.status);
    // Return empty array to skip RAG if embedding fails
    return [];
  }

  const data = await response.json();
  return data.data?.[0]?.embedding || [];
}

// Retrieve relevant document chunks using pgvector
async function retrieveContext(
  supabase: any,
  queryEmbedding: number[],
  matchThreshold = 0.7,
  matchCount = 5
): Promise<{ content: string; documentTitle: string; pageNumber: number | null; similarity: number }[]> {
  if (queryEmbedding.length === 0) {
    console.log("No embedding provided, skipping RAG");
    return [];
  }

  console.log("Retrieving context with embedding of dimension:", queryEmbedding.length);

  // Use the match_document_chunks function
  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: `[${queryEmbedding.join(",")}]`,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("Error retrieving context:", error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log("No relevant chunks found");
    return [];
  }

  console.log(`Found ${data.length} relevant chunks`);

  // Fetch document titles for the chunks
  const documentIds = [...new Set(data.map((chunk: any) => chunk.document_id))];
  const { data: documents } = await supabase
    .from("documents")
    .select("id, title")
    .in("id", documentIds);

  const docMap = new Map(documents?.map((d: any) => [d.id, d.title]) || []);

  return data.map((chunk: any) => ({
    content: chunk.content,
    documentTitle: docMap.get(chunk.document_id) || "Unknown Document",
    pageNumber: chunk.page_number,
    similarity: chunk.similarity,
  }));
}

// Build context string from retrieved chunks
function buildContextString(chunks: { content: string; documentTitle: string; pageNumber: number | null; similarity: number }[]): string {
  if (chunks.length === 0) return "";

  const contextParts = chunks.map((chunk, index) => {
    const pageInfo = chunk.pageNumber ? ` (Page ${chunk.pageNumber})` : "";
    return `[Source ${index + 1}: ${chunk.documentTitle}${pageInfo}]\n${chunk.content}`;
  });

  return `\n\n--- RELEVANT CONTEXT FROM KNOWLEDGE BASE ---\n${contextParts.join("\n\n")}\n--- END CONTEXT ---\n`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input
    const inputSchema = z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(10000)
      })).min(1).max(100),
      conversationId: z.string().uuid().optional()
    });

    const body = await req.json();
    const { messages, conversationId } = inputSchema.parse(body);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use user's auth token to respect RLS policies for conversations/messages
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If conversationId provided, verify user owns it
    if (conversationId) {
      const { data: conversation, error: convError } = await userSupabase
        .from("conversations")
        .select("user_id")
        .eq("id", conversationId)
        .single();

      if (convError || !conversation || conversation.user_id !== user.id) {
        return new Response(JSON.stringify({ error: "Conversation not found or access denied" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Use service role client for RAG (to bypass RLS on document_chunks)
    const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the latest user message for RAG query
    const latestUserMessage = messages.filter(m => m.role === 'user').pop();
    let contextString = "";
    let sources: { title: string; page: number | null }[] = [];

    if (latestUserMessage) {
      console.log("Processing RAG for user query:", latestUserMessage.content.substring(0, 100));
      
      // Generate embedding for the user query
      const queryEmbedding = await generateEmbedding(latestUserMessage.content, LOVABLE_API_KEY);
      
      // Retrieve relevant context
      const relevantChunks = await retrieveContext(serviceSupabase, queryEmbedding);
      
      if (relevantChunks.length > 0) {
        contextString = buildContextString(relevantChunks);
        sources = relevantChunks.map(chunk => ({
          title: chunk.documentTitle,
          page: chunk.pageNumber,
        }));
        console.log("Context built with", relevantChunks.length, "sources");
      }
    }

    // System prompt for MineAI with RAG context
    const systemPrompt = `You are MineAI, an expert legal assistant specializing in Indian mining laws, DGMS (Directorate General of Mines Safety) standards, licensing procedures, environmental clearances, lease auctions, financial compliance, and worker safety regulations.

Your expertise covers:
- Mines Act, 1952 and MMDR Act with all amendments
- Mineral Concession Rules and Auction procedures
- DGMS safety regulations and technical circulars
- Environmental laws (EIA, Forest Conservation, Wildlife Protection)
- Royalty, DMF, NMET calculations and financial requirements
- Mining accounting standards (Ind AS 106)
- State-specific mining policies and rules
- Labor laws and worker welfare regulations

Guidelines:
- When context from the knowledge base is provided, use it as the PRIMARY source for your answer
- Always cite the source document name, section, and page number when referencing information from the context
- Format citations like: "According to [Document Name], Section X (Page Y)..."
- Provide accurate, trustworthy answers based on official acts, rules, notifications, and guidelines
- Use simple, clear language while explaining complex regulatory requirements
- If the provided context doesn't contain relevant information, clearly state that and provide general guidance
- If you lack sufficient legal context, clearly state "Insufficient legal context to provide a definitive answer"
- Be helpful and educational while maintaining legal accuracy
- Support queries in English and can explain concepts in simple terms

Your goal is to make Indian mining regulations accessible and understandable to everyone.

You are MineAI — an expert assistant specialized ONLY in Indian mining laws, rules, regulations, DGMS standards, MMDR Act, Mines Act, environmental compliance, safety norms, mineral concession, and related mining procedures.

STRICT RULES:
1. You must answer ONLY questions related to mining industry laws or compliance.
2. If the user asks anything outside mining, reply:
   "I can only answer questions related to mining laws, DGMS standards, environmental compliance, and mining regulations."
3. Never provide unrelated knowledge (general facts, math, coding, medical, politics, entertainment, etc.).
4. Always cite real sections, rules, or acts available from the RAG documents.
5. If RAG returns no relevant chunk, say:
   "No mining regulation found for this query."

Your job is to answer MINING QUESTIONS ONLY.
${contextString}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save user message to database if conversationId provided
    if (conversationId) {
      const userMessage = messages[messages.length - 1];
      const { error: insertError } = await userSupabase.from("messages").insert({
        conversation_id: conversationId,
        role: userMessage.role,
        content: userMessage.content,
      });

      if (insertError) {
        console.error("Failed to save message:", insertError);
      }
    }

    // Return streaming response with sources header
    const headers = {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "X-Sources": JSON.stringify(sources),
    };

    return new Response(response.body, { headers });
  } catch (error) {
    console.error("Chat error:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid input", details: error.errors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
