# Deploy no Railway

## 🚀 Como fazer deploy no Railway

### 1. Preparação
- ✅ Código já está preparado para Railway
- ✅ Dockerfile configurado
- ✅ railway.json configurado
- ✅ Variáveis de ambiente definidas

### 2. Deploy via GitHub
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório: `felipeJJD/simulador-financiamento-kiwify`
6. Railway detectará automaticamente que é um projeto Next.js

### 3. Configurar Variáveis de Ambiente
No Railway Dashboard, adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://taliayuyprrmztzgkouu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbGlheXV5cHJybXp0emdrb3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTMzODQsImV4cCI6MjA2ODg4OTM4NH0.eHLq7ESgSu6xtfZzxCXDuYusamSM2JCnKcRTnAh9Kic
PORT=3000
```

### 4. Deploy Automático
- Railway fará o build e deploy automaticamente
- O app estará disponível em uma URL como: `https://seu-app.railway.app`

### 5. URLs do App
- **Simulador**: `https://seu-app.railway.app`
- **Painel Admin**: `https://seu-app.railway.app/admin`

### 6. Banco de Dados
- ✅ Supabase já configurado e funcionando
- ✅ Tabela `simulations` criada
- ✅ Dados serão salvos automaticamente

## 📋 Checklist de Deploy
- [x] Dockerfile criado
- [x] railway.json configurado
- [x] Variáveis de ambiente definidas
- [x] Package.json com script de start correto
- [x] .dockerignore configurado
- [x] Código no GitHub atualizado
- [x] Banco Supabase funcionando

## 🔧 Comandos Locais
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Start de produção
npm start

# Lint
npm run lint
```

## 🌐 Funcionalidades
- ✅ Simulador de financiamento
- ✅ Assinatura digital
- ✅ Geração de PDF
- ✅ Painel administrativo
- ✅ Banco de dados Supabase
- ✅ Design responsivo
- ✅ Validações completas