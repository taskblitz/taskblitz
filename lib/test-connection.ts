import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('tasks')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connection successful!')
    
    // Test getting all tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
    
    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      return false
    }
    
    console.log('Tasks in database:', tasks?.length || 0)
    console.log('Sample task:', tasks?.[0])
    
    return true
  } catch (error) {
    console.error('Exception testing Supabase:', error)
    return false
  }
}