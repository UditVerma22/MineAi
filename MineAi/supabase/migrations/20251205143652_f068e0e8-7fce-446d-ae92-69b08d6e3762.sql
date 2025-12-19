-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view chunks of accessible documents" ON public.document_chunks;

-- Create new policy allowing all authenticated users to view chunks (matching documents table)
CREATE POLICY "Authenticated users can view all chunks" 
ON public.document_chunks 
FOR SELECT 
TO authenticated
USING (true);