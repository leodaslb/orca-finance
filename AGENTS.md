# AGENTS.md — Orca Finance Mobile

Este arquivo complementa o `AGENTS.md` da raiz e vale para tudo dentro de `orca-finance/`.

## Responsabilidade

`orca-finance/` contém o aplicativo mobile do Orca Finance.

Stack definida:

- React Native
- Expo
- TypeScript
- Expo Router
- Android como plataforma prioritária

Antes de qualquer mudança funcional, consulte os documentos compartilhados em `../docs/`.

Fontes técnicas principais desta área:

- `../docs/Orca_Finance_Arquitetura_Frontend.md`
- `../docs/Orca_Finance_Design_System_Atualizado.md`
- `../docs/Orca_Finance_Fluxo_de_Telas_Sprint1.md`
- backlog e RN vigentes em `../docs/`

## Arquitetura atual

Estrutura esperada:

```text
Screen / Route / Hook
        ↓
      Service
        ↓
 Mock Data Source
```

Evolução para integração real:

```text
Screen / Hook
    ↓
Service
    ↓
REST API
```

Regras:

- telas não importam mocks diretamente;
- `src/app` deve focar rota e composição;
- regra de negócio não fica em componente visual reutilizável;
- services concentram acesso aos dados;
- reutilize types, helpers e componentes existentes antes de criar novos;
- não crie arquitetura paralela.

## Estado

Estado local é a primeira opção.

O Context existente de sessão/perfil ativo é permitido por ser estado realmente compartilhado.

Não introduza Redux/Zustand ou outra store global sem necessidade demonstrável e sem revisar a arquitetura.

## Dados

- use IDs estáveis;
- nunca localize entidade por texto visível ou posição em array;
- telas relacionadas devem consumir o mesmo dataset/service;
- respeite `activeProfileId` em todo dado financeiro;
- perfil novo não herda dados do perfil demo.

O frontend atual usa sua convenção monetária própria definida na arquitetura/código.
Não altere representação monetária apenas para espelhar o banco; a tradução do contrato da API deve ser explícita quando a integração ocorrer.

## UI

Use como contrato visual:

- Design System vigente;
- PNG/referência oficial da tela;
- componentes e tokens existentes.

Diretrizes:

- Manrope;
- Tabler Icons outline;
- tokens de `src/theme`;
- evitar hex hardcoded quando houver token;
- evitar sombra/gradiente sem previsão;
- reutilizar componente quando houver repetição real.

Bottom navigation oficial:

```text
Início | Transações | + | Planejamento | Relatórios
```

Perfil/Configurações ficam fora dela.

Não copie valores financeiros fictícios de PNG quando puderem ser derivados dos dados.

## Navegação

Use Expo Router.

Detalhes devem navegar por ID estável.

Não use `as any` como solução padrão para contornar tipagem de rota.

Ao alterar fluxo, confira origem, destino, back e preservação de estado.

## Integração com backend

Enquanto a API real não substituir os mocks:

- mantenha o service como fronteira;
- não acople telas a detalhes futuros do backend;
- não invente endpoint;
- se um contrato for necessário, derive-o dos documentos compartilhados e da arquitetura backend.

PIN/biometria local não substituem autenticação remota da conta.

## Restrições

Não adicionar automaticamente:

- backend dentro do app;
- persistência definitiva improvisada;
- nova store global;
- camada ViewModel/Repository sem responsabilidade concreta;
- dependência nativa apenas para eliminar um bloqueio sem avaliar impacto.

Se câmera, biometria, arquivos ou notificações dependerem de infraestrutura ausente, isole a parte bloqueada e continue o restante.

## Testes

Após mudanças relevantes, execute o que se aplicar no projeto atual, incluindo:

```bash
npx tsc --noEmit
node scripts/verify-transactions.cjs
node scripts/verify-planning.cjs
node scripts/verify-goals.cjs
node scripts/verify-reports.cjs
node scripts/verify-security.cjs
node scripts/verify-stage7.cjs
git diff --check
```

Não configure ESLint automaticamente se a infraestrutura não estiver instalada.

Android Emulator é a referência final para QA visual.
Expo Web é apoio, não substituto da validação Android.

## Regressões

Ao alterar service/type/mock compartilhado, verifique consumidores relacionados, principalmente:

- Dashboard;
- Transações;
- Planejamento;
- Metas;
- Relatórios;
- sessão/perfil ativo.

Não faça limpeza ampla fora do escopo.
