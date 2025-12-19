-- Fix documents table RLS policy to be user-scoped instead of public
DROP POLICY IF EXISTS "Anyone can view documents" ON public.documents;

CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);