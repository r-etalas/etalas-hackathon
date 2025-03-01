-- Create a storage bucket for videos
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true);

-- Allow authenticated users to upload videos
create policy "Authenticated users can upload videos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'videos' 
    and (storage.foldername(name))[1] = 'wedding-videos'
);

-- Allow public to view videos
create policy "Public can view videos"
on storage.objects for select
to public
using ( bucket_id = 'videos' );

-- Allow users to delete their own videos
create policy "Users can delete their own videos"
on storage.objects for delete
to authenticated
using ( 
    bucket_id = 'videos'
    and auth.uid() = owner
); 