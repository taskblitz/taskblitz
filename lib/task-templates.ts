import { supabase } from './supabase'
import { TaskTemplate } from '@/types/advanced-features'

export async function createTaskTemplate(template: Omit<TaskTemplate, 'id' | 'created_at' | 'updated_at' | 'use_count'>) {
  
  const { data, error } = await supabase
    .from('task_templates')
    .insert(template)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserTemplates(userId: string) {
  
  const { data, error } = await supabase
    .from('task_templates')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data as TaskTemplate[]
}

export async function getPublicTemplates() {
  
  const { data, error } = await supabase
    .from('task_templates')
    .select('*')
    .eq('is_public', true)
    .order('use_count', { ascending: false })
    .limit(20)
  
  if (error) throw error
  return data as TaskTemplate[]
}

export async function updateTemplate(id: string, updates: Partial<TaskTemplate>) {
  
  const { data, error } = await supabase
    .from('task_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTemplate(id: string) {
  
  const { error } = await supabase
    .from('task_templates')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function incrementTemplateUse(id: string) {
  
  const { error } = await supabase.rpc('increment_template_use', { template_id: id })
  
  if (error) throw error
}
