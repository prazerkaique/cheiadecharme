# Supabase Schema -- Cheia de Charme CRM

> Documentacao completa do banco de dados Supabase para o CRM multi-tenant
> da rede de saloes de beleza Cheia de Charme.
>
> Ultima atualizacao: Março 2026

---

## Sumario

1. [Visao Geral da Arquitetura](#1-visao-geral-da-arquitetura)
2. [Diagrama de Relacionamentos](#2-diagrama-de-relacionamentos)
3. [Tabelas -- Descricao Detalhada](#3-tabelas--descricao-detalhada)
4. [RLS (Row Level Security)](#4-rls-row-level-security)
5. [Fluxo de Dados Entre Apps](#5-fluxo-de-dados-entre-apps)
6. [Realtime](#6-realtime)
7. [Seed Data](#7-seed-data)
8. [Tipos TypeScript](#8-tipos-typescript)
9. [Migrations](#9-migrations)
10. [Guia de Operacoes](#10-guia-de-operacoes)

---

## 1. Visao Geral da Arquitetura

### Multi-Tenancy de 2 Niveis

O Cheia de Charme utiliza uma arquitetura **multi-tenant de dois niveis**, projetada para suportar uma rede com 42 lojas parceiras:

```
Nivel 1: Organization (Rede)
    |
    +-- Nivel 2: Store (Loja individual)
            |
            +-- profiles (profissionais, clientes, gestores)
            +-- services (servicos oferecidos)
            +-- appointments (agendamentos e fila)
            +-- transactions (financeiro)
            +-- daily_summaries (relatorios diarios)
            +-- professional_services (vinculo profissional-servico)
```

**Como funciona o isolamento de dados:**

- **Organization** e o agrupamento de nivel mais alto. Representa a rede inteira ("Rede Cheia de Charme"). Todas as lojas da rede pertencem a uma unica organization. Em cenarios futuros, este nivel permitiria que o sistema SaaS atendesse outras redes de saloes como tenants independentes.

- **Store** e a unidade operacional. Cada loja fisica (ex: "Cheia de Charme - Copacabana") e uma store. Todos os dados operacionais -- profissionais, servicos, agendamentos, transacoes -- estao vinculados a uma store especifica atraves do campo `store_id`.

- **Isolamento via `store_id`**: Cada tabela operacional possui uma coluna `store_id` (ou referencia indireta via `professional_id`). As policies de Row Level Security (RLS) garantem que um usuario so consegue ver e manipular dados da sua propria loja.

- **Hierarquia de papeis (roles)**:
  - `master` -- Acesso a todas as lojas da organization. Pode gerenciar qualquer store.
  - `gestor` -- Administrador de uma loja especifica. CRUD completo nos dados da sua store.
  - `profissional` -- Funcionario de uma loja. Leitura dos dados da sua store.
  - `cliente` -- Cliente vinculado a uma loja. Pode ser registrado sem conta de autenticacao (walk-in via totem).

- **Clientes walk-in**: Clientes que chegam presencialmente ao salao e fazem check-in pelo totem nao precisam de conta Supabase Auth. Eles sao cadastrados na tabela `profiles` com `auth_id = NULL` e `role = 'cliente'`. O totem opera com a role `anon` do Supabase.

### Diagrama da Hierarquia de Tenancy

```
+--------------------------------------------------+
|                 organizations                     |
|  "Rede Cheia de Charme"                          |
|  (pode haver N redes no futuro)                  |
+--------------------------------------------------+
         |
         | 1:N (organization_id)
         |
+--------+-------+    +------------------+    +------------------+
|     stores     |    |     stores       |    |     stores       |
|  Copacabana    |    |    Ipanema       |    |    Barra         |
|  (store_id A)  |    |  (store_id B)    |    |  (store_id C)    |
+--------+-------+    +------------------+    +------------------+
         |
         | 1:N (store_id)
         |
   +-----+------+------+------+------+------+
   |     |      |      |      |      |      |
profiles services appointments transactions ...
```

---

## 2. Diagrama de Relacionamentos

```
+------------------+
|  organizations   |
+------------------+
| PK id            |
|    name          |
|    slug (UNIQUE) |
|    created_at    |
+--------+---------+
         |
         | 1:N
         |
+--------+---------+
|     stores       |
+------------------+
| PK id            |
| FK organization_id --> organizations.id (CASCADE)
|    name          |
|    slug (UNIQUE) |
|    address       |
|    phone         |
|    settings      |
|    created_at    |
+--------+---------+
         |
         | 1:N                    1:N                    1:N
         |                         |                      |
+--------+---------+   +-----------+--------+   +---------+----------+
|    profiles      |   |     services       |   |  daily_summaries   |
+------------------+   +--------------------+   +--------------------+
| PK id            |   | PK id              |   | PK id              |
| FK auth_id -----------> auth.users.id (SET NULL)                   |
| FK store_id ----------> stores.id (CASCADE)|   | FK store_id ---------> stores.id
|    name          |   |    name             |   |    summary_date    |
|    cpf           |   |    category         |   |    total_revenue   |
|    phone         |   |    price_cents      |   |    total_appointments
|    email         |   |    duration_minutes |   |    completed_count |
|    role          |   |    is_active        |   |    no_show_count   |
|    avatar_url    |   |    description      |   |    avg_ticket_cents|
|    specialty     |   |    image_url        |   |    created_at      |
|    can_parallel  |   |    created_at       |   +--------------------+
|    is_available  |   +--------+---+--------+   UNIQUE(store_id,
|    commission_rate            |   |              summary_date)
|    hired_at      |            |   |
|    is_active     |            |   |
|    created_at    |            |   |
+---+----+----+----+            |   |
    |    |    |                 |   |
    |    |    |    +------------+   |
    |    |    |    |                |
    |    |    +----+--------+------+---+
    |    |         |        |          |
    |    |   +-----+--------+------+   |
    |    |   | professional_services|   |
    |    |   +---------------------+   |
    |    |   | PK id               |   |
    |    |   | FK professional_id ---> profiles.id (CASCADE)
    |    |   | FK service_id --------> services.id (CASCADE)
    |    |   |    commission_rate   |   |
    |    |   |    is_active         |   |
    |    |   |    created_at        |   |
    |    |   +---------------------+   |
    |    |   UNIQUE(professional_id,   |
    |    |          service_id)        |
    |    |                             |
+---+----+----+----+                   |
|   appointments   |                   |
+------------------+                   |
| PK id            |                   |
| FK store_id ----------> stores.id (CASCADE)
| FK client_id ----------> profiles.id (SET NULL)
| FK professional_id ----> profiles.id (SET NULL)
| FK service_id ----------> services.id (SET NULL)
|    status        |                   |
|    scheduled_at  |                   |
|    checked_in_at |                   |
|    started_at    |                   |
|    completed_at  |                   |
|    queue_position|                   |
|    ticket_number |                   |
|    qr_code       |                   |
|    source        |                   |
|    created_at    |                   |
+------+-----------+                   |
       |                               |
       | 1:1                           |
       |                               |
+------+-----------+                   |
|   transactions   |                   |
+------------------+                   |
| PK id            |                   |
| FK store_id ----------> stores.id (CASCADE)
| FK appointment_id -----> appointments.id (SET NULL)
| FK professional_id ----> profiles.id (SET NULL)
| FK client_id ----------> profiles.id (SET NULL)
| FK service_id ----------> services.id (SET NULL)
|    amount_cents  |
|    commission_cents
|    payment_method|
|    status        |
|    transaction_date
|    notes         |
|    created_at    |
+------------------+
```

### Resumo das Relacoes

| Tabela Origem         | FK                  | Tabela Destino   | On Delete  |
|-----------------------|---------------------|------------------|------------|
| stores                | organization_id     | organizations    | CASCADE    |
| profiles              | auth_id             | auth.users       | SET NULL   |
| profiles              | store_id            | stores           | CASCADE    |
| services              | store_id            | stores           | CASCADE    |
| appointments          | store_id            | stores           | CASCADE    |
| appointments          | client_id           | profiles         | SET NULL   |
| appointments          | professional_id     | profiles         | SET NULL   |
| appointments          | service_id          | services         | SET NULL   |
| professional_services | professional_id     | profiles         | CASCADE    |
| professional_services | service_id          | services         | CASCADE    |
| transactions          | store_id            | stores           | CASCADE    |
| transactions          | appointment_id      | appointments     | SET NULL   |
| transactions          | professional_id     | profiles         | SET NULL   |
| transactions          | client_id           | profiles         | SET NULL   |
| transactions          | service_id          | services         | SET NULL   |
| daily_summaries       | store_id            | stores           | CASCADE    |

**Nota sobre `ON DELETE`:**
- `CASCADE` -- Quando o registro pai e deletado, todos os filhos sao deletados automaticamente. Usado quando os filhos nao fazem sentido sem o pai (ex: deletar uma store deleta todos os seus profissionais).
- `SET NULL` -- Quando o registro pai e deletado, a FK no filho vira NULL. Usado para preservar o historico (ex: deletar um cliente nao apaga seus agendamentos passados, apenas desvincula).

---

## 3. Tabelas -- Descricao Detalhada

### 3.1 `organizations`

**Proposito:** Agrupamento de nivel mais alto. Representa uma rede de saloes (ex: "Rede Cheia de Charme"). Cada organizacao pode ter multiplas lojas.

| Coluna       | Tipo          | Default             | Constraints        | Descricao                                                      |
|-------------|---------------|---------------------|--------------------|----------------------------------------------------------------|
| `id`        | `UUID`        | `gen_random_uuid()` | PRIMARY KEY        | Identificador unico da organizacao.                            |
| `name`      | `TEXT`        | --                  | NOT NULL           | Nome da rede (ex: "Rede Cheia de Charme").                     |
| `slug`      | `TEXT`        | --                  | UNIQUE, NOT NULL   | Identificador URL-friendly. Unico globalmente.                 |
| `created_at`| `TIMESTAMPTZ` | `now()`             | --                 | Data/hora de criacao do registro.                              |

**Foreign Keys:** Nenhuma (tabela raiz).

**Indexes:** Apenas PK e UNIQUE constraint no `slug`.

---

### 3.2 `stores`

**Proposito:** Cada loja fisica da rede. E a unidade operacional -- todos os dados operacionais (profissionais, servicos, fila, financeiro) estao ligados a uma store.

| Coluna             | Tipo          | Default             | Constraints                          | Descricao                                                                 |
|--------------------|---------------|---------------------|--------------------------------------|---------------------------------------------------------------------------|
| `id`              | `UUID`        | `gen_random_uuid()` | PRIMARY KEY                          | Identificador unico da loja.                                              |
| `organization_id` | `UUID`        | --                  | FK -> organizations.id (CASCADE)      | A qual rede esta loja pertence.                                           |
| `name`            | `TEXT`        | --                  | NOT NULL                             | Nome da loja (ex: "Cheia de Charme - Copacabana").                        |
| `slug`            | `TEXT`        | --                  | UNIQUE, NOT NULL                     | Identificador URL-friendly. Unico globalmente.                            |
| `address`         | `TEXT`        | --                  | --                                   | Endereco completo da loja.                                                |
| `phone`           | `TEXT`        | --                  | --                                   | Telefone de contato da loja.                                              |
| `settings`        | `JSONB`       | `'{}'`              | --                                   | Configuracoes da loja em JSON. Campos usados: `open_time`, `close_time`, `max_queue`, `ticket_prefix`. |
| `created_at`      | `TIMESTAMPTZ` | `now()`             | --                                   | Data/hora de criacao do registro.                                         |

**Foreign Keys:**
- `organization_id` -> `organizations.id` (ON DELETE CASCADE). Se a organizacao for deletada, todas as suas lojas sao removidas.

**Indexes:**
- PK em `id`
- UNIQUE constraint em `slug`

**Campo `settings` (JSONB) -- Estrutura esperada:**

```json
{
  "open_time": "09:00",       // Horario de abertura (HH:MM)
  "close_time": "19:00",      // Horario de fechamento (HH:MM)
  "max_queue": 50,            // Maximo de pessoas na fila
  "ticket_prefix": "CCC"      // Prefixo para senhas (ex: CCC-001, CCC-002)
}
```

---

### 3.3 `profiles`

**Proposito:** Tabela central de pessoas. Armazena todos os usuarios do sistema: clientes, profissionais (cabeleireiras, manicures, etc.), gestores e masters. Um perfil sempre pertence a uma store. Clientes walk-in (via totem) nao precisam de conta Supabase Auth (`auth_id = NULL`).

| Coluna            | Tipo           | Default             | Constraints                                              | Descricao                                                                    |
|-------------------|----------------|---------------------|----------------------------------------------------------|------------------------------------------------------------------------------|
| `id`             | `UUID`         | `gen_random_uuid()` | PRIMARY KEY                                              | Identificador unico do perfil.                                               |
| `auth_id`        | `UUID`         | --                  | FK -> auth.users.id (SET NULL)                           | Vinculo com Supabase Auth. NULL para clientes walk-in (totem).               |
| `store_id`       | `UUID`         | --                  | FK -> stores.id (CASCADE)                                | A qual loja este perfil pertence.                                            |
| `name`           | `TEXT`         | --                  | NOT NULL                                                 | Nome completo da pessoa.                                                     |
| `cpf`            | `TEXT`         | --                  | --                                                       | CPF do cliente. Usado para identificacao no totem. Formato: 000.000.000-00.  |
| `phone`          | `TEXT`         | --                  | --                                                       | Telefone. Usado como metodo alternativo de identificacao no totem.            |
| `email`          | `TEXT`         | --                  | --                                                       | Email do usuario.                                                            |
| `role`           | `TEXT`         | --                  | CHECK IN ('master','gestor','profissional','cliente')    | Papel do usuario no sistema. Determina nivel de acesso.                      |
| `avatar_url`     | `TEXT`         | --                  | --                                                       | URL da foto de perfil (Supabase Storage).                                    |
| `specialty`      | `TEXT`         | --                  | --                                                       | Especialidade do profissional (ex: "Cabelo", "Unhas", "Sobrancelha").        |
| `can_parallel`   | `INT`          | `1`                 | --                                                       | Quantos atendimentos simultaneos o profissional pode fazer. Ex: manicure pode fazer 2 (mao e pe ao mesmo tempo). |
| `is_available`   | `BOOLEAN`      | `false`             | --                                                       | Se o profissional esta disponivel para atendimento agora (presenca/status).   |
| `commission_rate`| `DECIMAL(5,2)` | `50.00`             | --                                                       | Percentual de comissao padrao do profissional (ex: 50.00 = 50%).             |
| `hired_at`       | `DATE`         | --                  | --                                                       | Data de contratacao do profissional.                                         |
| `is_active`      | `BOOLEAN`      | `true`              | --                                                       | Se o perfil esta ativo no sistema (soft-delete).                             |
| `created_at`     | `TIMESTAMPTZ`  | `now()`             | --                                                       | Data/hora de criacao do registro.                                            |

**Observacoes sobre colunas adicionadas na migration 002:**
- `commission_rate`, `hired_at` e `is_active` foram adicionados pela migration 002_gestor_schema.sql para suportar funcionalidades do app do gestor.

**Foreign Keys:**
- `auth_id` -> `auth.users.id` (ON DELETE SET NULL). Se a conta Auth for deletada, o perfil permanece mas perde o vinculo de login.
- `store_id` -> `stores.id` (ON DELETE CASCADE). Se a loja for deletada, todos os seus perfis sao removidos.

**Indexes:**
- `idx_profiles_cpf` em `cpf` -- Busca rapida por CPF no totem para identificar cliente.
- `idx_profiles_phone` em `phone` -- Busca rapida por telefone no totem para identificar cliente.
- `idx_profiles_store_id` em `store_id` -- Listar todos os perfis de uma loja (profissionais, clientes).

**Valores possiveis para `role`:**

| Role           | Descricao                                                                        |
|---------------|----------------------------------------------------------------------------------|
| `master`      | Administrador da rede. Acesso total a todas as lojas.                            |
| `gestor`      | Gerente de uma loja. CRUD completo nos dados da sua loja.                        |
| `profissional`| Profissional de beleza (cabeleireira, manicure, etc.). Visualiza dados da loja.  |
| `cliente`     | Cliente do salao. Pode ser walk-in (sem auth) ou registrado.                     |

**Especialidades usadas no seed:**

| Especialidade  | Qtd Profissionais |
|---------------|-------------------|
| Cabelo        | 4                 |
| Unhas         | 3                 |
| Sobrancelha   | 3                 |
| Maquiagem     | 2                 |
| Depilacao      | 3                 |

---

### 3.4 `services`

**Proposito:** Catalogo de servicos oferecidos por cada loja. Cada servico tem preco (em centavos de BRL), duracao em minutos e categoria.

| Coluna             | Tipo          | Default             | Constraints                    | Descricao                                                    |
|--------------------|---------------|---------------------|-------------------------------|--------------------------------------------------------------|
| `id`              | `UUID`        | `gen_random_uuid()` | PRIMARY KEY                   | Identificador unico do servico.                              |
| `store_id`        | `UUID`        | --                  | FK -> stores.id (CASCADE)      | A qual loja este servico pertence.                           |
| `name`            | `TEXT`        | --                  | NOT NULL                      | Nome do servico (ex: "Corte Feminino", "Manicure").          |
| `category`        | `TEXT`        | --                  | NOT NULL                      | Categoria do servico (ex: "Cabelo", "Unhas").                |
| `price_cents`     | `INT`         | --                  | NOT NULL                      | Preco em centavos de BRL. Ex: 8000 = R$ 80,00.              |
| `duration_minutes`| `INT`         | --                  | NOT NULL                      | Duracao estimada em minutos.                                 |
| `is_active`       | `BOOLEAN`     | `true`              | --                            | Se o servico esta disponivel para agendamento.               |
| `description`     | `TEXT`        | --                  | --                            | Descricao detalhada do servico. (adicionado na migration 002)|
| `image_url`       | `TEXT`        | --                  | --                            | URL da imagem do servico. (adicionado na migration 002)      |
| `created_at`      | `TIMESTAMPTZ` | `now()`             | --                            | Data/hora de criacao do registro.                            |

**Foreign Keys:**
- `store_id` -> `stores.id` (ON DELETE CASCADE). Se a loja for deletada, todos os seus servicos sao removidos.

**Indexes:**
- `idx_services_store_id` em `store_id` -- Listar todos os servicos de uma loja.

**Categorias usadas no seed:**

| Categoria    | Qtd Servicos | Faixa de Preco (BRL) |
|-------------|-------------|----------------------|
| Cabelo      | 6           | R$ 50,00 - R$ 250,00|
| Unhas       | 4           | R$ 35,00 - R$ 90,00 |
| Sobrancelha | 3           | R$ 40,00 - R$ 650,00|
| Maquiagem   | 3           | R$ 120,00 - R$ 350,00|
| Depilacao    | 4           | R$ 25,00 - R$ 80,00 |

---

### 3.5 `appointments`

**Proposito:** Tabela central de agendamentos e fila de atendimento. Registra tanto agendamentos previos quanto check-ins presenciais (walk-in via totem). Cada appointment acompanha o ciclo de vida completo: agendado -> check-in -> espera -> em atendimento -> concluido.

| Coluna            | Tipo          | Default             | Constraints                                                          | Descricao                                                                     |
|-------------------|---------------|---------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `id`             | `UUID`        | `gen_random_uuid()` | PRIMARY KEY                                                          | Identificador unico do agendamento.                                           |
| `store_id`       | `UUID`        | --                  | FK -> stores.id (CASCADE)                                             | A qual loja pertence este agendamento.                                        |
| `client_id`      | `UUID`        | --                  | FK -> profiles.id (SET NULL)                                          | O cliente que fez o agendamento.                                              |
| `professional_id`| `UUID`        | --                  | FK -> profiles.id (SET NULL)                                          | O profissional designado para atender. Pode ser NULL se "qualquer profissional". |
| `service_id`     | `UUID`        | --                  | FK -> services.id (SET NULL)                                          | O servico solicitado.                                                         |
| `status`         | `TEXT`        | --                  | CHECK IN ('scheduled','checked_in','waiting','in_progress','completed','no_show') | Estado atual do agendamento (veja maquina de estados abaixo).        |
| `scheduled_at`   | `TIMESTAMPTZ` | --                  | --                                                                   | Data/hora agendada para o atendimento.                                        |
| `checked_in_at`  | `TIMESTAMPTZ` | --                  | --                                                                   | Data/hora em que o cliente fez check-in (chegou na loja).                     |
| `started_at`     | `TIMESTAMPTZ` | --                  | --                                                                   | Data/hora em que o atendimento comecou.                                       |
| `completed_at`   | `TIMESTAMPTZ` | --                  | --                                                                   | Data/hora em que o atendimento foi concluido.                                 |
| `queue_position` | `INT`         | --                  | --                                                                   | Posicao na fila de espera. NULL se nao esta na fila.                          |
| `ticket_number`  | `TEXT`        | --                  | --                                                                   | Numero da senha (ex: "CCC-001"). Exibido no display/TV e no ticket impresso.  |
| `qr_code`        | `TEXT`        | --                  | --                                                                   | QR code para o cliente acompanhar o status do atendimento.                    |
| `source`         | `TEXT`        | --                  | CHECK IN ('totem','app','whatsapp','web','gestor')                    | Origem do agendamento. De onde o cliente fez o booking.                       |
| `created_at`     | `TIMESTAMPTZ` | `now()`             | --                                                                   | Data/hora de criacao do registro.                                             |

**Foreign Keys:**
- `store_id` -> `stores.id` (ON DELETE CASCADE)
- `client_id` -> `profiles.id` (ON DELETE SET NULL) -- Preserva o historico mesmo se o cliente for deletado.
- `professional_id` -> `profiles.id` (ON DELETE SET NULL) -- Preserva o historico se o profissional sair.
- `service_id` -> `services.id` (ON DELETE SET NULL) -- Preserva o historico se o servico for descontinuado.

**Indexes:**
- `idx_appointments_store_status` em `(store_id, status)` -- Consulta principal: "quais agendamentos da loja X estao com status Y?". Usado pela fila, TV, painel do gestor.
- `idx_appointments_client_id` em `client_id` -- Historico de atendimentos de um cliente.

**Maquina de Estados (`status`):**

```
                                    +----------+
                                    | no_show  |
                                    +----------+
                                         ^
                                         | (nao compareceu)
                                         |
+----------+    +----------+    +---------+    +-------------+    +-----------+
| scheduled| -> |checked_in| -> | waiting | -> | in_progress | -> | completed |
+----------+    +----------+    +---------+    +-------------+    +-----------+
                     ^
                     |
              (walk-in direto via totem)
```

| Status        | Descricao                                                                        |
|--------------|----------------------------------------------------------------------------------|
| `scheduled`  | Agendamento feito mas cliente ainda nao chegou. Tem `scheduled_at` preenchido.   |
| `checked_in` | Cliente fez check-in (confirmou presenca). `checked_in_at` preenchido.           |
| `waiting`    | Cliente na fila de espera. `queue_position` preenchido.                          |
| `in_progress`| Atendimento em andamento. `started_at` preenchido.                               |
| `completed`  | Atendimento concluido. `completed_at` preenchido.                                |
| `no_show`    | Cliente nao compareceu ao agendamento.                                           |

**Origens (`source`):**

| Source      | Descricao                                             |
|------------|-------------------------------------------------------|
| `totem`    | Check-in presencial pelo totem (kiosk).               |
| `app`      | Agendamento feito pelo app do cliente.                |
| `whatsapp` | Agendamento feito via WhatsApp (integracao futura).   |
| `web`      | Agendamento feito pelo site.                          |
| `gestor`   | Agendamento criado manualmente pelo gestor.           |

---

### 3.6 `professional_services`

**Proposito:** Tabela de relacionamento N:N entre profissionais e servicos. Define quais servicos cada profissional realiza, com possibilidade de comissao personalizada por servico.

| Coluna            | Tipo           | Default             | Constraints                                       | Descricao                                                             |
|-------------------|----------------|---------------------|---------------------------------------------------|-----------------------------------------------------------------------|
| `id`             | `UUID`         | `gen_random_uuid()` | PRIMARY KEY                                       | Identificador unico do vinculo.                                       |
| `professional_id`| `UUID`         | --                  | FK -> profiles.id (CASCADE)                        | O profissional.                                                       |
| `service_id`     | `UUID`         | --                  | FK -> services.id (CASCADE)                        | O servico que o profissional realiza.                                 |
| `commission_rate`| `DECIMAL(5,2)` | --                  | --                                                | Comissao especifica para este servico. NULL = usa o `commission_rate` padrao do profile. |
| `is_active`      | `BOOLEAN`      | `true`              | --                                                | Se o profissional esta atualmente realizando este servico.            |
| `created_at`     | `TIMESTAMPTZ`  | `now()`             | --                                                | Data/hora de criacao do registro.                                     |

**Constraints especiais:**
- `UNIQUE(professional_id, service_id)` -- Um profissional so pode ter um vinculo por servico.

**Foreign Keys:**
- `professional_id` -> `profiles.id` (ON DELETE CASCADE) -- Se o profissional for deletado, seus vinculos sao removidos.
- `service_id` -> `services.id` (ON DELETE CASCADE) -- Se o servico for deletado, seus vinculos sao removidos.

**Indexes:**
- `idx_prof_services_prof` em `professional_id` -- "Quais servicos este profissional faz?"
- `idx_prof_services_svc` em `service_id` -- "Quais profissionais fazem este servico?"

**Logica de comissao:**
- Se `commission_rate` estiver preenchido nesta tabela, ele tem prioridade.
- Se `commission_rate` for NULL, o sistema usa o valor padrao do `profiles.commission_rate`.
- Exemplo: Uma manicure tem comissao padrao de 50%, mas para "Gel nas Unhas" recebe 60%.

---

### 3.7 `transactions`

**Proposito:** Registro financeiro de cada atendimento concluido. Armazena valor cobrado, comissao do profissional, metodo de pagamento e status financeiro. Vinculado a um appointment para rastreabilidade completa.

| Coluna            | Tipo          | Default             | Constraints                                                     | Descricao                                                              |
|-------------------|---------------|---------------------|-----------------------------------------------------------------|------------------------------------------------------------------------|
| `id`             | `UUID`        | `gen_random_uuid()` | PRIMARY KEY                                                     | Identificador unico da transacao.                                      |
| `store_id`       | `UUID`        | --                  | FK -> stores.id (CASCADE)                                        | A qual loja pertence esta transacao.                                   |
| `appointment_id` | `UUID`        | --                  | FK -> appointments.id (SET NULL)                                 | O agendamento que gerou esta transacao.                                |
| `professional_id`| `UUID`        | --                  | FK -> profiles.id (SET NULL)                                     | O profissional que realizou o atendimento.                             |
| `client_id`      | `UUID`        | --                  | FK -> profiles.id (SET NULL)                                     | O cliente atendido.                                                    |
| `service_id`     | `UUID`        | --                  | FK -> services.id (SET NULL)                                     | O servico prestado.                                                    |
| `amount_cents`   | `INT`         | --                  | NOT NULL                                                        | Valor total cobrado em centavos de BRL. Ex: 8000 = R$ 80,00.          |
| `commission_cents`| `INT`        | --                  | NOT NULL                                                        | Valor da comissao do profissional em centavos.                         |
| `payment_method` | `TEXT`        | `'cash'`            | CHECK IN ('cash','credit','debit','pix','charmes')              | Forma de pagamento utilizada.                                          |
| `status`         | `TEXT`        | `'completed'`       | CHECK IN ('pending','completed','cancelled','refunded')          | Status financeiro da transacao.                                        |
| `transaction_date`| `TIMESTAMPTZ`| `now()`             | --                                                              | Data/hora da transacao.                                                |
| `notes`          | `TEXT`        | --                  | --                                                              | Observacoes adicionais (ex: "desconto de 10%", "cortesia").            |
| `created_at`     | `TIMESTAMPTZ` | `now()`             | --                                                              | Data/hora de criacao do registro.                                      |

**Foreign Keys:**
- `store_id` -> `stores.id` (ON DELETE CASCADE)
- `appointment_id` -> `appointments.id` (ON DELETE SET NULL)
- `professional_id` -> `profiles.id` (ON DELETE SET NULL)
- `client_id` -> `profiles.id` (ON DELETE SET NULL)
- `service_id` -> `services.id` (ON DELETE SET NULL)

**Indexes:**
- `idx_transactions_store_date` em `(store_id, transaction_date)` -- Relatorios financeiros por loja e periodo.
- `idx_transactions_professional` em `professional_id` -- Relatorio de comissoes por profissional.

**Metodos de pagamento:**

| Metodo    | Descricao                                                        |
|----------|------------------------------------------------------------------|
| `cash`   | Dinheiro.                                                        |
| `credit` | Cartao de credito.                                               |
| `debit`  | Cartao de debito.                                                |
| `pix`    | Pix (transferencia instantanea).                                 |
| `charmes`| Moeda interna / programa de fidelidade (creditos do salao).      |

**Status financeiro:**

| Status      | Descricao                                            |
|------------|------------------------------------------------------|
| `pending`  | Pagamento ainda nao confirmado.                      |
| `completed`| Pagamento recebido e confirmado.                     |
| `cancelled`| Transacao cancelada (servico nao foi prestado).      |
| `refunded` | Estorno realizado (devolucao ao cliente).             |

---

### 3.8 `daily_summaries`

**Proposito:** Resumos diarios pre-computados por loja. Agrega metricas de desempenho do dia: receita total, numero de atendimentos, taxa de no-show e ticket medio. Evita queries pesadas em tempo real para dashboards.

| Coluna              | Tipo          | Default             | Constraints                         | Descricao                                                        |
|---------------------|---------------|---------------------|-------------------------------------|------------------------------------------------------------------|
| `id`               | `UUID`        | `gen_random_uuid()` | PRIMARY KEY                         | Identificador unico do resumo.                                   |
| `store_id`         | `UUID`        | --                  | FK -> stores.id (CASCADE)            | A qual loja pertence este resumo.                                |
| `summary_date`     | `DATE`        | --                  | NOT NULL                            | A data a que este resumo se refere (ex: 2026-03-17).             |
| `total_revenue`    | `INT`         | `0`                 | --                                  | Receita total do dia em centavos de BRL.                         |
| `total_appointments`| `INT`        | `0`                 | --                                  | Total de agendamentos do dia (todos os status).                  |
| `completed_count`  | `INT`         | `0`                 | --                                  | Quantos atendimentos foram concluidos.                           |
| `no_show_count`    | `INT`         | `0`                 | --                                  | Quantos clientes nao compareceram.                               |
| `avg_ticket_cents` | `INT`         | `0`                 | --                                  | Ticket medio em centavos de BRL (receita / atendimentos concluidos).|
| `created_at`       | `TIMESTAMPTZ` | `now()`             | --                                  | Data/hora de criacao do registro.                                |

**Constraints especiais:**
- `UNIQUE(store_id, summary_date)` -- Apenas um resumo por loja por dia.

**Foreign Keys:**
- `store_id` -> `stores.id` (ON DELETE CASCADE)

**Indexes:**
- `idx_daily_summaries_store` em `(store_id, summary_date)` -- Buscar resumo de uma loja em uma data ou range de datas.

---

## 4. RLS (Row Level Security)

Todas as 8 tabelas tem RLS habilitado. As policies sao divididas em dois grupos:

1. **Policies `anon`** (migration 001) -- Para o totem e fluxos sem autenticacao.
2. **Policies `authenticated`** (migration 002) -- Para gestores, profissionais e masters logados.

### 4.1 Policies para role `anon` (Totem / Kiosk)

O totem opera como cliente anonimo (sem login). Ele precisa:
- Ler dados da loja, profissionais e servicos para exibir nas telas.
- Cadastrar clientes walk-in.
- Criar e atualizar agendamentos (fila).

| #  | Nome da Policy            | Tabela        | Operacao | Logica (USING / WITH CHECK)                                  | Explicacao em Portugues                                                |
|----|--------------------------|---------------|----------|--------------------------------------------------------------|------------------------------------------------------------------------|
| 1  | `anon_select_stores`     | `stores`      | SELECT   | `USING (true)`                                               | O totem pode ler qualquer loja. O filtro por loja e feito no app (via `NEXT_PUBLIC_STORE_ID`). |
| 2  | `anon_select_profiles`   | `profiles`    | SELECT   | `USING (true)`                                               | O totem pode ler qualquer perfil. Necessario para listar profissionais e buscar clientes por CPF/telefone. |
| 3  | `anon_insert_profiles`   | `profiles`    | INSERT   | `WITH CHECK (role = 'cliente')`                              | O totem so pode criar perfis com role `cliente`. Impede que o totem crie gestores ou profissionais. |
| 4  | `anon_select_services`   | `services`    | SELECT   | `USING (is_active = true)`                                   | O totem so pode ver servicos ativos. Servicos desativados nao aparecem no catalogo. |
| 5  | `anon_select_appointments`| `appointments`| SELECT  | `USING (true)`                                               | O totem pode ler qualquer agendamento. Necessario para exibir posicao na fila e status. |
| 6  | `anon_insert_appointments`| `appointments`| INSERT  | `WITH CHECK (true)`                                          | O totem pode criar novos agendamentos (check-in e booking).            |
| 7  | `anon_update_appointments`| `appointments`| UPDATE  | `USING (true)` + `WITH CHECK (true)`                        | O totem pode atualizar agendamentos. Ex: cliente escaneia QR code para confirmar check-in. |

### 4.2 Policies para role `authenticated` (Gestor / Profissional / Master)

Usuarios autenticados operam via Supabase Auth. O isolamento e baseado em: "o usuario logado so ve/edita dados da sua propria loja". A loja do usuario e determinada pela subquery:

```sql
SELECT store_id FROM profiles WHERE auth_id = auth.uid()
```

Para verificar se o usuario tem permissao de gestor/master:

```sql
SELECT store_id FROM profiles WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
```

#### Tabela `stores`

| #  | Nome da Policy              | Operacao | Logica                                                                   | Explicacao                                                                |
|----|----------------------------|----------|--------------------------------------------------------------------------|---------------------------------------------------------------------------|
| 8  | `auth_select_own_store`    | SELECT   | `USING (id IN (subquery: store_id do usuario logado))`                   | Usuarios autenticados so podem ver a loja a que pertencem.               |
| 9  | `auth_gestor_update_store` | UPDATE   | `USING/WITH CHECK (id IN (subquery: store_id onde usuario e gestor/master))` | Apenas gestores e masters podem editar dados da loja (nome, telefone, settings). |

#### Tabela `profiles`

| #  | Nome da Policy                  | Operacao | Logica                                                                       | Explicacao                                                                    |
|----|--------------------------------|----------|------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| 10 | `auth_select_own_store_profiles`| SELECT  | `USING (store_id IN (subquery: store_id do usuario logado))`                 | Qualquer usuario autenticado pode ver os perfis da sua loja.                 |
| 11 | `auth_gestor_manage_profiles`   | ALL     | `USING/WITH CHECK (store_id IN (subquery: store_id onde usuario e gestor/master))` | Gestores e masters podem criar, editar e deletar perfis da sua loja (ex: cadastrar novo profissional). |

#### Tabela `services`

| #  | Nome da Policy                  | Operacao | Logica                                                                       | Explicacao                                                                    |
|----|--------------------------------|----------|------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| 12 | `auth_select_own_store_services`| SELECT  | `USING (store_id IN (subquery: store_id do usuario logado))`                 | Qualquer usuario autenticado pode ver os servicos da sua loja.               |
| 13 | `auth_gestor_manage_services`   | ALL     | `USING/WITH CHECK (store_id IN (subquery: store_id onde usuario e gestor/master))` | Gestores e masters podem criar, editar e deletar servicos.                   |

#### Tabela `professional_services`

| #  | Nome da Policy                      | Operacao | Logica                                                                               | Explicacao                                                                  |
|----|-------------------------------------|----------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| 14 | `auth_select_prof_services`         | SELECT   | `USING (professional_id IN (profiles da mesma loja do usuario logado))`               | Qualquer usuario autenticado pode ver os vinculos profissional-servico da sua loja. |
| 15 | `auth_gestor_manage_prof_services`  | ALL      | `USING/WITH CHECK (professional_id IN (profiles da loja onde usuario e gestor/master))` | Gestores e masters podem gerenciar quais servicos cada profissional realiza. |

#### Tabela `transactions`

| #  | Nome da Policy                      | Operacao | Logica                                                                       | Explicacao                                                                 |
|----|-------------------------------------|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| 16 | `auth_select_own_store_transactions`| SELECT   | `USING (store_id IN (subquery: store_id do usuario logado))`                 | Qualquer usuario autenticado pode ver as transacoes da sua loja.          |
| 17 | `auth_gestor_manage_transactions`   | ALL      | `USING/WITH CHECK (store_id IN (subquery: store_id onde usuario e gestor/master))` | Gestores e masters podem criar, editar e deletar transacoes.              |

#### Tabela `daily_summaries`

| #  | Nome da Policy                     | Operacao | Logica                                                                       | Explicacao                                                                |
|----|-----------------------------------|----------|------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| 18 | `auth_select_own_store_summaries` | SELECT   | `USING (store_id IN (subquery: store_id do usuario logado))`                 | Qualquer usuario autenticado pode ver os resumos diarios da sua loja.    |
| 19 | `auth_gestor_manage_summaries`    | ALL      | `USING/WITH CHECK (store_id IN (subquery: store_id onde usuario e gestor/master))` | Gestores e masters podem criar e editar resumos diarios.                 |

#### Tabela `appointments`

| #  | Nome da Policy                        | Operacao | Logica                                                                   | Explicacao                                                              |
|----|--------------------------------------|----------|--------------------------------------------------------------------------|-------------------------------------------------------------------------|
| 20 | `auth_select_own_store_appointments` | SELECT   | `USING (store_id IN (subquery: store_id do usuario logado))`             | Qualquer usuario autenticado pode ver os agendamentos da sua loja.     |

#### Tabela `organizations`

> **Nota:** A tabela `organizations` tem RLS habilitado mas **nao possui policies definidas** nas migrations atuais. Isso significa que, por padrao, nenhuma role consegue acessar esta tabela via RLS. O acesso e feito via `service_role` (backend) ou sera adicionado em migrations futuras.

### 4.3 Resumo Visual de Permissoes

```
                 organizations  stores  profiles  services  appointments  prof_services  transactions  daily_summaries
anon               --          READ    READ/INS*  READ**     READ/INS/UPD    --              --            --
authenticated      --          READ    READ       READ       READ            READ            READ          READ
gestor/master      --          READ/UPD  ALL      ALL        READ            ALL             ALL           ALL
```

`*` INSERT apenas com role='cliente'
`**` SELECT apenas onde is_active=true

---

## 5. Fluxo de Dados Entre Apps

A tabela abaixo mostra como cada aplicativo do ecossistema interage com as tabelas do banco:

| Tabela                | Totem (Kiosk)     | Gestor (Admin)     | Profissional       | Recepcao           | TV (Display)       |
|-----------------------|-------------------|--------------------|--------------------|--------------------|-------------------|
| `organizations`      | --                | Read               | --                 | --                 | --                |
| `stores`             | Read              | Read / Update      | Read               | Read               | Read              |
| `profiles`           | Read / Create*    | CRUD               | Read               | Read / Create*     | Read              |
| `services`           | Read              | CRUD               | Read               | Read               | Read              |
| `appointments`       | Read / Create / Update | CRUD          | Read / Update**    | Read / Create / Update | Read          |
| `professional_services`| --              | CRUD               | Read               | Read               | --                |
| `transactions`       | --                | CRUD               | Read               | Create             | --                |
| `daily_summaries`    | --                | Read / Write       | Read               | --                 | Read              |

**Legenda:**
- `*` Apenas clientes (role='cliente')
- `**` O profissional atualiza status do agendamento (in_progress -> completed)
- `CRUD` = Create, Read, Update, Delete

### Detalhamento por App

**Totem (Kiosk):**
- Le a store para exibir informacoes da loja na tela inicial.
- Le profiles para listar profissionais disponiveis e buscar clientes por CPF/telefone.
- Cria profiles para registrar clientes walk-in que nunca visitaram o salao.
- Le services para exibir o catalogo de servicos.
- Cria appointments para check-in e booking.
- Atualiza appointments para transicoes de status (ex: checked_in -> waiting).

**Gestor (Admin):**
- Gerencia tudo da sua loja: profissionais, servicos, fila, transacoes, resumos.
- Unico app que pode UPDATE a tabela stores (alterar configuracoes da loja).
- Cria vinculos professional_services.
- Visualiza e gerencia transacoes financeiras.
- Gera/visualiza resumos diarios.

**Profissional:**
- Visualiza a fila de atendimento da sua loja.
- Atualiza status dos seus proprios agendamentos (iniciar/concluir atendimento).
- Visualiza seus vinculos de servicos e comissoes.
- Visualiza transacoes (suas comissoes).

**Recepcao:**
- Similar ao totem, mas operado por um(a) recepcionista.
- Pode cadastrar clientes e criar agendamentos.
- Pode atualizar status da fila.
- Pode registrar transacoes (receber pagamento).

**TV (Display):**
- Somente leitura. Exibe a fila de atendimento em tempo real.
- Le appointments com status 'waiting' e 'in_progress' para exibir no painel.
- Le profiles para exibir nome do profissional.
- Recebe updates via Realtime (subscription na tabela appointments).

---

## 6. Realtime

O Supabase Realtime permite que as aplicacoes recebam atualizacoes em tempo real via WebSocket, sem precisar fazer polling.

### Tabelas com Realtime habilitado

| Tabela                | Migration | Motivo                                                                                             |
|-----------------------|-----------|----------------------------------------------------------------------------------------------------|
| `appointments`       | 001       | A tabela mais critica para Realtime. Quando um agendamento muda de status (ex: waiting -> in_progress), todos os apps conectados recebem a mudanca instantaneamente. Usado por: TV (atualizar painel), Totem (atualizar posicao na fila), Gestor (dashboard em tempo real), Profissional (notificacao de proximo cliente). |
| `transactions`       | 002       | O gestor recebe notificacao quando uma nova transacao e registrada. Permite atualizar dashboards financeiros em tempo real. |
| `professional_services`| 002     | Quando o gestor altera os servicos de um profissional, o app do profissional reflete a mudanca imediatamente. |

### Como e habilitado

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE professional_services;
```

### Como consumir no frontend

```typescript
import { supabase } from '@cheia/db';

// Escutar mudancas em appointments de uma loja
const channel = supabase
  .channel('queue-updates')
  .on(
    'postgres_changes',
    {
      event: '*',           // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'appointments',
      filter: `store_id=eq.${storeId}`,
    },
    (payload) => {
      console.log('Mudanca na fila:', payload);
      // Atualizar state local (Zustand store)
    }
  )
  .subscribe();
```

### Tabelas SEM Realtime

| Tabela              | Motivo para nao ter Realtime                                                   |
|--------------------|--------------------------------------------------------------------------------|
| `organizations`    | Raramente muda. Nao precisa de updates em tempo real.                          |
| `stores`           | Configuracoes mudam raramente. Um reload e suficiente.                         |
| `profiles`         | Mudancas sao pontuais (cadastro, edicao). Nao exige tempo real.               |
| `services`         | Catalogo muda com pouca frequencia.                                           |
| `daily_summaries`  | Resumos sao calculados periodicamente, nao em tempo real.                     |

---

## 7. Seed Data

O arquivo `supabase/seed.sql` carrega dados de teste para desenvolvimento e staging. O `NEXT_PUBLIC_STORE_ID` fixo e `a1b2c3d4-e5f6-7890-abcd-ef1234567890`.

### 7.1 Organizacao

| ID                                      | Nome                   | Slug                      |
|-----------------------------------------|------------------------|---------------------------|
| `f0000000-0000-0000-0000-000000000001`  | Rede Cheia de Charme   | rede-cheia-de-charme      |

### 7.2 Loja

| ID                                      | Nome                           | Slug                          | Endereco                                                  | Telefone          |
|-----------------------------------------|--------------------------------|-------------------------------|-----------------------------------------------------------|-------------------|
| `a1b2c3d4-e5f6-7890-abcd-ef1234567890`  | Cheia de Charme - Copacabana  | cheia-de-charme-copacabana    | Av. Nossa Senhora de Copacabana, 500 - Copacabana, RJ     | (21) 99000-0001   |

**Settings da loja:**
```json
{
  "open_time": "09:00",
  "close_time": "19:00",
  "max_queue": 50,
  "ticket_prefix": "CCC"
}
```

### 7.3 Profissionais (15)

| ID (sufixo) | Nome                 | Especialidade | Atendimentos Paralelos | Disponivel |
|------------|----------------------|---------------|------------------------|------------|
| ...001     | Ana Paula Ferreira   | Cabelo        | 1                      | Sim        |
| ...002     | Juliana Nascimento   | Cabelo        | 1                      | Sim        |
| ...003     | Rodrigo Mendes       | Cabelo        | 1                      | Nao        |
| ...004     | Camila Souza         | Cabelo        | 1                      | Sim        |
| ...005     | Fernanda Lima        | Unhas         | 2                      | Sim        |
| ...006     | Bruna Oliveira       | Unhas         | 2                      | Sim        |
| ...007     | Patricia Costa       | Unhas         | 2                      | Nao        |
| ...008     | Larissa Alves        | Sobrancelha   | 1                      | Sim        |
| ...009     | Tatiane Rocha        | Sobrancelha   | 1                      | Sim        |
| ...010     | Monique Dias         | Sobrancelha   | 1                      | Sim        |
| ...011     | Vanessa Cardoso      | Maquiagem     | 1                      | Sim        |
| ...012     | Isabela Martins      | Maquiagem     | 1                      | Nao        |
| ...013     | Aline Santos         | Depilacao      | 1                      | Sim        |
| ...014     | Renata Pereira       | Depilacao      | 1                      | Sim        |
| ...015     | Daniela Moreira      | Depilacao      | 1                      | Nao        |

**Nota:** Profissionais com `is_available = false` (Rodrigo, Patricia, Isabela, Daniela) simulam profissionais que nao estao trabalhando no momento (dia de folga, ferias, etc.).

**Nota:** Profissionais de Unhas tem `can_parallel = 2`, pois podem atender mao e pe simultaneamente.

### 7.4 Servicos (20)

| ID (sufixo) | Nome                                  | Categoria    | Preco (BRL)  | Duracao (min) |
|------------|---------------------------------------|-------------|-------------|---------------|
| ...001     | Corte Feminino                        | Cabelo      | R$ 80,00    | 60            |
| ...002     | Corte Masculino                       | Cabelo      | R$ 50,00    | 40            |
| ...003     | Escova Progressiva                    | Cabelo      | R$ 250,00   | 150           |
| ...004     | Coloracao                              | Cabelo      | R$ 180,00   | 120           |
| ...005     | Hidratacao Capilar                     | Cabelo      | R$ 70,00    | 60            |
| ...006     | Escova Simples                        | Cabelo      | R$ 60,00    | 50            |
| ...007     | Manicure                              | Unhas       | R$ 35,00    | 40            |
| ...008     | Pedicure                              | Unhas       | R$ 45,00    | 50            |
| ...009     | Gel nas Unhas                         | Unhas       | R$ 90,00    | 90            |
| ...010     | Nail Art                              | Unhas       | R$ 60,00    | 60            |
| ...011     | Design de Sobrancelha                 | Sobrancelha | R$ 40,00    | 30            |
| ...012     | Henna de Sobrancelha                  | Sobrancelha | R$ 55,00    | 45            |
| ...013     | Micropigmentacao de Sobrancelha        | Sobrancelha | R$ 650,00   | 180           |
| ...014     | Maquiagem Social                      | Maquiagem   | R$ 120,00   | 60            |
| ...015     | Maquiagem para Noiva                  | Maquiagem   | R$ 350,00   | 120           |
| ...016     | Maquiagem para Festa                  | Maquiagem   | R$ 180,00   | 75            |
| ...017     | Depilacao de Pernas Completa           | Depilacao    | R$ 80,00    | 60            |
| ...018     | Depilacao Axilas                       | Depilacao    | R$ 30,00    | 20            |
| ...019     | Depilacao Buco                         | Depilacao    | R$ 25,00    | 15            |
| ...020     | Depilacao Virilha Completa             | Depilacao    | R$ 65,00    | 40            |

Todos os servicos estao com `is_active = true`.

### 7.5 Clientes (5)

| ID (sufixo) | Nome                          | CPF              | Telefone          | Email                          |
|------------|-------------------------------|------------------|-------------------|--------------------------------|
| ...001     | Maria das Gracas Silva         | 123.456.789-00   | (21) 98000-0001   | maria.gracas@email.com         |
| ...002     | Josefa Aparecida Goncalves     | 234.567.890-00   | (21) 98000-0002   | josefa.aparecida@email.com     |
| ...003     | Francisca Rodrigues Lima       | 345.678.901-00   | (21) 98000-0003   | francisca.lima@email.com       |
| ...004     | Antonia Carvalho Nunes         | 456.789.012-00   | (21) 98000-0004   | antonia.nunes@email.com        |
| ...005     | Elizabete Figueiredo Barros    | 567.890.123-00   | (21) 98000-0005   | elizabete.barros@email.com     |

**Nota:** Todos os clientes tem `auth_id = NULL` (walk-in via totem, sem conta de login). CPFs sao ficticios, apenas para testes.

### 7.6 Agendamentos (3)

| ID (sufixo) | Cliente             | Profissional     | Servico              | Status       | Senha    | Origem | Cenario                                |
|------------|---------------------|------------------|----------------------|-------------|----------|--------|----------------------------------------|
| ...001     | Maria das Gracas     | Ana Paula        | Corte Feminino       | `waiting`   | CCC-001  | totem  | Fez check-in, aguardando na fila.       |
| ...002     | Josefa Aparecida     | Fernanda Lima    | Manicure             | `scheduled` | CCC-002  | app    | Agendamento para mais tarde no dia.     |
| ...003     | Francisca Rodrigues  | Larissa Alves    | Design de Sobrancelha| `in_progress`| CCC-003 | totem  | Atendimento em andamento ha 10 min.     |

---

## 8. Tipos TypeScript

O pacote `@cheia/types` (em `packages/types/src/index.ts`) define tipos TypeScript que mapeiam diretamente para as tabelas do banco. Estes tipos sao usados em todos os apps do monorepo.

### Mapeamento Tabela -> Tipo

| Tabela Supabase          | Tipo TypeScript       | Arquivo                          |
|-------------------------|-----------------------|----------------------------------|
| `organizations`         | `Organization`        | `packages/types/src/index.ts`    |
| `stores`                | `Store`               | `packages/types/src/index.ts`    |
| `profiles`              | `Profile`             | `packages/types/src/index.ts`    |
| `services`              | `Service`             | `packages/types/src/index.ts`    |
| `appointments`          | `Appointment`         | `packages/types/src/index.ts`    |
| `professional_services` | `ProfessionalService` | `packages/types/src/index.ts`    |
| `transactions`          | `Transaction`         | `packages/types/src/index.ts`    |
| `daily_summaries`       | `DailySummary`        | `packages/types/src/index.ts`    |

### Tipos Auxiliares (Enums como Union Types)

| Tipo TypeScript        | Valores                                                              | Coluna Correspondente            |
|-----------------------|----------------------------------------------------------------------|----------------------------------|
| `ProfileRole`         | `'master' \| 'gestor' \| 'profissional' \| 'cliente'`               | `profiles.role`                  |
| `AppointmentStatus`   | `'scheduled' \| 'checked_in' \| 'waiting' \| 'in_progress' \| 'completed' \| 'no_show'` | `appointments.status` |
| `AppointmentSource`   | `'totem' \| 'app' \| 'whatsapp' \| 'web' \| 'gestor'`              | `appointments.source`            |
| `PaymentMethod`       | `'cash' \| 'credit' \| 'debit' \| 'pix' \| 'charmes'`             | `transactions.payment_method`    |
| `TransactionStatus`   | `'pending' \| 'completed' \| 'cancelled' \| 'refunded'`            | `transactions.status`            |
| `ClientFrequency`     | `'vip' \| 'regular' \| 'occasional' \| 'new'`                      | (apenas frontend, sem coluna no DB) |

### Tipos de Interface do Totem (Kiosk)

| Tipo TypeScript        | Descricao                                                            |
|-----------------------|----------------------------------------------------------------------|
| `KioskStep`           | Estados da maquina de estados do totem: `'idle' \| 'identify' \| 'found' \| 'not_found' \| 'register' \| 'select_service' \| 'confirm' \| 'done'` |
| `IdentifyMethod`      | Metodo de identificacao no totem: `'cpf' \| 'phone'`                |

### Observacoes sobre o Mapeamento

- **Todos os `id` sao `string`** no TypeScript (UUID no Postgres).
- **Todos os `*_at` sao `string`** no TypeScript (TIMESTAMPTZ no Postgres -- retornados como ISO 8601 string pelo Supabase).
- **`DATE` e mapeado como `string`** (ex: `hired_at`, `summary_date`).
- **`JSONB` e mapeado como `Record<string, unknown>`** (ex: `settings` na tabela `stores`).
- **`DECIMAL(5,2)` e mapeado como `number`** (ex: `commission_rate`).
- **Valores em centavos sao `number`** (ex: `price_cents`, `amount_cents`, `commission_cents`, `avg_ticket_cents`). A conversao para reais e feita no frontend: `(value / 100).toFixed(2)`.
- **`Profile` inclui colunas de ambas as migrations** (001 + 002): `commission_rate`, `hired_at` e `is_active` estao presentes no tipo mesmo sendo adicionados na segunda migration.
- **`Service` inclui colunas de ambas as migrations** (001 + 002): `description` e `image_url`.

---

## 9. Migrations

O schema e construido incrementalmente atraves de migrations SQL, executadas na ordem numerica.

### Ordem de Execucao

```
1. 001_initial_schema.sql    -- Schema base (5 tabelas, indexes, RLS anon, Realtime)
2. 002_gestor_schema.sql     -- Extensoes para o app do gestor (3 tabelas novas, ALTER em 2, RLS authenticated)
3. seed.sql                  -- Dados de teste (1 org, 1 loja, 15 profissionais, 20 servicos, 5 clientes, 3 agendamentos)
```

### 001_initial_schema.sql

**O que faz:**
- Cria as 5 tabelas fundamentais: `organizations`, `stores`, `profiles`, `services`, `appointments`.
- Cria 6 indexes para queries operacionais (busca por CPF, telefone, store+status, etc.).
- Habilita RLS em todas as 5 tabelas.
- Cria 7 policies para a role `anon` (totem).
- Adiciona `appointments` ao Supabase Realtime.

**Tabelas criadas:**
1. `organizations` -- Rede de saloes.
2. `stores` -- Lojas individuais.
3. `profiles` -- Todos os usuarios (clientes, profissionais, gestores, masters).
4. `services` -- Catalogo de servicos por loja.
5. `appointments` -- Agendamentos e fila de atendimento.

**Decisoes de design importantes:**
- `profiles.auth_id` e nullable para suportar clientes walk-in do totem.
- `profiles.can_parallel` permite que profissionais de unhas atendam 2 clientes simultaneamente.
- `appointments.source` rastreia a origem de cada agendamento para analytics.
- Precos em centavos (`price_cents`) para evitar problemas de arredondamento com ponto flutuante.

### 002_gestor_schema.sql

**O que faz:**
- Estende `profiles` com 3 novas colunas: `commission_rate`, `hired_at`, `is_active`.
- Estende `services` com 2 novas colunas: `description`, `image_url`.
- Cria 3 novas tabelas: `professional_services`, `transactions`, `daily_summaries`.
- Cria 5 novos indexes.
- Habilita RLS nas 3 novas tabelas.
- Cria 13 policies para a role `authenticated` (cobrindo stores, profiles, services, professional_services, transactions, daily_summaries, appointments).
- Adiciona `transactions` e `professional_services` ao Supabase Realtime.

**Tabelas criadas:**
1. `professional_services` -- Vinculo N:N entre profissionais e servicos com comissao customizada.
2. `transactions` -- Registro financeiro de atendimentos concluidos.
3. `daily_summaries` -- Resumos diarios pre-computados por loja.

**Tabelas alteradas:**
1. `profiles` -- Adicionados: `commission_rate`, `hired_at`, `is_active`.
2. `services` -- Adicionados: `description`, `image_url`.

---

## 10. Guia de Operacoes

### 10.1 Como rodar as migrations

**Pre-requisitos:**
- Supabase CLI instalado (`npm install -g supabase`)
- Projeto Supabase configurado (local ou remoto)

**Ambiente local (Supabase local):**

```bash
# Iniciar Supabase local (Docker)
supabase start

# Aplicar todas as migrations
supabase db reset

# O comando acima executa:
#   1. DROP de todas as tabelas
#   2. Executa todas as migrations em ordem (001, 002, ...)
#   3. Executa o seed.sql
```

**Ambiente remoto (Supabase Cloud):**

```bash
# Linkar ao projeto remoto
supabase link --project-ref <project-ref>

# Aplicar migrations pendentes
supabase db push

# Executar seed manualmente (cuidado: pode duplicar dados!)
supabase db execute -f supabase/seed.sql
```

**Verificar status das migrations:**

```bash
supabase migration list
```

### 10.2 Como criar um usuario gestor

Um gestor precisa de dois registros: um usuario em `auth.users` (Supabase Auth) e um perfil em `profiles` vinculado.

**Passo 1: Criar o usuario no Supabase Auth**

Opcao A -- Via Dashboard:
1. Abrir o dashboard do Supabase.
2. Ir em Authentication > Users.
3. Clicar em "Invite user" ou "Create new user".
4. Preencher email e senha.
5. Anotar o UUID gerado (sera o `auth_id`).

Opcao B -- Via SQL:

```sql
-- NOTA: Isso requer acesso como service_role ou via dashboard.
-- A funcao auth.create_user nao e publica.
-- Use o dashboard ou a API do Supabase Auth:

-- Via API (fetch/curl):
-- POST https://<project-ref>.supabase.co/auth/v1/admin/users
-- Headers: Authorization: Bearer <service_role_key>
-- Body: { "email": "gestor@salao.com", "password": "senha-segura", "email_confirm": true }
```

**Passo 2: Criar o perfil na tabela profiles**

```sql
INSERT INTO profiles (auth_id, store_id, name, role, email, phone)
VALUES (
  '<uuid-do-auth-user>',                    -- auth_id do passo 1
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- store_id da loja
  'Nome do Gestor',
  'gestor',
  'gestor@salao.com',
  '(21) 99000-XXXX'
);
```

**Passo 3: Verificar**

```sql
SELECT id, name, role, store_id, auth_id
FROM profiles
WHERE role = 'gestor' AND store_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

### 10.3 Como adicionar uma nova loja

**Passo 1: Garantir que a organizacao existe**

```sql
-- Verificar
SELECT id, name FROM organizations;

-- Se nao existir, criar:
INSERT INTO organizations (name, slug)
VALUES ('Rede Cheia de Charme', 'rede-cheia-de-charme')
RETURNING id;
```

**Passo 2: Criar a loja**

```sql
INSERT INTO stores (organization_id, name, slug, address, phone, settings)
VALUES (
  'f0000000-0000-0000-0000-000000000001',   -- organization_id
  'Cheia de Charme - Ipanema',              -- nome da loja
  'cheia-de-charme-ipanema',                -- slug unico
  'Rua Visconde de Piraja, 200 - Ipanema, Rio de Janeiro - RJ',
  '(21) 99000-0010',
  '{"open_time": "09:00", "close_time": "20:00", "max_queue": 30, "ticket_prefix": "CCI"}'
)
RETURNING id;
```

**Passo 3: Criar o gestor da nova loja**

```sql
-- Primeiro crie o usuario auth (via dashboard/API, vide secao 10.2)
-- Depois vincule:
INSERT INTO profiles (auth_id, store_id, name, role, email)
VALUES (
  '<uuid-do-novo-auth-user>',
  '<uuid-da-nova-loja>',    -- id retornado no passo 2
  'Nome do Gestor de Ipanema',
  'gestor',
  'gestor.ipanema@cheiadecharm.com.br'
);
```

**Passo 4: Copiar servicos de outra loja (opcional)**

```sql
INSERT INTO services (store_id, name, category, price_cents, duration_minutes, is_active)
SELECT
  '<uuid-da-nova-loja>',    -- nova store_id
  name,
  category,
  price_cents,
  duration_minutes,
  is_active
FROM services
WHERE store_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';  -- loja modelo
```

**Passo 5: Configurar o `.env` do totem da nova loja**

```env
NEXT_PUBLIC_STORE_ID=<uuid-da-nova-loja>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 10.4 Como adicionar um novo profissional

```sql
INSERT INTO profiles (store_id, name, role, specialty, can_parallel, is_available, phone, email, commission_rate)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Nova Profissional',
  'profissional',
  'Cabelo',
  1,          -- atendimentos simultaneos
  true,       -- disponivel
  '(21) 99000-XXXX',
  'nova@email.com',
  50.00       -- 50% de comissao
)
RETURNING id;
```

Depois, vincular os servicos que ela realiza:

```sql
INSERT INTO professional_services (professional_id, service_id)
SELECT
  '<uuid-da-nova-profissional>',
  id
FROM services
WHERE store_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND category = 'Cabelo';  -- todos os servicos de cabelo
```

### 10.5 Como registrar uma transacao apos atendimento

```sql
INSERT INTO transactions (
  store_id,
  appointment_id,
  professional_id,
  client_id,
  service_id,
  amount_cents,
  commission_cents,
  payment_method,
  status
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '<uuid-do-appointment>',
  '<uuid-do-profissional>',
  '<uuid-do-cliente>',
  '<uuid-do-servico>',
  8000,            -- R$ 80,00
  4000,            -- R$ 40,00 (50% de comissao)
  'pix',
  'completed'
);
```

### 10.6 Como gerar um resumo diario

```sql
INSERT INTO daily_summaries (store_id, summary_date, total_revenue, total_appointments, completed_count, no_show_count, avg_ticket_cents)
SELECT
  store_id,
  CURRENT_DATE,
  COALESCE(SUM(CASE WHEN status = 'completed' THEN t.amount_cents ELSE 0 END), 0),
  COUNT(*),
  COUNT(*) FILTER (WHERE a.status = 'completed'),
  COUNT(*) FILTER (WHERE a.status = 'no_show'),
  CASE
    WHEN COUNT(*) FILTER (WHERE a.status = 'completed') > 0
    THEN COALESCE(SUM(CASE WHEN a.status = 'completed' THEN t.amount_cents ELSE 0 END), 0)
         / COUNT(*) FILTER (WHERE a.status = 'completed')
    ELSE 0
  END
FROM appointments a
LEFT JOIN transactions t ON t.appointment_id = a.id
WHERE a.store_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND a.created_at::date = CURRENT_DATE
GROUP BY a.store_id
ON CONFLICT (store_id, summary_date) DO UPDATE SET
  total_revenue = EXCLUDED.total_revenue,
  total_appointments = EXCLUDED.total_appointments,
  completed_count = EXCLUDED.completed_count,
  no_show_count = EXCLUDED.no_show_count,
  avg_ticket_cents = EXCLUDED.avg_ticket_cents;
```

---

## Apendice: Checklist para Novas Migrations

Ao criar uma nova migration, siga este checklist:

- [ ] Criar arquivo com numero sequencial: `supabase/migrations/003_nome_descritivo.sql`
- [ ] Adicionar cabecalho com descricao
- [ ] Para novas tabelas: incluir `ENABLE ROW LEVEL SECURITY`
- [ ] Criar policies de RLS para `anon` E `authenticated` conforme necessario
- [ ] Criar indexes para colunas usadas em WHERE/JOIN frequentes
- [ ] Se a tabela precisa de updates em tempo real: `ALTER PUBLICATION supabase_realtime ADD TABLE nome_tabela`
- [ ] Atualizar tipos em `packages/types/src/index.ts`
- [ ] Atualizar seed data em `supabase/seed.sql` se necessario
- [ ] Testar com `supabase db reset` localmente
- [ ] Atualizar esta documentacao (`docs/SUPABASE.md`)
