# AGENTS.md — Orca Finance Mobile

## Papel
Atue como engenheiro de software do projeto acadêmico Orca Finance Mobile.
Implemente somente o que estiver sustentado por requisitos, backlog, regras de negócio, fluxo de telas, Design System, arquitetura, task file e PNG de referência.

Preserve rastreabilidade:
RF → User Story → Regra de negócio → Task → Implementação → Teste

## Fontes de verdade
Antes de alterar código, leia as fontes relevantes em `docs/` e `references/`.

Ordem:
1. Requisitos originais
2. Backlog revisado RF ↔ US
3. Regras de negócio consolidadas
4. Fluxo de telas da Sprint 1
5. Design System atualizado
6. Arquitetura Frontend
7. Task file do bloco atual
8. PNG de referência
9. Código existente

Se houver conflito, não invente solução silenciosamente. Registre a divergência.
Se algo não estiver definido, trate como decisão pendente.

## Arquitetura
Stack:
- React Native
- Expo
- TypeScript
- Expo Router
- StyleSheet
- Manrope
- Tabler Icons

Fluxo:
Screen / Route → Service → Mock Data Source

Regras:
- `src/app` deve ficar enxuto;
- tela não importa mock diretamente;
- service concentra acesso aos dados;
- não criar Repository/ViewModel/store global sem necessidade concreta;
- estado local primeiro;
- não duplicar datasets;
- adaptar código existente antes de criar estrutura paralela;
- não adicionar dependências sem necessidade clara.

## Domínio financeiro
Dinheiro no frontend usa centavos inteiros.
Ex.: R$ 187,50 → `18750`.

Não usar float/double para cálculos financeiros.

Usar IDs estáveis:
- `tx-001`
- `category-food`
- `subcategory-supermarket`

Descrição é a identificação principal da transação.
Não criar `title`/`name` paralelo.

Campos atuais da transação:
- type
- amountCents
- date
- time
- description
- categoryId
- subcategoryId
- paymentMethod
- tags
- notes
- essentiality
- receiptUri
- status

Categoria pode ser nula no domínio/importação, mas no cadastro manual pelo app é obrigatória.

RN-TRANS-01:
saldo atual = saldo inicial + receitas efetivadas - despesas efetivadas.
Transações futuras não afetam saldo atual.

RN-TRANS-04:
lançamento futuro fica programado/previsto e não entra no saldo atual antes da data.

Reversão:
não criar transação inversa. Preservar auditoria conforme regras existentes.

## Design System
Usar tokens de `src/theme`.
Não espalhar hexadecimais.
Fonte: Manrope.
Ícones: Tabler outline.
Evitar gradientes, sombras pesadas e novas bibliotecas visuais.

Quando existir PNG aprovado, comparar diretamente com ele.
Não adicionar campo/ação sem fonte.

## Navegação
Bottom nav oficial:
Início | Transações | + | Planejamento | Relatórios

`+` abre Nova Transação.
Perfil/Configurações fica fora da bottom nav.

Detalhes usam IDs estáveis:
- `/transacao/[id]`
- `/metas/[id]`

Evitar `as any` em rotas.
Tratar fallback quando `router.back()` não tiver histórico.

## Estado atual
Já existem:
- Dashboard
- Lista de Transações
- Detalhe da Transação
- formulário visual de Nova Transação
- transaction service de leitura
- mocks centralizados
- categorias/subcategorias
- busca textual
- infraestrutura parcial de filtros

Não reimplementar essas telas do zero.

## Cadastro de Transação
Tela: `03_transacao_cadastro.png`

RF/US:
- RF01 / US01
- RF21, RF36, RF58 / US02
- RF12 / US19
- RF20, RF64 / US24
- integração com US12

Obrigatórios no cadastro manual:
- tipo
- valor
- data
- hora
- descrição
- categoria

Complementares:
- subcategoria
- método de pagamento
- tags
- classificação/essencialidade
- recibo
- recorrência/lembrete

Não tornar complementares obrigatórios sem fonte.

Subcategoria só deve aparecer quando houver opções para a categoria.

## Pendências que não podem ser resolvidas implicitamente
Não decidir sozinho:
- destino definitivo após salvar transação;
- edição inline vs reutilização do formulário;
- duração do período de reflexão;
- lista definitiva de itens em reflexão;
- efeito de editar/cancelar recorrência sobre ocorrências futuras;
- política completa de notificações;
- campos definitivos do snapshot de auditoria;
- persistência/backend definitivo;
- estados visuais ainda não formalizados.

Se uma task depender disso, implemente somente a infraestrutura segura e marque como parcial/bloqueada.

## Recibo, recorrência e reflexão
Recibo:
- US19/RF12: associar foto à transação.
- Não implementar OCR nessa task.

Recorrência:
formulário → configuração → retorno preservando estado.
Não inventar frequência/regra ausente.

Reflexão:
despesa + não essencial → fluxo de reflexão antes de concluir.
Item em reflexão não é transação concluída.

## Qualidade
Antes de criar novo arquivo, verificar se um existente pode ser adaptado.

Evitar:
- componentes minúsculos sem reutilização;
- hooks/helpers prematuros;
- overengineering;
- duplicação de tipos;
- regra de negócio em componente puramente visual.

## Testes
Quando aplicável:
`npx tsc --noEmit`

Se houver lint configurado:
`npm run lint`

Não instalar ESLint só para satisfazer a task.

Android Emulator é a validação visual prioritária.

Sempre verificar regressão em:
- Dashboard
- Lista
- Detalhe
- navegação afetada

## Erros preexistentes
Não criar arquivos duplicados para mascarar erro fora do escopo.
Registrar erros preexistentes separadamente.

## Execução por lotes
O usuário pode passar 2–3 etapas por execução.
Faça apenas as tasks pedidas e dependências técnicas indispensáveis.
Não avance automaticamente para blocos seguintes.

## Relatório final obrigatório
### Tasks concluídas
### Tasks parciais/bloqueadas
### Arquivos criados
### Arquivos modificados
### Rastreabilidade
RF → US → RN → Task → implementação
### Testes executados
### Regressões verificadas
### Pendências
### Divergências PNG x requisito x dados

## Autonomia de execução

Quando o usuário fornecer uma etapa/bloco funcional, execute todas as tasks
necessárias e não bloqueadas para completar esse bloco de ponta a ponta.

Você pode, sem pedir confirmação:

- criar ou adaptar componentes necessários;
- complementar services existentes;
- adicionar tipos auxiliares necessários;
- criar rotas previstas nos documentos;
- conectar telas já documentadas;
- implementar validações explicitamente derivadas dos RF/RN;
- corrigir regressões causadas pelo próprio bloco;
- refatorar localmente quando reduzir duplicação sem alterar arquitetura;
- criar scripts/testes técnicos compatíveis com a estrutura atual.

Não interrompa a execução apenas porque uma task intermediária terminou.

Pare ou deixe parcial somente quando houver:

- decisão de negócio explicitamente pendente;
- conflito entre fontes oficiais;
- necessidade de dependência nova relevante;
- mudança arquitetural;
- comportamento que não possa ser deduzido das fontes.

Quando houver uma decisão pendente que não bloqueia o restante do bloco,
isole essa parte e continue implementando o que estiver definido.


## Regra de iniciativa

Não pedir confirmação para decisões técnicas triviais e reversíveis.

Exemplos que o agente pode decidir sozinho:

- nome de função privada;
- organização interna de StyleSheet;
- extração de componente quando o arquivo ficar excessivamente grande;
- tratamento defensivo de null;
- reutilização de helper existente;
- ordem interna de implementação;
- criação de tipos auxiliares;
- testes técnicos para comportamento já especificado.

Isso não se aplica a regra de negócio ou decisão de produto.
Não declarar task completa sem executar a validação necessária.
