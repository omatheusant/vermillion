-- Storage — bucket privado para avatar/retrato (docs/DATA_MODEL.md §5.6).
-- Convenção de path: media/{owner_id}/{random-filename}. Nome aleatório e
-- MIME real são validados no servidor antes do upload (Fase C,
-- src/lib/media), nunca confiando em extensão/nome enviado pelo client.
-- Serviço de leitura pública de retrato para galeria (Fase E) fica
-- pendente — por ora o bucket é estritamente privado, só o dono lê.

insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

create policy media_storage_insert_own on storage.objects for insert
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy media_storage_select_own on storage.objects for select
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy media_storage_delete_own on storage.objects for delete
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
