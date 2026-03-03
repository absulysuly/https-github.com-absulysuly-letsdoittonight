import { supabase } from '../supabaseClient'

export const uploadFile = async (file: File, folder: string): Promise<string> => {
  if (!supabase) throw new Error('Supabase not configured')
  const filename = `${folder}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from('media').upload(filename, file)
  if (error) throw error
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path)
  return urlData.publicUrl
}
