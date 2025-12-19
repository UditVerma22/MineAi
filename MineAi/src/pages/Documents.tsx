import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Trash2, Download, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

type Document = {
  id: string;
  filename: string;
  category: string;
  upload_date: string;
};

const Documents = () => {
  const { user, isAdmin, loading: roleLoading } = useUserRole();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roleLoading && !user) {
      navigate("/auth");
    }
  }, [user, roleLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admins can delete documents",
      });
      return;
    }

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted",
      });
      
      fetchDocuments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handlePreview = (doc: Document) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${doc.filename}`,
    });
    // TODO: Implement actual PDF preview
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl font-bold">
                MineAI Document Management
              </h1>
              <p className="text-muted-foreground">
                Browse mining regulation documents
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {isAdmin ? "All Documents" : "Available Documents"}
              </h2>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No documents available
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.map((doc, idx) => (
                    <Card
                      key={doc.id}
                      className="glass-effect rounded-xl p-4 flex items-center justify-between animate-slide-up"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.category} • {new Date(doc.upload_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-lg"
                          onClick={() => handlePreview(doc)}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-lg" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doc.id)}
                            className="rounded-lg text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
