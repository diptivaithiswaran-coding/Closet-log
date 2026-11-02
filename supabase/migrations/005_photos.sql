-- Feature 8: Photo upload
-- A storage bucket for piece photos. Each user uploads into their own folder
-- (photos/<their user id>/...), and can only add or remove files there.
-- The bucket is public-read so photos load fast in the grid; the file names
-- are random, so nobody can guess another user's photo links.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Users upload to their own photo folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users replace photos in their own folder"
  on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete photos in their own folder"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
