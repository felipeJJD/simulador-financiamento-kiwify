# Simulador de Financiamento Imobiliário

Um aplicativo web completo para simulação de financiamento imobiliário com assinatura digital e painel administrativo.

## 🚀 Funcionalidades

### Simulador Principal
- ✅ Formulário de simulação com validações completas
- ✅ Cálculo de financiamento com taxa de 12% a.a. (amortização francesa)
- ✅ Entrada mínima obrigatória de 20%
- ✅ Design responsivo (mobile e desktop)
- ✅ Máscaras e formatação de valores
- ✅ Validação de CPF, email e telefone

### Resultado da Simulação
- ✅ Exibição detalhada dos valores calculados
- ✅ Parcela mensal, total a pagar, juros, etc.
- ✅ Interface limpa e profissional

### Assinatura Digital
- ✅ Modal de assinatura com canvas
- ✅ Geração automática de PDF com os dados
- ✅ Download instantâneo do PDF assinado
- ✅ Validação legal da assinatura

### Painel Administrativo
- ✅ Lista todas as simulações realizadas
- ✅ Busca por nome, email ou CPF
- ✅ Estatísticas (total de simulações, valor médio, etc.)
- ✅ Visualização detalhada de cada simulação
- ✅ Interface administrativa completa

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF
- **Signature**: react-signature-canvas
- **Icons**: Lucide React
- **Masks**: react-input-mask

## 📦 Instalação e Execução

1. **Clone o repositório**
```bash
git clone https://github.com/felipeJJD/simulador-financiamento-kiwify.git
cd simulador-financiamento-kiwify
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo .env.local.example e configure suas credenciais do Supabase
cp .env.local.example .env.local
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse o aplicativo**
- Simulador: http://localhost:3000
- Painel Admin: http://localhost:3000/admin

## 🗄️ Banco de Dados

O projeto utiliza Supabase com a seguinte estrutura:

```sql
CREATE TABLE simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  property_value DECIMAL(15,2) NOT NULL,
  down_payment DECIMAL(15,2) NOT NULL,
  loan_amount DECIMAL(15,2) NOT NULL,
  monthly_payment DECIMAL(15,2) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  loan_term INTEGER NOT NULL,
  signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 💰 Cálculos Financeiros

- **Taxa de Juros**: 12% ao ano (fixa)
- **Entrada Mínima**: 20% do valor do imóvel
- **Sistema**: Tabela Price (SAC)
- **Prazos**: 15, 20, 25, 30 ou 35 anos

## 📱 Responsividade

O aplicativo foi desenvolvido com design mobile-first e funciona perfeitamente em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

## 🔒 Validações Implementadas

- Valor do imóvel obrigatório e maior que zero
- Entrada mínima de 20%
- Nome completo obrigatório
- Email válido obrigatório
- Telefone com máscara brasileira
- CPF com validação e máscara
- Assinatura obrigatória para aceitar proposta

## 📄 Geração de PDF

O PDF gerado contém:
- Dados completos do cliente
- Detalhes do financiamento
- Assinatura digital
- Data e hora de geração
- Informações legais

## 🎯 Características Técnicas

- **Performance**: Otimizado para carregamento rápido
- **SEO**: Meta tags configuradas
- **Acessibilidade**: Componentes acessíveis
- **TypeScript**: Tipagem completa
- **Error Handling**: Tratamento de erros robusto
- **Loading States**: Estados de carregamento em todas as operações

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no seu provedor
2. Execute o build: `npm run build`
3. Inicie o servidor: `npm start`

## 📊 Funcionalidades do Admin

- Dashboard com estatísticas
- Lista paginada de simulações
- Busca e filtros
- Visualização detalhada
- Export de dados (futuro)

## 🔧 Configuração do Supabase

1. Crie um projeto no Supabase
2. Execute o script SQL fornecido
3. Configure as variáveis de ambiente
4. Ative as políticas RLS se necessário

---

**Desenvolvido para o teste técnico da Kiwify** 🥝