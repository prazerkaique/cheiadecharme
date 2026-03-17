# Cheia de Charme — CRM SaaS Multi-Tenant para Salões de Beleza

## Visão Geral
CRM SaaS multi-tenant para rede de salões de beleza (42 lojas parceiras).
6 visões: Master, Gestor, Profissional, Cliente, Totem, TV.

## Stack
- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Next.js 15 (App Router) + TypeScript strict
- **Estilização:** Tailwind CSS 4 + shadcn/ui customizado
- **Backend:** Supabase (DB, Auth, RLS, Realtime)
- **State:** Zustand (máquina de estados no totem)
- **Forms:** React Hook Form + Zod

## Estrutura
- `apps/totem` — App do totem (kiosk) — Sprint atual
- `packages/ui` — Componentes compartilhados
- `packages/db` — Supabase client + types
- `packages/types` — Types compartilhados
- `packages/config` — Tailwind preset, configs base
- `supabase/` — Migrations e seed

## Cores da Marca
- Primary: `#EC4899` | Secondary: `#F9A8D4`
- CTA: `#8B5CF6` | BG: `#FDF2F8` | Text: `#831843`

## Regras do Totem
- Tela: 1080x1920 (retrato), touch 23.6"
- Font mínimo: 20px | Botões: mín 80px altura
- Touch targets: mín 64x64px | Gap mín: 16px
- Fontes: DM Serif Display (títulos) + Plus Jakarta Sans (corpo)

## Comandos
```bash
pnpm dev --filter totem    # Dev do totem
pnpm build --filter totem  # Build do totem
pnpm dev                   # Dev de tudo
pnpm build                 # Build de tudo
```
