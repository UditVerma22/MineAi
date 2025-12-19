-- Update documents SELECT policy to allow all authenticated users to view documents
DROP POLICY IF EXISTS "Users can view their own documents or admins can view all" ON public.documents;

CREATE POLICY "Authenticated users can view all documents"
ON public.documents
FOR SELECT
TO authenticated
USING (true);

-- Keep INSERT restricted: admins only (via has_role check)
DROP POLICY IF EXISTS "Authenticated users can create documents" ON public.documents;

CREATE POLICY "Admins can create documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Update DELETE policy: admins only
DROP POLICY IF EXISTS "Users can delete their own documents or admins can delete any" ON public.documents;

CREATE POLICY "Admins can delete documents"
ON public.documents
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));