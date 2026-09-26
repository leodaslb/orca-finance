# Orca Finance — Arquitetura Front-end Mobile

> Documento de decisão técnica para a implementação do front-end do Orca Finance.
>
> Escopo atual: primeira entrega acadêmica focada na implementação, navegação e validação das telas no Android. Este documento não redefine requisitos de produto; ele organiza tecnicamente as decisões já tomadas no projeto e explicita as pendências que ainda não devem ser tratadas como definitivas.

---

## 1. Objetivo

Definir uma arquitetura front-end simples, rastreável e evolutiva para que as telas da Sprint 1 possam ser implementadas sem acoplar a interface aos dados mockados nem antecipar desnecessariamente a arquitetura de backend.

A estrutura deve permitir que, em etapas futuras, a fonte de dados mockada seja substituída por API/persistência real com o menor impacto possível sobre as telas e componentes visuais.

---

## 2. Fontes de decisão do front-end

A implementação deve respeitar, nesta ordem de responsabilidade:

1. requisitos funcionais do projeto;
2. backlog revisado e vínculos RF → US;
3. regras de negócio revisadas;
4. fluxo de telas da Sprint 1;
5. Design System atualizado;
6. este documento de arquitetura front-end.

Este documento define **como implementar** o front-end. Ele não pode criar comportamento funcional que não exista nas fontes acima.

---

## 3. Escopo da primeira entrega

A primeira entrega prioriza:

- implementação visual das telas já definidas;
- navegação entre telas e estados complementares;
- reutilização de componentes;
- aplicação fiel do Design System;
- uso de dados mockados centralizados;
- estados necessários para demonstrar os fluxos previstos;
- execução e validação no Android Emulator.

Nesta fase, não é necessário implementar de forma definitiva:

- backend;
- API remota;
- banco de dados definitivo;
- sincronização entre dispositivos;
- autenticação remota real;
- notificações push reais;
- exportação real de arquivos;
- câmera/OCR reais, exceto se exigidos posteriormente para demonstração;
- regras de negócio ainda marcadas como pendentes.

Quando uma funcionalidade real ainda não existir, a tela pode simular seu estado visual utilizando os mocks, desde que não introduza nova regra de negócio.

---

## 4. Stack definida

### 4.1 Base

- **React Native** — tecnologia principal do aplicativo mobile.
- **Expo** — ambiente/toolchain utilizado no desenvolvimento do front-end.
- **Android** — plataforma prioritária da primeira entrega.
- **Android Studio / Android Emulator** — ambiente de validação da entrega.

O Expo Web pode ser usado como apoio durante desenvolvimento rápido, mas **não deve ser a referência final de validação visual ou comportamental**, pois componentes e APIs podem apresentar diferenças entre navegador e ambiente nativo Android.

### 4.2 Linguagem e navegação

Decisões fechadas para a implementação:

- **TypeScript** — linguagem padrão do front-end.
- **Expo Router** — estratégia de navegação baseada em arquivos.

A escolha do Expo Router foi feita por aderência ao ecossistema Expo e por reduzir configuração manual de rotas. A organização por arquivos também torna a árvore de navegação explícita e facilita a leitura do fluxo durante a apresentação acadêmica.

O projeto deverá utilizar tipagem para entidades, parâmetros de rota, dados mockados e contratos dos services sempre que aplicável. Evitar o uso de `any` como solução padrão.

### 4.3 Decisões técnicas não bloqueantes

Os itens abaixo podem ser definidos durante o bootstrap/evolução do projeto e **não impedem o início da implementação das telas**:

- **versão do Expo SDK** — utilizar a versão estável criada/configurada no bootstrap do projeto e registrá-la no `package.json`;
- **bibliotecas de testes automatizados** — definir quando os primeiros testes automatizados forem introduzidos;
- **solução de gerenciamento de estado global** — somente adotar caso surja necessidade real de estado compartilhado entre áreas.

---

## 5. Princípios arquiteturais

### 5.1 Simplicidade proporcional à entrega

A arquitetura deve resolver o problema atual sem antecipar camadas complexas que ainda não possuem responsabilidade real.

Para a primeira entrega, evitar adicionar sem necessidade comprovada:

- Redux/Zustand ou outro estado global;
- injeção de dependência complexa;
- Clean Architecture completa;
- múltiplas camadas de DTO/mappers sem API real;
- abstrações genéricas sem uso concreto.

### 5.2 Separação entre interface e dados

Uma tela não deve conter os valores de demonstração espalhados diretamente no JSX e não deve depender diretamente de um arquivo JSON específico.

O Design System atualizado estabelece a arquitetura conceitual:

```text
UI / Screen
  ↓
ViewModel / Controller
  ↓
Repository / Service
  ↓
Mock Data Source
```

Para a primeira entrega, essa ideia será aplicada de maneira leve. Não é obrigatório criar uma classe formal de ViewModel para cada tela se isso não agregar valor.

Estrutura mínima adotada:

```text
Screen / Hook de tela
  ↓
Service
  ↓
Mock Data Source
```

Evolução esperada:

```text
Screen / Hook de tela
  ↓
Service / Repository
  ↓
API / Persistência
```

### 5.3 Componentização por responsabilidade

Componentes reutilizáveis devem concentrar padrões visuais e comportamentos repetidos.

Uma tela deve principalmente:

- organizar a composição da página;
- solicitar/receber dados;
- controlar estado local da interface;
- disparar ações de navegação;
- delegar apresentação repetida para componentes.

### 5.4 Regra de negócio fora de componentes puramente visuais

Um componente visual reutilizável não deve decidir regras de negócio específicas do domínio.

Exemplo:

- `ProgressBar` pode receber percentual e estado/cor;
- a regra que determina o percentual do orçamento deve permanecer na camada responsável pelos dados/lógica da funcionalidade.

---

## 6. Estrutura inicial de diretórios

Com TypeScript e Expo Router definidos, a estrutura inicial recomendada é:

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── transacoes.tsx
│   │   ├── planejamento.tsx
│   │   └── relatorios.tsx
│   ├── transacao/
│   │   ├── nova.tsx
│   │   └── [id].tsx
│   ├── categorias/
│   │   └── index.tsx
│   ├── metas/
│   │   ├── index.tsx
│   │   ├── nova.tsx
│   │   └── [id].tsx
│   ├── seguranca/
│   │   └── index.tsx
│   └── configuracoes/
│       └── index.tsx
├── assets/
├── components/
│   ├── common/
│   └── domain/
├── data/
│   └── mocks/
├── hooks/
├── services/
├── theme/
├── types/
└── utils/
```

A árvore acima é uma **estrutura inicial**, não uma obrigação de criar antecipadamente todas as rotas. Novos arquivos devem ser adicionados conforme as telas do fluxo forem implementadas.

### 6.1 Responsabilidades

#### `src/app/`
Contém exclusivamente a estrutura de rotas do Expo Router e a composição de cada rota.

Diretrizes:
- `_layout.tsx` define layouts/navegadores compartilhados;
- `(tabs)/` representa o grupo da bottom navigation e **não faz parte do caminho lógico da rota**;
- rotas dinâmicas como `[id].tsx` recebem identificadores estáveis dos mocks/services;
- arquivos de rota devem permanecer enxutos e delegar componentes reutilizáveis para `components/`;
- não concentrar regras de negócio nos arquivos de rota.

#### `assets/`
Arquivos estáticos utilizados pelo aplicativo.

Exemplos:
- imagens;
- fontes locais, se utilizadas;
- recursos visuais próprios.

#### `components/common/`
Componentes genéricos reutilizados em vários domínios.

Exemplos:
- `AppCard`;
- `PrimaryButton`;
- `SecondaryButton`;
- `AppInput`;
- `ProgressBar`;
- `BottomSheetContainer`;
- `ConfirmModal`;
- `ScreenHeader`.

#### `components/domain/`
Componentes reutilizáveis, mas específicos do Orca Finance.

Exemplos:
- `TransactionItem`;
- `BudgetCategoryCard`;
- `GoalCard`;
- `FinancialSummaryCard`.

Se a quantidade de componentes crescer, `domain/` pode posteriormente ser subdividido por domínio (`transactions/`, `planning/`, `goals/` etc.). Não criar essa subdivisão antes de existir necessidade concreta.

#### `data/mocks/`
Fonte centralizada dos dados usados durante a fase sem API.

Os arquivos serão TypeScript e podem ser divididos por domínio:

```text
data/mocks/
├── profile.mock.ts
├── transactions.mock.ts
├── categories.mock.ts
├── budgets.mock.ts
├── goals.mock.ts
└── reports.mock.ts
```

#### `hooks/`
Lógica reutilizável de estado de interface ou adaptação entre rotas/componentes e services.

Criar hooks somente quando houver reutilização ou quando isso simplificar claramente a tela.

#### `services/`
Interface de acesso aos dados usados pelas telas.

Na primeira entrega, os services leem mocks. Posteriormente, podem passar a chamar API/repository sem exigir alterações estruturais em cada rota/tela.

#### `theme/`
Tokens e estilos globais derivados do Design System.

Deve concentrar pelo menos:
- cores;
- tipografia;
- espaçamento;
- radius;
- dimensões comuns;
- constantes semânticas de aparência.

#### `types/`
Contratos TypeScript compartilhados.

Exemplos:
- `Transaction`;
- `Category`;
- `Budget`;
- `Goal`;
- tipos auxiliares de filtros e períodos.

Evitar duplicar interfaces equivalentes em múltiplos arquivos.

#### `utils/`
Funções puras e auxiliares compartilhados.

Exemplos possíveis:
- formatação monetária;
- formatação de datas;
- cálculos puramente apresentacionais.

Não transformar `utils` em depósito de regras de negócio.

---

## 7. Design System como contrato de implementação

O arquivo `Orca_Finance_Design_System_Atualizado.md` é a fonte visual de verdade.

### 7.1 Tokens principais

A implementação deve centralizar no `theme` os valores definidos no Design System, evitando repetir códigos hexadecimais diretamente em cada tela.

Principais tokens já consolidados:

```text
Brand          #0D3B66
Primary        #2E76D6
Primary Tint   #EAF2FC
Positive       #1E8F6F
Positive Tint  #E1F5EE
Negative       #D64545
Warning        #E8A33D
Text Primary   #10202E
Text Secondary #64748B
Nav Inactive   #94A3B8
Border         #E2E8F0
Background     #F7F9FC
Surface        #FFFFFF
```

Fonte padrão: **Manrope**.

Iconografia de referência: **Tabler Icons, estilo outline**.

### 7.2 Componentes visuais oficiais

Devem ser preferencialmente implementados como componentes reutilizáveis:

- cards;
- botão primário;
- botão secundário;
- ação destrutiva;
- inputs;
- segmented controls/toggles;
- barras de progresso;
- bottom sheets;
- modais de confirmação;
- itens de lista;
- navegação inferior.

### 7.3 Sombras

Não usar sombra como padrão visual de separação. A identidade atual utiliza principalmente borda e diferença de superfície/fundo.

---

## 8. Arquitetura de navegação

### 8.1 Bottom navigation oficial

A navegação principal está consolidada como:

```text
Início | Transações | + | Planejamento | Relatórios
```

Responsabilidades:

- **Início** → Dashboard;
- **Transações** → lista, busca, filtros, detalhe e acesso contextual a categorias;
- **+** → nova transação;
- **Planejamento** → orçamento, metas, limites, gastos livres e planejado x realizado;
- **Relatórios** → gráficos e exportação.

**Perfil/Configurações não pertence à bottom navigation.** O acesso ocorre pelo avatar/ação superior.

### 8.2 Tipos de destino

A arquitetura visual usa três formas de transição:

1. **Tela completa** — quando existe um contexto próprio de navegação;
2. **Bottom sheet** — para tarefas complementares curtas;
3. **Modal de confirmação** — para ações destrutivas/irreversíveis.

Bottom sheets já definidos no projeto:

- login;
- criação de conta;
- filtros de transação;
- registrar aporte;
- exportar dados.

Modal de confirmação já definido:

- reversão de transação.

### 8.3 Organização das rotas com Expo Router

A navegação deve refletir o fluxo oficial usando a convenção de arquivos do Expo Router.

Estrutura conceitual:

```text
app/
├── _layout.tsx                  # Stack raiz / configuração global
├── index.tsx                    # entrada do app / redirecionamento conforme fluxo
├── (tabs)/
│   ├── _layout.tsx              # bottom navigation oficial
│   ├── index.tsx                # Início / Dashboard
│   ├── transacoes.tsx           # Lista de transações
│   ├── planejamento.tsx         # Planejamento / orçamento
│   └── relatorios.tsx           # Relatórios
├── transacao/
│   ├── nova.tsx                 # criação de transação
│   └── [id].tsx                 # detalhe da transação
├── categorias/
│   └── index.tsx
├── metas/
│   ├── index.tsx
│   ├── nova.tsx
│   └── [id].tsx
├── recorrencia/
│   └── configurar.tsx
├── reflexao/
│   └── index.tsx
├── seguranca/
│   └── index.tsx
└── configuracoes/
    └── index.tsx                # hub ainda pendente de definição visual
```

Bottom sheets e modais não precisam obrigatoriamente virar rotas independentes. Quando forem estados estritamente locais da tela, podem ser controlados pelo componente/rota de origem. Caso posteriormente seja útil torná-los rotas modais, a mudança deve preservar o fluxo definido no documento de telas.

### 8.4 Parâmetros de rota

Rotas de detalhe devem utilizar identificadores estáveis, e não texto visível ou posição do array.

Exemplo conceitual:

```text
/transacao/tx-001
/metas/meta-001
```

O arquivo `[id].tsx` deve receber o parâmetro, solicitar o dado correspondente ao service e tratar de forma visualmente segura a ausência do registro. O comportamento funcional definitivo para erros permanece condicionado às decisões de estado de interface do projeto.

A futura tela-hub de Perfil/Configurações permanece pendente no fluxo atual.

---

## 9. Estratégia de dados mockados

### 9.1 Fonte única de dados de demonstração

Os valores exibidos por diferentes telas devem vir do mesmo cenário mockado.

Não criar valores inconsistentes por tela para o mesmo usuário/período.

Exemplos já padronizados no Design System:

- saldo atual: `R$ 3.240,80`;
- gastos do mês: `R$ 1.180,00`;
- transação “Supermercado Extra”: `R$ 187,00`;
- meta “Viagem”: `R$ 2.250,00 / R$ 5.000,00` (`45%`).

Esses valores devem existir no dataset, e as telas devem derivá-los dele sempre que possível.

### 9.2 Regra de acesso

Evitar:

```text
Screen → importa diretamente transactions.mock
```

Preferir:

```text
Screen → transactionService → transactions.mock
```

Exemplo conceitual:

```text
getTransactions()
getTransactionById(id)
getDashboardSummary()
getBudgetOverview()
getGoals()
getGoalById(id)
getReportData(period)
```

Nesta primeira fase essas operações podem ser síncronas ou simular comportamento assíncrono somente quando necessário para testar estados de interface.

### 9.3 IDs e relacionamentos

Os mocks devem usar IDs estáveis para permitir navegação e relacionamento entre telas.

Exemplo conceitual:

```text
transaction.categoryId → category.id
goal.id → detalhe/aportes da meta
profile.id → dados do dashboard/período
```

Isso evita encontrar uma transação por texto/posição de array e aproxima o fluxo do comportamento de uma API real.

---

## 10. Estado da aplicação

### 10.1 Estado local primeiro

Na primeira entrega, preferir estado local da tela para:

- campos de formulário;
- abrir/fechar modal ou bottom sheet;
- filtros temporários;
- seleção de período;
- toggle/segmented control;
- expansão de categoria/subcategoria.

### 10.2 Estado compartilhado

Não adotar biblioteca global somente porque o aplicativo futuramente poderá precisar dela.

Se durante a implementação surgir estado que realmente precise ser compartilhado entre múltiplas áreas, a necessidade deve ser registrada e então avaliada.

### 10.3 Mocks mutáveis durante demonstração

Caso seja necessário demonstrar “criar”, “editar”, “aportar” ou “reverter” sem backend, a implementação pode utilizar estado em memória durante a execução do app.

Essa simulação deve ser claramente separada da persistência definitiva e não deve criar regras além das previstas no backlog/regras de negócio.

---

## 11. Estados de interface

O Design System identifica como ainda não formalizados visualmente:

- loading;
- empty state;
- erro de rede/API;
- erro de validação;
- sucesso após criação/edição;
- indisponibilidade de biometria;
- permissão de câmera/notificação negada;
- falha de exportação;
- meta vencida não concluída.

Para a entrega de telas, implementar esses estados apenas quando necessários ao fluxo apresentado. O comportamento visual pode ser padronizado, mas nenhuma regra de negócio pendente deve ser inferida.

---

## 12. Rastreabilidade da Sprint 1

A implementação deverá preservar o encadeamento:

```text
RF → User Story → Tela/Estado → Componente → Task → Implementação → Teste
```

Mapa inicial das telas principais com vínculos já confirmados nas fontes do projeto:

| Domínio/Tela | RF principal(is) | User Story | RN vinculadas no backlog | Teste front-end mínimo nesta entrega |
|---|---|---|---|---|
| Nova transação | RF01 | US01 | RN-TRANS-01, RN-TRANS-02 | renderização, preenchimento, validação visual e ação de salvar/mock |
| Detalhamento da transação | RF21, RF36, RF58 | US02 | nenhuma RN específica | renderizar dados complementares e estados previstos |
| Lista/busca/filtros | RF13, RF58 | US03 | nenhuma RN específica | busca/filtro atualiza a lista mockada conforme critérios implementados |
| Categorias/subcategorias | RF02 | US05 | RN-CAT-01 | expandir categoria e acessar criação de subcategoria |
| Orçamento mensal | RF03, RF24 | US06 | RN-ORC-01, RN-ORC-02 | exibir limites/progresso e estados semânticos corretamente |
| Metas | RF04 | US10 | RN-META-01, RN-META-02 | lista → detalhe → criação/aporte usando mesmo dataset |
| Reflexão antes da compra | RF05, RF70 | US12 | RN-CAT-02, RN-REF-01, RN-REF-03 | despesa não essencial alcança o fluxo de reflexão |
| Relatórios | RF06 | US13 | nenhuma RN específica | período altera dados/gráficos mockados previstos |
| Exportação | RF07, RF28 | US14 | nenhuma RN específica | abrir/fechar bottom sheet e selecionar formato |
| Dashboard | RF08 | US15 | RN-TRANS-01, RN-META-01 | dados consistentes com transações/metas do mesmo mock |
| Recibo | RF12 | US19 | nenhuma RN específica | ação/estado de comprovante presente no fluxo visual |
| Recorrência/lembrete | RF20, RF64 | US24 | RN-TRANS-04, RN-NOT-01, RN-REC-01 | formulário → configuração → retorno com estado preservado |
| Limites e alertas | RF27, RF54 | US29 | RN-NOT-01, RN-NOT-02, RN-LIM-01 | configurar estado visual e salvar mock/local |
| Bloqueio local | RF48 | US37 | nenhuma RN específica | alternância biometria ↔ PIN conforme fluxo definido |
| Planejado x realizado | RF55 | US40 | nenhuma RN específica | período e dados exibidos de forma consistente |
| Gastos livres | RF57 | US45 | RN-ORC-02, RN-ORC-05 | exibir/alterar cota sem inferir como transação consome a cota |

Os critérios de aceitação detalhados devem continuar sendo consultados no backlog oficial durante a implementação de cada User Story. Este documento não os substitui.

---

## 13. Pendências que não devem ser resolvidas implicitamente no código

### 13.1 Técnicas

- biblioteca de testes automatizados;
- necessidade futura de estado global;
- registrar no documento a versão do Expo SDK efetivamente utilizada após o bootstrap do projeto.

**TypeScript e Expo Router já estão definidos e não são mais pendências.**

### 13.2 UX/navegação

- edição de transação inline ou reutilização do formulário de cadastro;
- destino definitivo após criar transação;
- destino definitivo após criar meta;
- tela/lista de itens em reflexão;
- tela-hub formal de Perfil/Configurações.

### 13.3 Produto/regra de negócio

- como uma despesa passa a consumir a cota de gastos livres;
- duração padrão do período de reflexão e possibilidade de alteração;
- se editar/cancelar recorrência afeta somente ocorrências futuras;
- comportamento definitivo de meta vencida não concluída;
- detalhes do snapshot de auditoria da reversão;
- período padrão de determinados limites por categoria, conforme RN-LIM-01.

Quando uma dessas decisões for tomada, atualizar primeiro a fonte correspondente (backlog, regras, fluxo ou Design System, conforme o caso) e depois refletir a decisão neste documento.

---

## 14. Estratégia de testes da primeira entrega

Mesmo sendo uma entrega predominantemente visual, cada tela deve ser validada em dois níveis.

### 14.1 Validação visual

No Android Emulator verificar:

- alinhamento;
- espaçamento;
- tipografia;
- cores semânticas;
- áreas de toque;
- scroll;
- comportamento com teclado;
- Safe Area/Status Bar;
- bottom navigation;
- modal/bottom sheet;
- diferentes alturas de conteúdo.

### 14.2 Validação de navegação

Para cada ação principal definida no fluxo:

```text
Dado que estou na tela de origem
Quando executo a ação
Então o app abre a tela/estado de destino previsto
E preserva os dados necessários para continuidade do fluxo
```

Exemplo já definido pelo documento de fluxo:

```text
RF13
→ US03
→ Lista de transações
→ tocar em filtro
→ Bottom sheet de filtros
→ aplicar filtros
→ lista atualizada
```

### 14.3 Testes automatizados

A ferramenta de testes ainda é decisão pendente e não bloqueia a primeira implementação visual. Não fixar Jest, React Native Testing Library ou outra biblioteca neste documento até a estratégia correspondente ser formalizada.

Mesmo antes dessa escolha, manter os componentes testáveis: evitar lógica extensa diretamente no JSX, usar funções puras quando aplicável e manter dados de domínio fora dos componentes visuais.

---

## 15. Critério de implementação de uma nova tela

Antes de implementar qualquer tela:

1. identificar o RF relacionado;
2. localizar a User Story oficial;
3. verificar critérios de aceitação;
4. verificar regras de negócio e pendências;
5. localizar a tela de referência e o fluxo de entrada/saída;
6. identificar componentes existentes reutilizáveis;
7. identificar dados necessários no mock;
8. implementar a tela;
9. testar navegação;
10. validar visualmente no Android Emulator.

Se faltar informação nos passos 1–5, registrar como **decisão pendente** em vez de inventar comportamento.

---

## 16. Definição de pronto — tela da primeira entrega

Uma tela pode ser considerada pronta para a entrega visual quando:

- corresponde ao fluxo oficial;
- respeita o Design System;
- reutiliza componentes existentes quando aplicável;
- não contém dados de cenário duplicados e inconsistentes;
- obtém dados pelo service/mock previsto, quando houver dados de domínio;
- navega para os destinos já definidos;
- pendências de produto não foram transformadas em regras definitivas;
- foi validada no Android Emulator;
- possui ao menos os testes manuais de navegação necessários ao fluxo apresentado.

---

## 17. Decisões consolidadas nesta versão

| Decisão | Status |
|---|---|
| React Native | Definido |
| Expo | Definido |
| Android como plataforma prioritária da entrega | Definido |
| Android Emulator para validação | Definido |
| Bottom nav: Início / Transações / + / Planejamento / Relatórios | Definido |
| Perfil/Configurações fora da bottom nav | Definido |
| Design System atualizado como fonte visual | Definido |
| Dataset mock centralizado | Definido |
| Tela desacoplada do arquivo de mock por camada de acesso | Definido |
| Estado local como primeira opção | Diretriz arquitetural |
| TypeScript | Definido |
| Expo Router | Definido |
| Rotas baseadas em arquivos (`src/app`) | Definido |
| Parâmetros de detalhe por ID estável | Definido |
| Expo SDK | Registrar versão usada no bootstrap |
| Biblioteca de testes | Pendente / não bloqueante |

---

## 18. Checklist antes de iniciar o desenvolvimento

Não há decisão arquitetural bloqueante restante para iniciar as telas. Antes do primeiro desenvolvimento, realizar somente o bootstrap técnico mínimo:

1. criar o projeto Expo com TypeScript e Expo Router;
2. registrar no `package.json`/lockfile a versão efetivamente utilizada do Expo e das dependências;
3. confirmar que o projeto abre no Android Emulator antes de implementar telas;
4. configurar a fonte Manrope conforme o Design System;
5. configurar uma implementação compatível dos Tabler Icons em estilo outline;
6. criar os tokens iniciais em `theme/` antes de espalhar estilos pelas telas;
7. criar os primeiros tipos TypeScript e o dataset mock centralizado;
8. criar a camada de `services` que consulta os mocks;
9. implementar primeiro a estrutura da bottom navigation;
10. validar cada tela no Android Emulator, usando web apenas como apoio.

### 18.1 O que não precisa ser decidido agora

Não é necessário adiar o desenvolvimento para escolher:

- biblioteca de estado global;
- arquitetura de backend;
- banco de dados;
- biblioteca definitiva de testes automatizados;
- implementação real das integrações ainda fora do escopo da entrega visual.

Esses itens devem ser introduzidos quando houver uma necessidade concreta e rastreável.

---

## 19. Evolução deste documento

Este arquivo deve evoluir junto com a implementação.

Alterações arquiteturais relevantes devem registrar:

- decisão tomada;
- motivo;
- alternativas consideradas;
- trade-offs;
- impacto sobre a estrutura existente;
- User Stories/telas afetadas;
- testes/regressões que precisam ser revistos.

Evitar criar estruturas paralelas sem revisar primeiro esta arquitetura e as decisões já registradas no projeto.
