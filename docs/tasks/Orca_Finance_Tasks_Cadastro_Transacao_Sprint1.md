# Orca Finance — Tasks do Bloco B: Cadastro de Transação

> **Escopo principal:** criação manual de transações da Sprint 1  
> **Tela principal:** `03_transacao_cadastro.png`  
> **Integrações relacionadas:** recibo, recorrência/lembrete e reflexão antes da compra  
> **US principal:** US01  
> **RF principal:** RF01  
> **US relacionadas:** US02, US19, US24 e integração com US12

---

## 1. Objetivo

Implementar o fluxo de **Nova Transação** preservando a arquitetura atual:

```text
Screen / Route
→ Service
→ Mock Data Source
```

Rastreabilidade obrigatória:

```text
RF → US → RN → Tela/Estado → Componente → Task → Implementação → Teste
```

Não inventar requisitos, regras de negócio ou decisões de UX.

---

## 2. Fontes obrigatórias

Consultar antes de implementar:

1. `RequisitosMobile.txt`
2. `Orca_Finance_Backlog_Revisado_Final_RF_US.xlsx`
3. `Orca_Finance_Regras_de_Negocio_Revisadas.xlsx`
4. `Orca_Finance_Fluxo_de_Telas_Sprint1.md`
5. `Orca_Finance_Design_System_Atualizado.md`
6. `Orca_Finance_Arquitetura_Frontend.md`
7. `03_transacao_cadastro.png`
8. `17_reflexao_compra.png`
9. `18_recorrencia_configuracao.png`
10. implementação atual de Dashboard, Lista e Detalhe

O backlog atual não contém critérios de aceitação detalhados oficiais. As verificações deste arquivo são critérios técnicos de implementação, não critérios oficiais.

---

## 3. Rastreabilidade funcional

### US01 — Registro manual de transações

> Como usuário, quero registrar manualmente receitas e despesas com valor, data, hora, descrição e categoria para manter meu histórico financeiro atualizado.

**RF01** é o requisito principal.

RN relacionadas:

```text
RN-TRANS-01
RN-TRANS-02
```

### US02 — Dados complementares

Relacionada a:

```text
RF21 → tags
RF36 → anotações
RF58 → método de pagamento
```

Esses campos não devem ser transformados em obrigatórios sem fonte formal.

### US19 — Recibo

```text
RF12 → anexar foto de recibo a uma despesa
```

OCR pertence à US55/RF29 e fica fora deste bloco.

### US24 — Recorrência e lembretes

```text
RF20
RF64
→ US24
→ RN-TRANS-04
→ RN-NOT-01
→ RN-REC-01
```

### US12 — Reflexão antes da compra

Integração somente quando:

```text
type === expense
AND
essentiality === non-essential
```

Relacionada a RF05, RF70, RN-CAT-02, RN-REF-01 e RN-REF-03.

---

## 4. Regras obrigatórias

### RN-TRANS-01 — saldo

```text
saldo atual = saldo inicial + receitas efetivadas − despesas efetivadas
```

Transações futuras/programadas não afetam o saldo atual antes da data prevista.

### RN-TRANS-02 — identificação e campos

A decisão atual é:

```text
descrição = identificação principal da transação
```

Não criar `title`, `name` ou campo equivalente separado.

Campos base obrigatórios:

```text
tipo
valor
data
hora
descrição
```

A persistência pode aceitar categoria nula, mas no **cadastro manual pelo app** a decisão registrada exige categoria.

### RN-TRANS-04 — futuras/programadas

Transação programada:

```text
status = scheduled
```

- aparece como prevista;
- não afeta saldo atual antes da data;
- não deve ter sua efetivação temporal automatizada de forma inventada.

### RN-CAT-02 — essencialidade

Despesa pode ser:

```text
Essencial
Não essencial
Não classificada
```

A essencialidade não altera categoria automaticamente.

---

## 5. Fluxo oficial

Entrada:

```text
bottom nav +
→ /transacao/nova
```

Ações principais:

```text
Salvar transação
→ validar
→ registrar
```

Integrações:

```text
Adicionar comprovante
→ câmera/seleção

Recorrência
→ configuração

Lembrete
→ configuração associada

Despesa não essencial
→ reflexão antes da compra
```

Após salvar, a documentação admite Lista ou Detalhe e recomenda Detalhe, mas essa escolha não é obrigatória. Tratar como decisão pendente até confirmação.

---

## 6. Estrutura técnica esperada

Rota:

```text
src/app/transacao/nova.tsx
```

Service:

```text
src/services/transaction.service.ts
```

API conceitual:

```ts
createTransaction(input)
```

A rota deve ser fina e cuidar de composição, estado local, callbacks e navegação. A UI não importa mocks diretamente.

A criação deve escrever na mesma fonte usada por Dashboard, Lista e Detalhe durante a execução. Não criar um segundo dataset.

---

# 7. Tasks

## TXC-01 — Auditar o fluxo atual

Inspecionar:

```text
src/app/transacao/nova.tsx
src/services/transaction.service.ts
src/types/
src/data/mocks/
src/components/common/
src/components/domain/
```

Também verificar contratos já usados por Dashboard, Lista e Detalhe.

**Saída:** registrar o que será reutilizado e quais mudanças podem causar regressão.

---

## TXC-02 — Definir contrato de criação

Criar/ajustar `CreateTransactionInput` sem duplicar o domínio desnecessariamente.

Campos base:

```text
type
amountCents
date
time
description
categoryId
```

Campos complementares apenas se já existirem no modelo:

```text
subcategoryId
paymentMethod
tags
notes
essentiality
receiptUri
status
```

Não adicionar `title`.

---

## TXC-03 — Implementar parsing monetário

Entrada visual BRL deve virar centavos inteiros.

Exemplos técnicos:

```text
187 → 18700
187,50 → 18750
vazio → inválido
0 → inválido para criação
```

Não usar `float` como representação do domínio.

---

## TXC-04 — Implementar estado local do formulário

Usar estado local.

Não adicionar Redux, Zustand ou estado global para esse fluxo.

Separar dados do formulário e estado visual apenas quando melhorar clareza.

---

## TXC-05 — Seletor Receita / Despesa

Rastreabilidade:

```text
RF01 → US01
```

Deve alimentar `type` e deixar seleção visual clara.

Não inferir tipo pela categoria.

---

## TXC-06 — Campo Valor

- aceitar entrada BRL;
- converter para centavos;
- bloquear salvamento inválido;
- não armazenar decimal monetário.

---

## TXC-07 — Campo Descrição

Rastreabilidade:

```text
RF01
RN-TRANS-02
```

Descrição é obrigatória e é a identificação principal.

Não criar campo de título/nome separado.

---

## TXC-08 — Data e Hora

Manter formato do modelo existente:

```text
date: YYYY-MM-DD
time: HH:mm
```

Preferir recursos já disponíveis no Expo/React Native antes de instalar biblioteca.

---

## TXC-09 — Seleção de Categoria

No cadastro manual pelo app, exigir categoria conforme decisão registrada.

A UI deve receber opções por service/helper adequado, não importar mock diretamente.

Salvar `categoryId`, não `categoryName` como vínculo.

---

## TXC-10 — Subcategoria

- filtrar pelas opções da categoria escolhida;
- salvar `subcategoryId`;
- limpar subcategoria incompatível ao trocar categoria;
- não inventar subcategoria quando não houver opção.

---

## TXC-11 — Método de Pagamento

Rastreabilidade:

```text
RF58 → US02
```

Usar apenas valores já aceitos pelo modelo/projeto.

Não torná-lo obrigatório sem base documental.

---

## TXC-12 — Essencialidade

Implementar os estados documentados:

```text
Essencial
Não essencial
Não classificada
```

Não alterar categoria automaticamente.

---

## TXC-13 — Tags e Anotação

Rastreabilidade:

```text
RF21
RF36
→ US02
```

Somente se o modelo atual já suportar esses campos.

Devem permanecer opcionais.

---

## TXC-14 — Validação do formulário

Validar antes de salvar:

```text
type
amount
date
time
description
category no cadastro manual
```

Como os estados de erro ainda não estão totalmente formalizados no Design System, usar feedback simples e consistente sem inventar regra de negócio.

---

## TXC-15 — Implementar `createTransaction`

No service:

```ts
createTransaction(input)
```

Deve:

- gerar ID estável e único;
- associar ao perfil ativo;
- escrever na fonte centralizada da execução;
- preservar centavos;
- preservar IDs de relacionamentos;
- não persistir totais derivados.

---

## TXC-16 — Validar impacto financeiro

Transação efetiva:

```text
receita → aumenta saldo
despesa → reduz saldo
```

Programada:

```text
não altera saldo atual
```

Validar no service e na consistência com Dashboard.

---

## TXC-17 — Integrar comprovante sem OCR

Rastreabilidade:

```text
RF12 → US19
```

Escopo permitido:

- `Adicionar comprovante`;
- câmera ou seleção de imagem, se a infraestrutura atual suportar;
- armazenar URI;
- associar URI à transação salva.

Fora do escopo:

```text
OCR
extração automática de valor
data
estabelecimento
```

---

## TXC-18 — Integrar Recorrência / Lembrete

Rastreabilidade:

```text
RF20
RF64
→ US24
```

Fluxo esperado:

```text
formulário
→ configuração
→ voltar ao formulário com estado preservado
```

Não decidir se editar/cancelar recorrência afeta apenas ocorrências futuras; isso permanece pendente.

---

## TXC-19 — Integrar Reflexão antes da compra

Condição:

```text
type === expense
AND
essentiality === non-essential
```

Ao tentar concluir:

```text
→ fluxo de reflexão
```

Não inventar:

- duração padrão;
- possibilidade de alterar duração;
- lista definitiva de itens em reflexão.

Preservar estado do formulário ao entrar e voltar do fluxo.

---

## TXC-20 — Isolar destino após salvar

A documentação recomenda Detalhe, mas não torna obrigatório.

Implementar a navegação de forma isolada para poder trocar facilmente entre:

```text
Lista
ou
Detalhe
```

sem alterar a regra de criação.

---

## TXC-21 — Integrar com Lista e Detalhe

Depois de salvar:

- nova transação aparece na Lista;
- busca consegue encontrá-la;
- Detalhe abre pelo ID;
- campos opcionais não quebram a tela;
- categoria/subcategoria são resolvidas corretamente.

---

## TXC-22 — Integrar com Dashboard

Se efetiva e pertencente ao período:

- saldo atualiza;
- gasto do mês atualiza para despesa;
- recentes podem refletir a nova transação conforme ordenação atual.

Não alterar totais manualmente.

---

## TXC-23 — Voltar sem salvar

Voltar/cancelar:

- não cria transação;
- não altera saldo;
- não altera dataset.

Não inventar confirmação de descarte sem definição formal de UX.

---

## TXC-24 — Revisar Design System

Checklist:

- [ ] Manrope
- [ ] Tabler Icons outline
- [ ] `StyleSheet.create`
- [ ] tokens de `src/theme`
- [ ] sem biblioteca visual nova
- [ ] sem gradiente novo
- [ ] sem sombra pesada
- [ ] coerente com `03_transacao_cadastro.png`
- [ ] sem bottom nav própria na rota filha
- [ ] nomenclatura consistente com Lista/Detalhe

---

## TXC-25 — Testes técnicos

Validar pelo menos:

```text
criação de receita
criação de despesa
IDs únicos
centavos
perfil ativo
campos obrigatórios
categoria no cadastro manual
campos opcionais
imutabilidade
impacto no saldo
scheduled não altera saldo
consistência Lista/Detalhe/Dashboard
```

---

## TXC-26 — Typecheck e Android

Executar:

```bash
npx tsc --noEmit
```

Validar no Android:

```text
abrir pelo +
preencher receita
preencher despesa
salvar
voltar
teclado
scroll
inputs/seletores
lista atualizada
detalhe correto
Dashboard consistente
```

Erros globais preexistentes fora do bloco devem ser registrados separadamente.

---

# 8. Ordem recomendada

```text
TXC-01
↓
TXC-02
↓
TXC-03
↓
TXC-04
↓
TXC-05..13
↓
TXC-14
↓
TXC-15
↓
TXC-16
↓
TXC-21 / TXC-22
↓
TXC-17
↓
TXC-18
↓
TXC-19
↓
TXC-20
↓
TXC-23
↓
TXC-24
↓
TXC-25
↓
TXC-26
```

---

# 9. Critérios técnicos de verificação

O núcleo pode ser considerado implementado quando:

- [ ] `+` abre Nova Transação;
- [ ] Receita/Despesa funciona;
- [ ] valor vira centavos corretamente;
- [ ] descrição é obrigatória e usada como identificação;
- [ ] data/hora seguem o modelo;
- [ ] categoria manual é salva por ID;
- [ ] subcategoria respeita categoria;
- [ ] método de pagamento não é inventado;
- [ ] essencialidade suporta os estados documentados;
- [ ] tags/anotações permanecem opcionais;
- [ ] validação bloqueia cadastro inválido;
- [ ] `createTransaction` escreve na fonte centralizada;
- [ ] ID gerado é único;
- [ ] Lista mostra a nova transação;
- [ ] Detalhe abre a nova transação por ID;
- [ ] Dashboard permanece consistente;
- [ ] recibo só existe quando anexado;
- [ ] OCR não foi implementado indevidamente;
- [ ] recorrência não cria regra pendente;
- [ ] reflexão só ocorre na condição documentada;
- [ ] voltar sem salvar não altera dados;
- [ ] TypeScript sem erros novos;
- [ ] fluxo validado no Android.

---

# 10. Pendências explícitas

Não resolver implicitamente:

1. destino definitivo após salvar: Lista ou Detalhe;
2. duração padrão da reflexão;
3. possibilidade de alterar duração da reflexão;
4. lista definitiva de itens em reflexão;
5. editar/cancelar recorrência afetar apenas ocorrências futuras;
6. política completa de notificações;
7. efetivação temporal automática definitiva;
8. UX definitiva de descarte de formulário preenchido;
9. backend/persistência definitiva;
10. OCR de recibo.

---

# 11. Definition of Done

```text
US01 / RF01                  ⬜
RN-TRANS-01                  ⬜
RN-TRANS-02                  ⬜
Formulário visual            ⬜
Validação                    ⬜
createTransaction            ⬜
Lista integrada              ⬜
Detalhe integrado            ⬜
Dashboard consistente        ⬜
US19 / recibo básico         ⬜ / parcial conforme infraestrutura
US24 / recorrência           ⬜ / integração segura
US12 / reflexão              ⬜ / integração segura
Typecheck                    ⬜
Android                      ⬜
```

O núcleo do cadastro pode ser fechado mesmo que integrações secundárias permaneçam parciais por decisão pendente, desde que isso seja registrado explicitamente.

---

# 12. Registro ao finalizar

Registrar:

```text
TASKS CONCLUÍDAS
TASKS PARCIAIS/BLOQUEADAS
ARQUIVOS CRIADOS
ARQUIVOS MODIFICADOS
RF / US / RN ATENDIDOS
TESTES EXECUTADOS
RESULTADO DO TYPECHECK
VALIDAÇÃO ANDROID
PENDÊNCIAS
DIVERGÊNCIAS PNG x REQUISITOS/DADOS
```
