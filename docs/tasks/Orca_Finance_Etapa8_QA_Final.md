# Etapa 8 — QA final da Sprint 1

Revisão em 27–28/09/2026. Base: `docs/RequisitosMobile.txt`, abas **Backlog Revisado** e **RN sincronizadas** do backlog vigente, regras consolidadas, fluxo de telas, Design System e PNGs de `references/`. O repositório já continha alterações de etapas anteriores antes desta revisão; elas foram preservadas. As capturas Android desta etapa estão em `.expo-audit/stage8/`.

## Telas auditadas

| # | Tela | Resultado |
| --- | --- | --- |
| 01 | Dashboard | Validada no Pixel_10 com perfil demo; saldo R$ 3.240,80, gastos R$ 1.180,00, comparação e meta coerentes com os services. Status Bar e barra inferior corrigidas. |
| 02 | Transações | Lista, busca vazia, detalhe e navegação validados. O chip **Em reflexão** agora filtra itens pendentes na própria lista; resultado, busca sem correspondência, abertura do item e isolamento entre perfis confirmados no Android. Filtros avançados continuam incompletos. |
| 03 | Nova transação | Vazio, erros de validação, teclado monetário, data/hora, categoria, essencialidade e saída para reflexão/recorrência exercitados no Android. |
| 04 | Detalhe da transação | Entrada pelo Dashboard e retorno, recibo ausente e confirmação de reversão exercitados; edição geral permanece indisponível. O código possui visualizador para `receiptUri` válida, mas recibo presente não foi exercitado com imagem real no Android. |
| 05 | Categorias/subcategorias | Lista, expansão e modal de criação inspecionados no Android. Criação e isolamento cobertos por script; edição/remoção ainda não existem. |
| 06 | Planejamento | Cartões, indicadores e rolagem validados no Android. Faixas de alerta ajustadas à RN vigente. Cadastro de orçamento mensal ainda ausente. |
| 07 | Limites e alertas | Tela, rolagem, switches e salvamento da configuração demonstrativa percorridos no Android. Período configurável e geração efetiva de alertas ainda não existem. |
| 08 | Gastos livres | Cota mensal editada de R$ 400,00 para R$ 450,00 em memória e refletida no Planejamento. Texto esclarecido para o período atual. |
| 09 | Planejado x realizado | Tela e valores validados no Android: R$ 3.000,00 planejados, R$ 1.180,00 realizados no demo; 0/0 no perfil novo sem erro. Corrigido cálculo que omitia despesa sem orçamento; perfil sem orçamento agora possui período válido. |
| 10 | Metas | Lista e navegação para nova meta/detalhe percorridas no Android. |
| 11 | Criar meta | Validação vazia, teclado numérico e entrada `20/12/2026` exercitados; meta de QA criada em memória. Máscara da data corrigida. |
| 12 | Detalhe da meta | Meta criada e aporte de R$ 50,00 exercitados no Android; progresso 0% → 5% e sugestão recalculada. Estado vencido/prorrogação cobertos por script. |
| 13 | Relatórios | Total e categorias conferidos com Dashboard/Planejamento. Modal CSV/Excel e compartilhamento textual nativo abertos, sem envio; arquivo físico parcial. |
| 14 | Boas-vindas/auth | Boas-vindas, login demo, teclado e erro de autenticação inspecionados no Android. Perfil novo criado no AVD com saldo/gastos/metas/transações zerados; relatório e planejamento zerados. Alternância de login confirmou que dados do demo permanecem e item de reflexão do perfil novo não aparece no demo. |
| 15 | Bloqueio local | PIN de quatro dígitos configurado; retorno do segundo plano exibiu bloqueio. PIN inválido mostrou erro, PIN válido desbloqueou. Modo biométrico demonstrativo foi aberto e desbloqueado por simulação no Android. |
| 16 | Segurança | Tela, modal, validação de PIN vazio, configuração do PIN e ativação biométrica demonstrativa exercitados no Android. A API biométrica nativa não está integrada. |
| 17 | Reflexão | Modal de decisão e retorno ao cadastro, duração padrão de 48 h, item aguardando e botão de finalização desabilitado confirmados no Android. Liberação/finalização após prazo cobertas por script, sem alterar relógio do dispositivo. |
| 18 | Recorrência | Modal, switch, campos, data da próxima ocorrência e retorno ao cadastro exercitados no Android; geração única, agendamento e revisão futura cobertos por script. Campos estáticos de término/antecedência permanecem parciais. |

As telas mantêm a linguagem dos PNGs (Manrope, Tabler outline, superfícies claras, cartões e azul primário). Os números dos PNGs foram tratados como exemplos; os valores exibidos vieram do dataset. Capturas úteis: `dashboard-fixed.png`, `transaction-errors.png`, `reflection-filter-result-real.png`, `reflection-filter-search-real.png`, `demo-reflection-isolated.png`, `new-reflection-after-relogin.png`, `comparison.png`, `new-comparison.png`, `goal-created.png`, `export-share.png`, `lock-biometric.png`, `lock-invalid.png`, `lock-unlocked.png` e `short-save-button.png` em `.expo-audit/stage8/`. A altura 1080 × 1920 também foi simulada no mesmo AVD para teclado, rolagem e acesso ao botão Salvar; a resolução 1080 × 2424 foi restaurada. Não foi validada outra densidade/dispositivo físico.

## Correções desta revisão

- Corrigidas duas rotas de reflexão que o TypeScript rejeitava (`/reflexao/index` → `/reflexao`) e a volta de Limites quando aberta sem histórico.
- O chip **Em reflexão** passou a alternar a lista de Transações, exibir somente itens pendentes, combinar com busca por descrição, indicar que o valor ainda não foi contabilizado e abrir a tela para conclusão. Antes ele apenas navegava para outra rota.
- Corrigidas as faixas do orçamento mensal: abaixo de 75% normal, de 75% até 100% atenção, acima de 100% excedido. A classificação diária passou a usar a mesma proximidade, preservando a indicação de limite diário atingido.
- Planejamento agora inclui todas as despesas efetivas do mês no total realizado, inclusive gasto livre sem categoria e despesas de categorias sem orçamento. Dashboard inclui **Sem categoria** no gráfico; contribuições de meta passaram a exigir o mesmo `profileId`. Testes cruzados confirmam R$ 1.180,00 no demo e igualdade após acrescentar gasto livre sem categoria.
- Período atual sempre disponível em Planejado x realizado, inclusive para perfil novo sem orçamento; evita data inválida. Corrigida a capitalização visual de `Setembro de 2026`.
- Removido ciclo de importação entre transações e recorrência com uma pequena função de escrita compartilhada. IDs de transação não são reutilizados depois de reversão, preservando a referência da auditoria.
- Ajustadas Status Bar, altura da barra inferior na Safe Area Android, máscara de datas em meta/aporte/recorrência, áreas de toque do switch e de voltar, e estados acessíveis dos controles principais. Botão de edição ainda indisponível ficou visualmente desabilitado.
- Texto da cota esclarece que a configuração vale para o período atual; textos de filtros/limites deixam explícita a implementação parcial, sem atribuir uma pendência de negócio inexistente.

## Android

SDK existente em `C:/Users/leocp/AppData/Local/Android/Sdk`, com `adb` e `emulator` chamados pelo caminho absoluto, sem mudar PATH global. AVD **Pixel_10**, Android 17 (`android-37.2`), 1080 × 2424 px, densidade 420, `emulator-5554` confirmado por `adb devices -l`. Expo SDK 57 executado no Expo Go via Metro em 8082, com `adb reverse tcp:8082 tcp:8082` e `exp://127.0.0.1:8082`. Nenhuma dependência do projeto foi atualizada.

Durante o QA, o AVD se desconectou após mostrar o bloqueio por PIN. Foi reiniciado e voltou a `adb devices`; o Expo Go ficou em carregamento até limpar seus dados locais no emulador (`pm clear host.exp.exponent`), sem alterar o código nem as dependências do projeto. Depois, foram concluídos no AVD o perfil novo, isolamento, filtro com item real, PIN válido/inválido e biometria demonstrativa. Não apareceu `AndroidRuntime`/`ReactNativeJS` fatal atribuído ao app; o AVD registrou falhas repetidas do serviço de UWB em `/dev/uwb0`. O encerramento espontâneo do AVD não tem causa atribuída ao código do projeto.

## Testes e regressões

| Comando | Resultado |
| --- | --- |
| `npx tsc --noEmit` | PASS |
| `node scripts/verify-transactions.cjs` | PASS |
| `node scripts/verify-planning.cjs` | PASS; thresholds e gasto livre sem categoria |
| `node scripts/verify-goals.cjs` | PASS; máscara/data e aporte |
| `node scripts/verify-reports.cjs` | PASS; totais entre módulos e exclusões |
| `node scripts/verify-security.cjs` | PASS; novo perfil vazio/isolado e segurança local |
| `node scripts/verify-stage7.cjs` | PASS; reflexão/filtro por descrição, recorrência, reversão e isolamento |
| `git diff --check` | PASS; apenas avisos de normalização LF/CRLF |

Também foram conferidos os consumidores dos services alterados: Dashboard, lista/detalhe de Transações, Planejamento, Metas, Relatórios, Reflexão e Recorrência. As capturas de recibo real e arquivo físico não foram declaradas aprovadas.

## Rastreabilidade

| RF → US → RN | Implementação revisada | Evidência |
| --- | --- | --- |
| RF13 → US03 → sem RN específica; RF05 → US12 → RN-REF-01/03 | filtro Em reflexão, busca/isolamento e estado aguardando | `src/app/(tabs)/transacoes.tsx`, `src/services/reflection.service.ts`, `verify-stage7.cjs`, Android até estado aguardando |
| RF03/RF24 → US06 → RN-ORC-01; RF57 → US45 → RN-ORC-05 | faixas, totais e gasto livre | `planning.service.ts`, `dashboard.service.ts`, `verify-planning.cjs` |
| RF55 → US40 → RN-TRANS-03/RN-ORC-02/05; RF08 → US15 → RN-TRANS-01/RN-META-01 | planejado/realizado e painel coerentes | `planning.service.ts`, `dashboard.service.ts`, `verify-planning.cjs`, `verify-reports.cjs`, Android |
| RF04 → US10 → RN-META-01/02 | entrada de data, aporte e separação do saldo | telas de Meta, `verify-goals.cjs`, Android |
| RF20/RF64 → US24 → RN-TRANS-04/RN-REC-01 | recorrência sem import circular, execução única/futura | `transaction-write.service.ts`, `recurrence.service.ts`, `verify-stage7.cjs` |
| RF40 → US44 → RN-TRANS-03/RN-AUD-01 | IDs estáveis após reversão | `transaction-write.service.ts`, `verify-stage7.cjs` |
| RF48 → US37 → RN-ID-01; US60 (sem RF original) → RN-ID-02/03 | PIN local e novo perfil vazio | `verify-security.cjs`, Android com login alternado |

Arquivos de código tocados por esta revisão: `src/app/(tabs)/{_layout,planejamento,transacoes}.tsx`, `src/app/_layout.tsx`, `src/app/{transacao,metas,planejamento,configuracoes,seguranca,reflexao}/`, `src/components/common/AppSwitch.tsx`, `src/components/domain/{TransactionForm,TransactionItem,TransactionFiltersSheet,RecurrenceConfigurationModal}.tsx`, `src/services/{dashboard,planning,transaction,transaction-write,recurrence,reflection}.service.ts` e `src/utils/date.ts`. Regressões adicionadas aos scripts `verify-{planning,goals,reports,security,stage7}.cjs`. Este arquivo é o relatório criado nesta revisão. Os demais arquivos marcados no Git já estavam alterados antes do QA.

## Pendências reais

**Funcional:** filtros avançados de data/categoria/valor/método da US03 continuam indisponíveis; edição geral e notas no formulário de transação ainda não existem; criação/edição de orçamento mensal da US06 e de limite por período ainda não existem; gestão de subcategorias vai além da criação; término/antecedência de recorrência e emissão efetiva de lembrete/alerta continuam parciais. A tela de reflexão liberada foi testada no service, não por espera real no Android. Esses itens não foram implantados nesta etapa de QA.

**Infraestrutura:** captura/seleção de foto do recibo (a URI é suportada na leitura), arquivo físico CSV/Excel (conteúdo CSV/TSV e compartilhamento textual existem), biometria nativa, push, persistência definitiva e backend. A persistência em memória é intencional para esta entrega demonstrativa.

**Visual:** não há divergência visual bloqueante confirmada no AVD. Resta inspeção em dispositivo físico/outra densidade. Na altura reduzida do Pixel_10, os campos focados ficaram visíveis com teclado e o botão Salvar permaneceu alcançável por rolagem.

**Documentação:** os PNGs/Design System antigos mostram faixas de alerta e valores ilustrativos que divergem das RN e do dataset atual; o fluxo de telas ainda registra a lista de reflexão como pendente, embora a rota exista. As planilhas não foram modificadas.

## Estado final da Sprint 1

- **Concluídas no escopo demonstrativo/mock:** Dashboard, consulta/busca textual de transações, filtro **Em reflexão**, detalhe e reversão auditada, categorias fixas/criação de subcategoria, planejamento de leitura, gastos livres, comparação, metas/aportes, relatórios e estados de reflexão/recorrência, autenticação local e PIN. O filtro também foi confirmado visualmente com item real, busca e troca de perfil no Android.
- **Parciais funcionais:** filtros avançados, edição de transação/meta/subcategoria, orçamento configurável, limites por período, término/antecedência de recorrência e alertas efetivos.
- **Parciais por infraestrutura:** câmera/seleção de recibo, arquivo exportado fisicamente, biometria nativa, notificações, persistência e backend.
- **Pendentes por decisão de negócio:** nenhuma das RN consolidadas consultadas para as telas desta revisão. Não classificar a regra de limite por período como indefinida: RN-LIM-01 já a consolidou.
