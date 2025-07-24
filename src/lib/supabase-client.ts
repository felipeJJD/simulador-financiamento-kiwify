import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não encontradas:', {
    url: !!supabaseUrl,
    key: !!supabaseKey,
    env: process.env.NODE_ENV
  })
}

// Usar valores reais ou fallback apenas para build
const finalUrl = supabaseUrl || 'https://taliayuyprrmztzgkouu.supabase.co'
const finalKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbGlheXV5cHJybXp0emdrb3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTMzODQsImV4cCI6MjA2ODg4OTM4NH0.eHLq7ESgSu6xtfZzxCXDuYusamSM2JCnKcRTnAh9Kic'

// Configuração mais robusta para produção
export const supabase = createClient(finalUrl, finalKey, {
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
    console.log('URL:', finalUrl)
    console.log('Key presente:', !!finalKey)
    console.log('Variáveis de ambiente:', {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
    
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