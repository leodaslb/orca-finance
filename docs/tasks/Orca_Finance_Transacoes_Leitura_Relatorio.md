# Bloco A — relatório de implementação

## Fontes e decisões preservadas

Lidos AGENTS.md, tasks TXR-01–20, requisitos, regras de negócio revisadas,
fluxo, Design System, arquitetura e os PNGs 02/04.
`Orca_Finance_Backlog_Revisado_Final_RF_US.xlsx` não existe no workspace;
consultado `Orca_Finance_Backlog.xlsx`, que contém US01/02/03, e o mapeamento
RF/US disponível na planilha de regras e na arquitetura. A confirmação contra
a versão exata do backlog revisado permanece pendente.

As divergências entre propostas antigas e decisões na planilha não foram
transformadas em novas regras: descrição identifica a transação; categoria
pode ser nula; nenhuma mutação de reversão foi implementada.

## Rastreabilidade e verificação técnica

Não são critérios de aceitação oficiais do backlog.

| RF → US | RN relacionada | Tela / componente | Tasks | Implementação / verificação |
|---|---|---|---|---|
| RF13 → US03 | RN-TRANS-02; RN-PERFIL-01/02 | Lista / TransactionItem | TXR-01–07 | transaction.service, lista agrupada, busca; script verifica perfil, datas, IDs e busca |
| RF13, RF58 → US03 | Sem RN direta | Lista / TransactionFiltersSheet | TXR-08 parcial | Sheet abre/fecha; Aplicar e Limpar desabilitados; sem modelo/semântica de filtros inventados |
| RF21, RF36, RF58 → US02; RF01 → US01 como dependência | RN-TRANS-02 | Detalhe / TransactionDetailRow | TXR-09–12 | Consulta por ID; campos presentes; fallback neutro; script verifica relações/nulos e igualdade com lista |
| RF12 → US19 | Sem RN direta | Detalhe / comprovante | TXR-13 parcial | Seção condicional; URI mock indisponível; abertura externa HTTP(S) mínima, com tratamento de falha |
| RF20, RF64 → US24 (limite de leitura) | RN-TRANS-04 | Lista / detalhe | TXR-14 | Não exibe frequência sem fonte; status scheduled identificado como Prevista; script verifica exclusão do saldo |
| RF40, RF23 → US44/US04 (limite de escopo) | RN-TRANS-03 | Detalhe / ações indisponíveis | TXR-15 | Editar/Reverter desabilitados; sem mutação ou mensagem de sucesso |
| RF08 → US15; RF13 → US03 | RN-TRANS-02 | Dashboard / Lista → Detalhe | TXR-03/16/17 | Rotas por ID; voltar preserva origem; script compara registros e totais do Dashboard |
| RF13/21/36/58 → US03/US02 | Sem RN direta | Ambas as telas | TXR-18–20 | Revisão de tokens/PNG e typed routes; validações e limitações abaixo |

## Auditoria e componentes

Lista e detalhe já existiam como placeholders. TransactionItem, AppCard,
dashboard.service, utilitários e dataset também já existiam. Subcategorias
estão em categories.mock.ts; não foi criada outra fonte de dados.

TransactionItem recebeu variante de lista e estado previsto, mantendo os
estilos e defaults do Dashboard. A variante da lista resolve os IDs oficiais
`category-*` para os ícones existentes. O Dashboard já navegava por ID e não
precisou mudar sua rota. Seu service passou a entregar categoryId, que a tela
já consumia, corrigindo essa inconsistência do contrato.

## Decisões técnicas provisórias

- Busca por substring da descrição, ignorando caixa, acentos e espaços nas
  extremidades; função pura isolada, não regra de negócio definitiva.
- Estado previsto usa texto simples, sem badge definitivo.
- ID inexistente mostra mensagem neutra e Voltar; acesso direto sem histórico
  retorna à lista.
- HTTP(S) de comprovante pode ser aberto externamente com Linking. URI mock
  ou formato não suportado fica explicitamente indisponível. Viewer definitivo
  e suporte a arquivos locais permanecem pendentes.

## Pendências de produto

1. Filtros: data exata/intervalo, valor exato/faixa, seleção simples/múltipla,
   combinação AND/OR e PNG final do sheet.
2. Estratégia definitiva de matching da busca.
3. Edição inline ou formulário de cadastro.
4. Snapshot mínimo de auditoria antes da reversão.
5. Viewer de comprovante e arquivo real para o recibo mock.
6. Modelo/vínculo de recorrência para exibir frequência.

## Divergências visuais justificadas

- Salário mantém 01/09/2026, não Ontem; a lista inclui todo o perfil, inclusive
  agosto, sem filtro de período implícito.
- Recorrência Mensal omitida por ausência de fonte.
- Recibo mock não abre uma imagem fictícia.
- Categoria usa a paleta do Design System; fonte, tamanhos, bordas e ícones
  seguem tokens existentes, sem reproduzir cores divergentes do PNG.
- Ações bloqueadas indicam indisponibilidade; filtros usam a estrutura geral
  de sheet do Design System porque a referência específica está ausente.

## Validações

- `npx.cmd expo export --platform android --output-dir .expo/txr-validation`:
  passou, incluindo compilação Hermes (7.602 módulos). A primeira tentativa
  encontrou `spawn EPERM` no sandbox; a repetição com permissão concluiu.
  Isso valida empacotamento Android, não substitui teste no dispositivo.
- `node scripts/verify-transactions.cjs`: passou. Verifica isolamento de perfil,
  IDs, relações, campos nulos, ordenação, Hoje/Ontem (viradas de mês/ano e ano
  bissexto), busca e limpeza, imutabilidade, saldo e consistência das três telas.
  Casos adicionais existem somente na memória do processo de teste.
- `npx.cmd tsc --noEmit`: nenhuma falha dos arquivos deste bloco; falha global
  preexistente TS2307 em `src/hooks/use-theme.ts:6`, que importa o removido
  `@/constants/theme`. Hook não utilizado pelas telas; preservado fora do escopo.
- Typed routes continuam habilitadas; `/transacao/[id]` consta nos tipos
  gerados existentes. Sem `as any`.
- `npm.cmd run lint`: não executou a análise. Não há configuração ESLint;
  Expo tentou configurá-la e falhou com ECONNREFUSED. Nenhuma dependência ou
  configuração de lint foi adicionada.
- `git diff --check`: sem erros de whitespace. Arquivos do bloco já estavam
  majoritariamente não rastreados antes da execução; revisão também feita
  diretamente nos arquivos. Alterações anteriores do usuário preservadas.

## Status das tasks

- TXR-01–07, TXR-09–12, TXR-14–18: implementação e verificações estáticas
  concluídas no escopo de leitura. TXR-15 entrega somente o limite visual
  indisponível, não edição/reversão. A validação de navegação em execução
  de TXR-16/17 está incluída na pendência TXR-20.
- TXR-08: parcial, infraestrutura pronta; semântica de filtros bloqueada.
- TXR-13: parcial, seção condicional pronta; recibo oficial é apenas URI mock.
- TXR-19: parcial, testes de dados passaram; typecheck global e lint com os
  impedimentos preexistentes descritos acima.
- TXR-20: pendente. AVD Pixel_10 iniciado em modo headless não ficou acessível
  pelo ADB; conexão local também recusada. Processos iniciados nesta tentativa
  foram encerrados. Nenhuma validação manual/visual Android foi declarada.

## Checklist Android pendente

- Abrir tab, rolar até agosto, conferir teclado, fontes ampliadas e bottom nav.
- Buscar `COMBUSTIVEL`, limpar, buscar texto inexistente.
- Abrir sheet pelos três atalhos; fechar pelo fundo, Cancelar e botão físico.
- Dashboard → tx-001 → voltar; Lista → receita/despesa → voltar.
- Acessar ID inexistente com e sem histórico de navegação.
- Conferir campos de tx-001, ausências de tx-003 e recibo indisponível.
- Confirmar ausência de bottom nav no detalhe e ausência de mutações nas ações.
