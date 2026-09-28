# Orca Finance — Tasks do Bloco A: Transações (Lista + Detalhe)

> **Escopo:** leitura/consulta de transações da Sprint 1  
> **Telas principais:** `02_transacoes_lista.png` e `04_transacao_detalhe.png`  
> **Rotas:** `src/app/(tabs)/transacoes.tsx` e `src/app/transacao/[id].tsx`  
> **US principais:** US03 (lista, busca e filtros) e US02 (detalhamento)  
> **RF principais:** RF13, RF58, RF21 e RF36  
> **Dependência funcional:** US01 / RF01  
> **Status:** planejado para implementação assistida por Codex

---

# 1. Objetivo deste documento

Este arquivo deve servir como guia de execução para um agente de código sem permitir que ele invente requisitos, regras de negócio ou decisões de UX.

A rastreabilidade obrigatória deste bloco é:

```text
RF
↓
User Story
↓
Regra/decisão relacionada
↓
Tela
↓
Componente
↓
Task
↓
Implementação
↓
Teste
```

O agente deve consultar as fontes de verdade antes de editar o código.

---

# 2. Fontes obrigatórias

Consultar, nesta ordem:

1. `RequisitosMobile.txt`
2. `Orca_Finance_Backlog_Revisado_Final_RF_US.xlsx`
3. `Orca_Finance_Regras_de_Negocio_Revisadas.xlsx`
4. `Orca_Finance_Fluxo_de_Telas_Sprint1.md`
5. `Orca_Finance_Design_System_Atualizado.md`
6. `Orca_Finance_Arquitetura_Frontend.md`
7. `02_transacoes_lista.png`
8. `04_transacao_detalhe.png`
9. código atual do Dashboard e componentes existentes

## Critérios de aceitação

O backlog disponível declara que **não contém critérios de aceitação detalhados**.

Portanto:

- não criar critérios de aceitação oficiais;
- usar os testes deste documento apenas como **critérios de verificação da implementação**;
- não preencher lacunas funcionais por inferência.

---

# 3. Rastreabilidade funcional

## 3.1 US03 — Consulta, busca e filtros de transações

User Story:

> Como usuário, quero buscar e filtrar transações por data, categoria, descrição, valor e método de pagamento para localizar registros específicos com rapidez.

### RF13

Permite busca e filtragem por:

- data;
- categoria;
- descrição;
- valor.

### RF58

Complementa US03 permitindo filtro por método de pagamento.

### Dependências

US03 depende de:

```text
US01
→ existência das transações

US02
→ método de pagamento e demais dados complementares
```

Não há RN específica vinculada diretamente a US03 no backlog revisado.

---

## 3.2 US02 — Detalhamento de transações

User Story:

> Como usuário, quero complementar minhas transações com tags, anotações, método de pagamento e classificações aplicáveis para organizá-las e analisá-las com mais contexto.

RF vinculados:

```text
RF21 → tags
RF36 → anotações
RF58 → método de pagamento
```

Dependência:

```text
US01 → transação base
```

Não há RN específica vinculada diretamente a US02 no backlog revisado.

---

# 4. Regras relacionadas que não podem ser violadas

Embora US02 e US03 não tenham RN direta, a visualização usa entidades regidas pelas regras de Transações.

## RN-TRANS-02 — identidade/campos da transação

Decisão mais recente registrada:

```text
descrição = identificação principal/nome da transação
```

Portanto:

- não criar propriedade `title`;
- não inventar campo de título separado;
- `description` continua sendo a identificação visível principal.

A categoria pode ser `null` em dados importados/persistidos, apesar de o cadastro manual do app pretender exigi-la.

Consequência para leitura:

```text
categoryId === null
→ mostrar fallback visual seguro
→ não quebrar a lista/detalhe
```

---

## RN-TRANS-03 — reversão

Regra consolidada:

- reversão remove a transação dos dados financeiros ativos;
- antes disso deve existir registro de auditoria;
- a transação deixa de afetar saldo, orçamento, relatórios e cálculos;
- não se cria transação inversa.

### Pendente

O conjunto mínimo de campos do snapshot de auditoria ainda não está definido.

### Limite deste bloco

Este bloco é de **leitura**.

Não implementar a mutação definitiva de reversão nesta entrega.

A ação pode ser representada visualmente no detalhe, mas não deve alterar o dataset sem a infraestrutura/decisão necessária.

---

## RN-TRANS-04 — futuras/programadas

Regra consolidada:

- transação futura/programada aparece como prevista;
- não afeta saldo atual antes da data prevista;
- ocorrência recorrente passa aos cálculos atuais na data configurada.

### Impacto na lista

Se o mock contiver `status: 'scheduled'`, a UI não deve apresentar esse item como se já estivesse efetivado.

Se o layout visual específico do estado "programada" não estiver definido, não inventar badge/estilo definitivo. Isolar o estado para ajuste futuro.

---

# 5. Fluxo oficial

## 5.1 Lista

Entrada:

```text
Bottom nav
→ Transações
```

Saídas oficiais:

```text
Transação
→ /transacao/[id]

Filtro
→ bottom sheet de filtros

Busca textual
→ atualiza a própria lista

Bottom nav +
→ Nova transação
```

---

## 5.2 Filtros avançados

Fluxo documentado:

```text
Lista
→ abrir filtro
→ bottom sheet

Aplicar filtros
→ fecha sheet
→ atualiza lista

Limpar
→ remove filtros

Cancelar/fechar
→ retorna sem alteração
```

Filtros previstos:

```text
data
categoria
valor
método de pagamento
```

Descrição permanece na busca textual da lista.

### Pendência importante

A documentação atual **não define**:

- data exata vs intervalo;
- valor exato vs mínimo/máximo/faixa;
- seleção única vs múltipla de categorias;
- seleção única vs múltipla de métodos;
- combinação AND/OR entre múltiplos valores;
- layout visual final do `tela_filtro_transacoes.png` não está disponível entre as referências atuais.

O agente não deve decidir isso silenciosamente.

---

## 5.3 Detalhe

Entradas:

```text
Lista
→ item

Dashboard
→ transação recente

opcionalmente
Nova transação → transação criada
```

Saídas previstas:

```text
Voltar
→ tela anterior

Editar
→ modo de edição

Reverter
→ confirmação

Ver recibo
→ visualização do comprovante quando houver
```

### Decisão pendente

Ainda não foi formalizado se editar:

1. acontece inline no detalhe; ou
2. reutiliza o formulário de cadastro em modo edição.

Não implementar a decisão definitiva neste bloco.

---

# 6. Análise visual — Lista

Referência: `02_transacoes_lista.png`.

Estrutura visual:

```text
Transações

[ Buscar transações                       ]

[ Data ] [ Categoria ] [ filtro ]

HOJE

[ ícone | Supermercado Extra | -R$ 187 | > ]
        | Alimentação

[ ícone | Combustível       | -R$ 120 | > ]
        | Transporte

OUTRO GRUPO DE DATA

[ ícone | Salário           | +R$ ...  | > ]
        | Renda fixa
```

Características importantes:

- título de tela forte;
- campo de busca;
- chips/atalhos de filtro;
- agrupamento por data;
- itens em cards/linhas amplas;
- ícone semântico;
- descrição como identificação principal;
- categoria em texto secundário;
- valor colorido por tipo;
- chevron;
- bottom navigation oficial permanece visível.

### Divergência conhecida

O PNG mostra "Salário" em "ONTEM", mas o mock central atualmente usa outra data.

**Não alterar o mock só para copiar a imagem.**

Agrupamento deve derivar das datas reais do dataset.

---

# 7. Análise visual — Detalhe

Referência: `04_transacao_detalhe.png`.

Estrutura:

```text
←     Detalhes da transação       editar

        - R$ 187,00
      Supermercado Extra
          [ Despesa ]

┌──────────────────────────────┐
│ Categoria        Alimentação │
│ Subcategoria     Supermercado│
│ Data              13 set 2026│
│ Hora                   14:32 │
│ Método      Cartão de débito │
│ Tags                #mercado │
│ Essencialidade    Essencial  │
└──────────────────────────────┘

Comprovante
[ Ver recibo > ]

Recorrente
[ Mensal ]

[ Editar transação ]

Reverter transação
```

## Importante: dados disponíveis x PNG

A tela deve ser alimentada pelo mock real.

Não hardcodar:

- `Supermercado Extra`;
- R$ 187;
- Alimentação;
- Supermercado;
- `#mercado`;
- recorrência mensal.

### Recorrência

O tipo `Transaction` atual não possui informação consolidada de frequência/recorrência.

Logo:

```text
NÃO mostrar "Mensal" apenas porque aparece no PNG.
```

Mostrar bloco de recorrência somente quando existir fonte de dados real para ele.

### Comprovante

`receiptUri` já existe no tipo atual.

Se houver comprovante:

```text
mostrar seção
```

Se não houver:

```text
não inventar comprovante
```

O comportamento final do visualizador deve respeitar o fluxo/documentação existente.

---

# 8. Arquitetura obrigatória

Manter:

```text
Screen / Route
↓
Service
↓
Mock Data Source
```

## UI não pode

```text
importar transactionsMock diretamente
importar categoriesMock diretamente
procurar subcategoria no mock
calcular regra financeira
```

## UI pode

- renderizar props;
- manter query/filtros locais;
- controlar abertura/fechamento de bottom sheet;
- disparar navegação.

---

# 9. Service proposto

Criar ou completar:

```text
src/services/transaction.service.ts
```

API conceitual mínima:

```ts
getTransactions(...)
getTransactionById(id)
```

Pode haver helpers internos para:

```text
enriquecer categoryId → categoryName
enriquecer subcategoryId → subcategoryName
ordenar por data/hora
```

A tela deve receber um DTO de leitura, não precisar conhecer os mocks relacionados.

## Contrato conceitual de listagem

```ts
{
  id,
  description,
  type,
  amountCents,
  date,
  time,
  status,
  categoryId,
  categoryName
}
```

## Contrato conceitual de detalhe

```ts
{
  id,
  description,
  type,
  amountCents,
  date,
  time,

  categoryId,
  categoryName,

  subcategoryId,
  subcategoryName,

  paymentMethod,

  tags,
  notes,
  essentiality,

  receiptUri,
  status
}
```

Não duplicar esses tipos se os tipos de domínio existentes puderem ser compostos/reutilizados.

---

# 10. Componentes

## Reutilizar/adaptar primeiro

Já existem:

```text
AppCard
TransactionItem
formatCurrency
formatTransactionDateTime
theme tokens
```

Antes de criar um componente novo, verificar se estes atendem.

---

## 10.1 `TransactionItem`

O item atual foi criado para o Dashboard.

Para a lista, preferir adaptar com props opcionais, por exemplo conceitualmente:

```text
showChevron
showDateLabel
variant/list
```

Não alterar o visual do Dashboard como regressão.

Se a adaptação tornar o componente excessivamente condicional, extrair apenas partes realmente comuns, por exemplo:

```text
TransactionIcon
```

e manter dois wrappers especializados.

---

## 10.2 `TransactionDetailRow`

Provável novo componente:

```text
src/components/domain/TransactionDetailRow.tsx
```

Responsabilidade:

```text
ícone
label
value
divisor opcional
```

Exemplos:

```text
Categoria
Alimentação

Data
13 set 2026

Hora
14:32
```

Não conhece mocks.

---

## 10.3 `SearchInput`

Só criar em `components/common` se houver reutilização real ou se a implementação justificar.

Não criar uma abstração genérica apenas por uma única tela.

---

# 11. Estrutura esperada

Estrutura provável ao fim do bloco:

```text
src/
├── app/
│   ├── (tabs)/
│   │   └── transacoes.tsx
│   │
│   └── transacao/
│       └── [id].tsx
│
├── components/
│   ├── common/
│   │   └── ...
│   │
│   └── domain/
│       ├── TransactionItem.tsx
│       └── TransactionDetailRow.tsx
│
├── services/
│   ├── dashboard.service.ts
│   └── transaction.service.ts
│
├── data/
│   └── mocks/
│       └── ...
│
└── utils/
    └── ...
```

Não criar nova arquitetura paralela.

---

# 12. TASKS

---

## TXR-01 — Auditar implementação existente antes de editar

### Objetivo

Evitar duplicação e regressão no Dashboard.

### Conferir

```text
src/components/domain/TransactionItem.tsx
src/services/dashboard.service.ts
src/data/mocks/transactions.mock.ts
src/data/mocks/categories.mock.ts
src/data/mocks/subcategories...
src/types/transaction.ts
src/app/(tabs)/transacoes.tsx
src/app/transacao/[id].tsx
```

### Saída esperada

Registrar no resumo final:

- quais componentes foram reutilizados;
- quais precisaram ser adaptados;
- quais arquivos já existiam.

---

## TXR-02 — Criar `transaction.service.ts`

Arquivo:

```text
src/services/transaction.service.ts
```

### Objetivo

Centralizar leitura de transações para lista/detalhe.

### Implementar

```text
getTransactions()
getTransactionById(id)
```

### Responsabilidades

- filtrar pelo perfil ativo;
- ordenar por data/hora;
- resolver nomes de categoria;
- resolver nome de subcategoria quando aplicável;
- preservar `status`;
- retornar dados consistentes com Dashboard.

### Não fazer

- hardcode de valores;
- mutação;
- reversão;
- edição;
- persistência.

---

## TXR-03 — Garantir consistência Dashboard ↔ Transações

### Objetivo

A mesma transação deve possuir os mesmos dados em todas as telas.

Exemplo esperado:

```text
Dashboard
Supermercado Extra
R$ 187,00

Lista
Supermercado Extra
R$ 187,00

Detalhe
Supermercado Extra
R$ 187,00
```

### Teste

Comparar pelo mesmo `id`.

Não comparar por posição no array ou descrição.

---

## TXR-04 — Implementar agrupamento de transações por data

### Objetivo

Permitir seções de lista.

### Regra

Derivar grupos da data real da transação e de:

```text
mockScenario.referenceDate
```

### Estados esperados

Pelo menos:

```text
Hoje
Ontem
data formatada para demais dias
```

### Cuidado

O PNG não é fonte de data.

Não mover transações entre datas para reproduzir "Hoje/Ontem".

### Implementação

Pode ser helper em:

```text
transaction.service.ts
```

ou `utils/date.ts` se houver reutilização clara.

---

## TXR-05 — Adaptar `TransactionItem` para a lista

### Objetivo

Reutilizar comportamento/visual já criado para Dashboard sem duplicar.

### Na lista deve suportar

- ícone;
- descrição;
- categoria;
- valor;
- receita/despesa;
- chevron;
- área de toque ampla.

### Dashboard deve continuar funcionando

Não introduzir regressão em:

```text
01 Dashboard
```

### Teste

Renderizar o mesmo componente/infraestrutura nos dois contextos.

---

## TXR-06 — Implementar tela de Lista de Transações

Arquivo:

```text
src/app/(tabs)/transacoes.tsx
```

Referência:

```text
02_transacoes_lista.png
```

### Conteúdo

- título `Transações`;
- busca;
- atalhos/chips visuais;
- lista agrupada;
- bottom nav existente.

### Dados

Somente via:

```text
transaction.service
```

### Navegação

Item:

```ts
router.push({
  pathname: '/transacao/[id]',
  params: { id }
})
```

Typed routes devem continuar sem erros.

---

## TXR-07 — Implementar busca textual

### Rastreabilidade

```text
RF13
→ US03
→ descrição
```

### Comportamento confirmado

Busca atua sobre a própria lista.

### Pendência

A regra exata de matching não está formalizada.

### Orientação ao agente

Isolar a estratégia de busca em uma função pura e simples, sem alterar dados.

Se for adotada busca por substring normalizada/case-insensitive como decisão técnica provisória:

- documentar explicitamente como provisória no resumo;
- manter função facilmente substituível;
- não transformar essa estratégia em regra de negócio.

### Verificar

- query vazia → lista completa;
- busca não altera mocks;
- limpar query restaura lista.

---

## TXR-08 — Preparar filtros sem inventar semântica

### Rastreabilidade

```text
RF13
RF58
→ US03
```

Filtros documentados:

```text
data
categoria
valor
método de pagamento
```

### Bloqueio

Não há definição suficiente para escolher:

```text
intervalo/exato
single/multi
valor mínimo/máximo
```

### Implementação permitida

- botão de filtro;
- estado abrir/fechar;
- estrutura de bottom sheet seguindo Design System;
- callbacks `Aplicar`, `Limpar`, `Cancelar`;
- arquitetura pronta para receber o modelo de filtros.

### Implementação proibida

Não inventar controles/semânticas definitivas sem decisão registrada.

### Entrega

Se nenhuma decisão adicional existir no repositório, marcar:

```text
FILTROS — parcial / bloqueado por decisão de produto
```

Não mascarar como completo.

---

## TXR-09 — Criar `TransactionDetailRow`

Arquivo provável:

```text
src/components/domain/TransactionDetailRow.tsx
```

### Props conceituais

```text
icon
label
value
showDivider
```

### Objetivo

Evitar repetição de layout no detalhe.

### Não deve

- importar dados;
- formatar regra financeira;
- navegar.

---

## TXR-10 — Implementar leitura de detalhe no service

### Função

```ts
getTransactionById(id)
```

### Deve entregar

quando disponível:

```text
description
amount
type
category
subcategory
date
time
payment method
tags
notes
essentiality
receipt
status
```

### Ausências

Campos opcionais devem ser tratados sem texto inventado.

Exemplo:

```text
notes === null
→ não mostrar seção, ou mostrar ausência neutra se já previsto visualmente
```

Não criar conteúdo fictício.

---

## TXR-11 — Implementar tela Detalhe da Transação

Arquivo:

```text
src/app/transacao/[id].tsx
```

Referência:

```text
04_transacao_detalhe.png
```

### Header

- voltar;
- título;
- affordance de edição somente conforme escopo visual.

### Resumo

- valor;
- descrição;
- tipo receita/despesa.

### Dados

Renderizar apenas os campos realmente existentes.

### Regra visual

```text
despesa → negative
receita → positive
```

### Sem bottom navigation

Detalhe é tela filha/Stack.

---

## TXR-12 — Tratar transação inexistente de forma segura

### Cenário

```text
/transacao/id-inexistente
```

### Requisito arquitetural

A rota solicita dado pelo ID e deve tratar ausência visualmente de maneira segura.

### Pendência

Estado visual definitivo de erro não está formalizado.

### Implementação

Criar fallback mínimo e neutro sem inventar regra:

```text
"Transação não encontrada"
ação de voltar
```

Não crashar.

---

## TXR-13 — Exibir comprovante somente quando houver

Fonte:

```text
transaction.receiptUri
```

### Se houver

Mostrar seção `Comprovante`.

### Se não houver

Não criar recibo fictício.

### Ação

O fluxo prevê "Ver recibo", porém não há neste bloco uma tela de referência específica do visualizador.

Não implementar viewer complexo sem necessidade.

Se uma ação técnica mínima for criada, documentá-la claramente.

---

## TXR-14 — Tratar recorrência sem hardcode

### Problema

O PNG de detalhe mostra:

```text
Recorrente
Mensal
```

Mas o tipo `Transaction` atual não fornece frequência consolidada.

### Regra

Não renderizar "Mensal" sem fonte real.

### Possível futuro

Quando houver model/service de recorrência:

```text
transaction
→ recurrence
→ frequência
```

Então a seção poderá ser ativada.

---

## TXR-15 — Preservar ações Editar/Reverter como limite de escopo

### Editar

Existe no fluxo, mas a estratégia permanece pendente:

```text
inline
vs
reutilizar cadastro
```

Não tomar essa decisão neste bloco.

### Reverter

RN-TRANS-03 está consolidada, mas implementar a mutação exige:

- auditoria;
- definição de snapshot;
- atualização consistente de todos os cálculos.

Não fazer uma falsa reversão apenas removendo item de um array local.

### Permitido neste bloco

- aparência dos botões conforme referência;
- callbacks isolados;
- TODO/feature flag explícito ou ação temporariamente indisponível, conforme padrão atual.

### Não permitido

Botão aparentar sucesso de edição/reversão sem executar regra completa.

---

## TXR-16 — Integrar Dashboard → Detalhe real

### Objetivo

Remover placeholder técnico do detalhe.

Fluxo:

```text
Dashboard
→ Supermercado Extra
→ /transacao/tx-001
→ detalhe real da mesma transação
```

### Verificar

- ID correto;
- valores iguais;
- voltar retorna ao Dashboard.

---

## TXR-17 — Integrar Lista → Detalhe

Fluxo:

```text
Transações
→ item
→ detalhe
→ voltar
→ lista
```

### Verificar

A navegação não depende de descrição/índice.

Somente `id`.

---

## TXR-18 — Validar Design System

Checklist:

- [ ] Manrope;
- [ ] Tabler Icons outline;
- [ ] `StyleSheet.create`;
- [ ] tokens de `theme`;
- [ ] cards/bordas/radius consistentes;
- [ ] sem biblioteca de styling nova;
- [ ] sem sombras pesadas;
- [ ] sem gradientes novos;
- [ ] bottom nav somente na lista;
- [ ] detalhe sem bottom nav;
- [ ] valores vêm do mock/service;
- [ ] nenhuma regra nova embutida na UI.

---

## TXR-19 — Executar typecheck/lint

Executar os comandos existentes no projeto.

Se não houver scripts específicos:

```text
npx tsc --noEmit
```

e validações Expo disponíveis.

### Corrigir

- erros de typed routes;
- imports não utilizados;
- tipos inconsistentes;
- regressões introduzidas.

Não alterar código não relacionado apenas para "limpar" o projeto.

---

## TXR-20 — Teste manual Android

### Lista

Verificar:

- abre pela tab Transações;
- busca renderiza;
- grupos de data corretos;
- valores e categorias corretos;
- receita/despesa com cor correta;
- scroll;
- bottom nav não cobre conteúdo.

### Detalhe

Verificar:

- rota por ID;
- back;
- amount;
- description;
- category/subcategory;
- date/time;
- method;
- tags;
- essentiality;
- receipt somente se houver;
- sem recorrência fictícia.

### Integração

Verificar:

```text
Dashboard → detalhe
Lista → detalhe
Detalhe → voltar
```

---

# 13. Ordem recomendada de implementação

```text
TXR-01
auditoria do código
      ↓
TXR-02
transaction.service
      ↓
TXR-03
consistência
      ↓
TXR-04
agrupamento de data
      ↓
TXR-05
TransactionItem
      ↓
TXR-06
Lista
      ↓
TXR-07
Busca
      ↓
TXR-08
Filtros / infraestrutura
      ↓
TXR-09
TransactionDetailRow
      ↓
TXR-10
service detalhe
      ↓
TXR-11
Detalhe
      ↓
TXR-12
ID inexistente
      ↓
TXR-13 / TXR-14 / TXR-15
estados e limites
      ↓
TXR-16 / TXR-17
integração de navegação
      ↓
TXR-18
Design System
      ↓
TXR-19
typecheck
      ↓
TXR-20
Android
```

---

# 14. Critérios de verificação da implementação

> Não são critérios oficiais do backlog.

O bloco pode ser considerado implementado quando:

- [ ] tab Transações abre a lista;
- [ ] lista usa `transaction.service`;
- [ ] lista não importa mocks;
- [ ] transações usam IDs estáveis;
- [ ] ordenação é derivada de data/hora;
- [ ] agrupamento é derivado do dataset;
- [ ] descrição é a identificação principal;
- [ ] busca atua sobre a lista;
- [ ] filtro possui infraestrutura sem semântica inventada;
- [ ] item abre `/transacao/[id]`;
- [ ] Dashboard abre o mesmo detalhe;
- [ ] detalhe consulta service por ID;
- [ ] detalhe usa os dados reais do mesmo mock;
- [ ] categoria/subcategoria são resolvidas pelo service;
- [ ] `null` não quebra a tela;
- [ ] recibo só aparece quando existe;
- [ ] recorrência não é hardcoded;
- [ ] editar não escolhe silenciosamente uma estratégia pendente;
- [ ] reverter não executa mutação incompleta;
- [ ] typed routes compilam;
- [ ] `tsc` não apresenta erros novos;
- [ ] fluxo foi validado no Android.

---

# 15. Definition of Done do Bloco A

```text
US03 / RF13 / RF58
✅ rastreados

US02 / RF21 / RF36 / RF58
✅ rastreados

Arquitetura
✅ definida

Service de transações
⬜

Lista
⬜

Busca
⬜

Infraestrutura de filtros
⬜

Detalhe
⬜

Dashboard → detalhe
⬜

Lista → detalhe
⬜

Typecheck
⬜

Android
⬜
```

---

# 16. Pendências que o agente deve devolver explicitamente

Ao final, listar sem tentar resolver:

1. semântica exata de cada filtro;
2. visual final do bottom sheet de filtros caso a referência continue ausente;
3. estratégia definitiva de edição;
4. campos mínimos do snapshot de auditoria da reversão;
5. viewer definitivo de comprovante, se ainda não houver fluxo/tela;
6. vínculo/modelo de recorrência necessário para exibir frequência no detalhe;
7. qualquer divergência entre PNG e mock oficial.

---

# 17. Resumo obrigatório do agente ao finalizar

O agente deve responder com:

```text
ARQUIVOS CRIADOS
...

ARQUIVOS MODIFICADOS
...

RASTREABILIDADE
RF...
US...
RN...

O QUE FOI IMPLEMENTADO
...

TESTES EXECUTADOS
...

PENDÊNCIAS NÃO RESOLVIDAS
...

DIVERGÊNCIAS PNG x DADOS/REQUISITOS
...
```

Não declarar uma funcionalidade como completa se estiver bloqueada por decisão pendente.
