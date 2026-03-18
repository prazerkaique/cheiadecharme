# Cheia de Charme — Documentação Completa de Infraestrutura

> Documento para o time de infra. Cobre toda a arquitetura, stack, apps, banco de dados, deploy e configuração do projeto.

---

## 1. Visão Geral

**Cheia de Charme** é um CRM SaaS multi-tenant para rede de salões de beleza (42 lojas parceiras). O sistema possui 5 aplicações web independentes que compartilham código via monorepo.

### Arquitetura Multi-Tenant (2 níveis)

```
Organization (Rede "Cheia de Charme")
  └── Store (Loja Copacabana)
        ├── Profissionais
        ├── Serviços
        ├── Agendamentos
        └── Transações
  └── Store (Loja Ipanema)
        └── ...
```

- **Nível 1 — Organization:** cada rede/empresa é um tenant
- **Nível 2 — Store:** cada loja dentro da rede é um sub-tenant
- Todas as queries filtram por `store_id`
- RLS usa `organization_id` + `store_id`
- Objetivo futuro: vender para outras redes (multi-tenant do multi-tenant)

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Monorepo** | Turborepo + pnpm workspaces | Turbo 2.4.0, pnpm 10.32.1 |
| **Framework** | Next.js (App Router) | 15.2.0 |
| **Linguagem** | TypeScript strict | 5.x |
| **Runtime** | React | 19 |
| **Estilização** | Tailwind CSS | 4 |
| **State** | Zustand | 5 |
| **Animações** | Framer Motion | 12.4.0 |
| **Forms** | React Hook Form + Zod | RHF 7.54, Zod 3.24 |
| **Charts** | Recharts (app gestor) | 2.15.0 |
| **Backend** | Supabase (DB, Auth, RLS, Realtime) | JS SDK 2.49.0 |
| **Ícones** | Phosphor Icons + Lucide React | — |
| **QR Code** | qrcode (gerar) + html5-qrcode (ler) | — |

---

## 3. Estrutura do Monorepo

```
cheia-de-charme/
├── apps/
│   ├── totem/          → Kiosk autoatendimento (port 3000)
│   ├── tv/             → TV da fila (port 3001)
│   ├── recepcao/       → Recepção (port 3002)
│   ├── profissional/   → Visão do profissional (port 3003)
│   └── gestor/         → Painel do gestor (port 3004)
├── packages/
│   ├── types/          → TypeScript types compartilhados
│   ├── db/             → Supabase client
│   ├── config/         → Tailwind preset + tsconfig base
│   └── ui/             → Componentes compartilhados (placeholder)
├── supabase/
│   ├── migrations/     → 4 migrations SQL
│   ├── seed.sql        → Dados de teste
│   └── config.toml     → Config local do Supabase
├── docs/               → Documentação
├── turbo.json          → Configuração do Turborepo
├── pnpm-workspace.yaml → Workspace do pnpm
├── package.json        → Scripts raiz
└── .env.example        → Variáveis de ambiente
```

### Como o Turborepo funciona

O **Turborepo é open source e gratuito** (licença MIT). Ele orquestra builds e dev servers no monorepo.

**Arquivo `turbo.json`:**
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

- `dependsOn: ["^build"]` → builda as dependências (packages) antes dos apps
- `outputs` → o que cachear entre builds
- `dev` → sem cache, roda persistente (watch mode)

**Arquivo `pnpm-workspace.yaml`:**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Define que `apps/` e `packages/` são workspaces. Dependências entre eles usam `"@cheia/types": "workspace:*"` no `package.json`.

### Comandos

```bash
# Desenvolvimento
pnpm dev                          # Todos os apps
pnpm dev --filter @cheia/totem    # Só o totem
pnpm dev --filter @cheia/gestor   # Só o gestor

# Build
pnpm build                        # Tudo
pnpm build --filter @cheia/totem  # Só o totem

# Lint e type-check
pnpm lint
pnpm type-check
```

---

## 4. Aplicações

### 4.1 Totem (`apps/totem`) — Port 3000

**Função:** Kiosk de autoatendimento. Cliente chega no salão, se identifica (CPF/telefone), escolhe serviço, entra na fila.

**Especificações de hardware:**
- Tela: 1080x1920 (retrato), touch 23.6"
- Font mínimo: 20px
- Botões: mín 80px altura
- Touch targets: mín 64x64px
- Gap mín: 16px

**Fluxo (State Machine - Zustand):**
```
Idle → Identify → Found/NotFound → Register → SelectService → Confirm → Done
                                                     ↓
                                               CrossSell Modal
```

**Telas:**
| Tela | Descrição |
|------|-----------|
| `IdleScreen` | Tela inicial, toque para começar |
| `IdentifyScreen` | CPF ou telefone com teclado numérico |
| `ClientFoundScreen` | Cliente encontrado, exibe dados |
| `RegisterScreen` | Cadastro de novo cliente |
| `SelectServiceScreen` | Categorias → Serviços → Profissional |
| `ConfirmScreen` | Resumo + QR Code |
| `DoneScreen` | Senha de atendimento |

**Componentes kiosk:**
- `ScreenLayout` — Layout padrão com header, stepper, footer sticky (glass)
- `NumericKeypad` — Teclado numérico touch
- `QwertyKeyboard` — Teclado QWERTY touch
- `ServiceCard` / `ProfessionalCard` — Cards de seleção
- `CrossSellModal` — Venda cruzada com desconto
- `CharmesBuyModal` / `CharmesWalletModal` — Sistema de moeda virtual
- `CancelConfirmModal` / `TimeoutWarningModal` — Modais de segurança

---

### 4.2 TV (`apps/tv`) — Port 3001

**Função:** Tela de exibição da fila de espera no salão (digital signage).

**Status:** Em construção

**Componentes:** Layout TV + componentes de fila

---

### 4.3 Recepção (`apps/recepcao`) — Port 3002

**Função:** Painel da recepcionista para gerenciar fila, agendamentos e profissionais.

**Status:** Em construção

**Componentes:** Queue management, Professional schedules, Appointment details, History, Stats

---

### 4.4 Profissional (`apps/profissional`) — Port 3003

**Função:** App do profissional (cabeleireiro, manicure, etc). Vê fila, clientes, ganhos.

**Telas:**
| Tela | Descrição |
|------|-----------|
| `LoginScreen` | Login com email/senha |
| `HomeScreen` | Lista de clientes + resumo de ganhos |
| `TicketScreen` | Detalhes do atendimento atual |
| `EarningsScreen` | Histórico de ganhos e comissões |
| `ActiveServiceScreen` | Serviço em andamento |

**Features:** Leitura de QR Code (html5-qrcode), autenticação Supabase Auth

---

### 4.5 Gestor (`apps/gestor`) — Port 3004

**Função:** Dashboard administrativo. KPIs, vendas, equipe, clientes, serviços.

**Rotas:**
| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação |
| `/(app)/dashboard` | KPIs, gráficos, resumo |
| `/(app)/vendas` | Analytics de vendas (Recharts) |
| `/(app)/equipe` | Gestão de profissionais |
| `/(app)/equipe/novo` | Cadastro de profissional |
| `/(app)/equipe/[id]` | Edição de profissional |
| `/(app)/clientes` | Lista de clientes |
| `/(app)/clientes/[id]` | Detalhes do cliente |
| `/(app)/servicos` | Catálogo de serviços |
| `/(app)/configuracoes` | Configurações da loja |

**Features:** Charts (Recharts), forms com RHF+Zod, CRUD completo

---

## 5. Packages Compartilhados

### `@cheia/types` (`packages/types`)
Tipos TypeScript usados por todos os apps:
- `Organization`, `Store`, `Profile`, `Service`, `Appointment`
- `Transaction`, `ProfessionalService`, `DailySummary`
- `KioskStep`, `IdentifyMethod`, `PaymentMethod`, `ClientFrequency`

### `@cheia/db` (`packages/db`)
Cliente Supabase compartilhado:
```typescript
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

### `@cheia/config` (`packages/config`)
- `tailwind.config.ts` — Design tokens (cores, fontes, radii)
- `tsconfig.base.json` — TypeScript strict base
- `tsconfig.nextjs.json` — Extends base para Next.js apps

### `@cheia/ui` (`packages/ui`)
Placeholder para componentes UI compartilhados. Atualmente exporta apenas `UI_VERSION`.

---

## 6. Banco de Dados (Supabase / PostgreSQL 17)

### Tabelas

```
organizations
  └── stores
        ├── profiles (profissionais + clientes)
        ├── services
        ├── appointments
        ├── transactions
        ├── professional_services
        └── daily_summaries
```

| Tabela | Descrição | Rows (seed) |
|--------|-----------|-------------|
| `organizations` | Redes/empresas tenant | 1 |
| `stores` | Lojas físicas | 1 |
| `profiles` | Todos os usuários (roles: master, gestor, profissional, cliente) | 20 |
| `services` | Catálogo de serviços | 20 |
| `appointments` | Agendamentos e fila | 10 |
| `transactions` | Pagamentos e comissões | 2 |
| `professional_services` | Serviços por profissional + comissão | 6 |
| `daily_summaries` | Resumo diário (analytics) | 0 |

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado. Políticas divididas por role:

**Anon (Totem + TV):**
- SELECT em services (ativos), profiles (profissionais ativos), appointments
- INSERT em profiles (role = 'cliente'), appointments (source = 'totem')

**Authenticated (Profissional + Recepção + Gestor):**
- Filtra tudo por `store_id` via função `auth_store_id()`
- Gestor/Master pode gerenciar tudo na loja
- Profissional só vê/edita o próprio perfil

**Helper Functions (SECURITY DEFINER — bypassa RLS):**
```sql
auth_store_id()   → retorna store_id do usuário autenticado
auth_role()       → retorna role do usuário autenticado
auth_is_gestor()  → true se gestor ou master
```

### Realtime

Tabelas com Realtime ativo:
- `appointments` (fila ao vivo no totem/TV/recepção)
- `transactions` (vendas ao vivo no gestor)
- `professional_services`

### Migrations

| # | Arquivo | Descrição |
|---|---------|-----------|
| 001 | `001_initial_schema.sql` | Schema base: orgs, stores, profiles, services, appointments |
| 002 | `002_gestor_schema.sql` | Transactions, professional_services, daily_summaries, alterações |
| 003 | `003_fix_rls_recursion.sql` | Corrige recursão infinita nas policies RLS |
| 004 | `004_multi_app_rls.sql` | Políticas por app (anon vs authenticated) |

---

## 7. Variáveis de Ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bbasbwrudkugjzumjyoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Store (qual loja este deploy atende)
NEXT_PUBLIC_STORE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Totem específico
NEXT_PUBLIC_IDLE_TIMEOUT_MS=60000   # Timeout de inatividade
NEXT_PUBLIC_DONE_TIMEOUT_MS=15000   # Tempo na tela de conclusão
```

**Importante:** Cada loja terá seu próprio `NEXT_PUBLIC_STORE_ID`. No Vercel, isso é configurado por projeto ou via variáveis de ambiente diferentes.

---

## 8. Deploy — Vercel (Plano Hobby)

### Estratégia: 1 Repo → 5 Projetos no Vercel

O Turborepo tem integração nativa com Vercel. Cada app vira um projeto separado no Vercel, todos apontando para o **mesmo repositório**.

| Vercel Project | Root Directory | Domínio sugerido |
|----------------|---------------|-------------------|
| `cheia-totem` | `apps/totem` | `totem.cheiadechame.com.br` |
| `cheia-tv` | `apps/tv` | `tv.cheiadechame.com.br` |
| `cheia-recepcao` | `apps/recepcao` | `recepcao.cheiadechame.com.br` |
| `cheia-profissional` | `apps/profissional` | `profissional.cheiadechame.com.br` |
| `cheia-gestor` | `apps/gestor` | `gestor.cheiadechame.com.br` |

### Como configurar cada projeto no Vercel

1. **Import do repo** → "New Project" → seleciona o repo `cheia-de-charme`
2. **Root Directory** → aponta para `apps/totem` (ou o app desejado)
3. **Framework Preset** → Next.js (detectado automaticamente)
4. **Build Command** → `cd ../.. && pnpm turbo build --filter=@cheia/totem` (Vercel auto-detecta com Turborepo)
5. **Environment Variables** → adiciona as variáveis do `.env.example`
6. **Domínio** → configura o subdomínio

### Build inteligente

O Vercel + Turborepo só rebuilda o app que mudou:
- Push que muda apenas `apps/totem/` → só rebuilda o totem
- Push que muda `packages/types/` → rebuilda todos os apps que dependem dele
- Push que muda `apps/gestor/` → só rebuilda o gestor

### Plano Hobby — Limitações

| Recurso | Limite |
|---------|--------|
| Projetos | Ilimitados |
| Deploys | Ilimitados |
| Domínios custom | Sim |
| Bandwidth | 100 GB/mês |
| Serverless execution | 100 GB-Hours/mês |
| Membros do time | 1 (uso pessoal) |
| Uso comercial | Não permitido oficialmente |

> Para produção comercial, migrar para Pro ($20/mês) quando necessário.

---

## 9. Design Tokens

### Cores da Marca
| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | `#EC4899` | Rosa principal |
| `primary-soft` | `#F9A8D4` | Rosa claro |
| `cta` | `#8B5CF6` | Call-to-action (roxo) |
| `bg` | `#FDF2F8` | Background |
| `brand-text` | `#831843` | Texto principal |
| `success` | `#10B981` | Sucesso |
| `warning` | `#F59E0B` | Aviso |
| `error` | `#EF4444` | Erro |

### Fontes
| Token | Fonte | Uso |
|-------|-------|-----|
| `display` | DM Serif Display | Títulos |
| `body` | Plus Jakarta Sans | Corpo/UI |

### Radii
| Token | Valor |
|-------|-------|
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `full` | 9999px |

---

## 10. Supabase Local (Dev)

```bash
# Iniciar Supabase local
supabase start

# Rodar migrations
supabase db reset  # aplica todas as migrations + seed

# Dashboard local
http://localhost:54323
```

**Config (`supabase/config.toml`):**
- API Port: 54321
- DB Port: 54322
- PostgreSQL 17
- Max 1000 rows por request

---

## 11. Checklist de Setup (Novo Dev)

```bash
# 1. Clonar repo
git clone <repo-url>
cd cheia-de-charme

# 2. Instalar dependências
pnpm install

# 3. Configurar ambiente
cp .env.example apps/totem/.env.local
cp .env.example apps/profissional/.env.local
cp .env.example apps/gestor/.env.local
cp .env.example apps/recepcao/.env.local
cp .env.example apps/tv/.env.local
# Editar cada .env.local com as credenciais Supabase

# 4. (Opcional) Supabase local
supabase start
supabase db reset

# 5. Dev server
pnpm dev                         # Todos os apps
pnpm dev --filter @cheia/totem   # Só o totem
```

---

## 12. CI/CD (Ainda não configurado)

Atualmente não há CI/CD configurado. Recomendações:

- **GitHub Actions** para lint + type-check + build em PRs
- **Vercel** para deploy automático em push para `main`
- **Supabase CLI** para migrations em staging/production

---

## 13. Resumo de Números

| Métrica | Valor |
|---------|-------|
| Apps | 5 |
| Packages compartilhados | 4 |
| Arquivos TS/TSX | ~194 |
| Tabelas no banco | 8 |
| Migrations SQL | 4 |
| Profissionais (seed) | 15 |
| Serviços (seed) | 20 |
| Portas dev | 3000-3004 |
