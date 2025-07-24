import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Configuração mais robusta para produção
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Não persistir sessão para evitar problemas de CORS
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Função helper para testar conectividade
export async function testSupabaseConnection() {
  try {
    console.log('Testando conexão com Supabase...')
    console.log('URL:', supabaseUrl)
    console.log('Key presente:', !!supabaseKey)
    
    const { data, error } = await supabase
      .from('simulations')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Erro na conexão:', error)
      return false
    }
    
    console.log('Conexão com Supabase OK')
    return true
  } catch (error) {
    console.error('Erro crítico na conexão:', error)
    return false
  }
}