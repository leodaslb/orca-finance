# Orca Finance — Fluxo de Telas da Sprint 1

> Documento de navegação e rastreabilidade visual/funcional. Objetivo: deixar explícito **qual tela leva a qual**, quais ações abrem novas telas, quais ações abrem modal/bottom sheet e quais comportamentos ainda são decisão pendente.

---

## 1. Convenções do fluxo

- `→` abre uma nova tela.
- `↳` abre um modal/bottom sheet/estado sobre a tela atual.
- `↔` representa alternância de estado dentro da mesma tela.
- **Confirmado** = suportado pelos requisitos, backlog, regras ou decisão já tomada no projeto.
- **Decisão UX** = solução escolhida para navegação, sem estar explicitamente definida no requisito original.
- **Pendente** = não deve ser implementado como regra definitiva até decisão formal.

### Bottom navigation oficial

**Início | Transações | + | Planejamento | Relatórios**

- **Início** → Dashboard.
- **Transações** → Lista de transações.
- **+** → Nova transação.
- **Planejamento** → Hub/área de orçamento, metas e controles de planejamento.
- **Relatórios** → Relatórios gráficos e exportação.

**Perfil/Configurações** não fica na bottom navigation. O acesso recomendado é pelo avatar/atalho no topo.

---

# 2. Fluxo de entrada e autenticação

## 2.1 Boas-vindas

**Tela:** `14_auth_boas_vindas.png`

Fluxo:

- **Entrar** ↳ abre **Login** em bottom sheet.
- **Criar conta** ↳ abre **Cadastro de usuário** em bottom sheet.

### Login

**Estado complementar:** `tela-login.png`

- Preenchimento de credenciais → autenticar.
- Autenticação concluída → fluxo pós-login.

### Cadastro

**Estado complementar:** `tela_criar_conta.png`

- Preenchimento dos dados → criar conta.
- Conta criada → fluxo pós-login.

### Pós-login

**Regra existente de perfil:**
- se houver mais de um perfil financeiro → selecionar perfil;
- se houver somente um perfil → selecionar automaticamente.

**Observação:** a US de cadastro/login foi adicionada posteriormente e deve ser mantida sincronizada no backlog oficial.

---

## 2.2 Bloqueio local

**Tela:** `15_auth_bloqueio_biometria.png`

Este fluxo é diferente de login de conta.

Fluxo recomendado:

- app bloqueado → tentar **biometria**;
- falha/alternativa → **Usar PIN**;
- PIN ativo ↔ ação alternativa passa a ser **Usar biometria**;
- autenticação local válida → abrir área autenticada do app.

**US principal:** US37.

---

# 3. Início / Dashboard

## 3.1 Dashboard

**Tela:** `01_dashboard_inicio.png`

**US principal:** US15.

Entradas:
- bottom nav → **Início**.

Saídas principais:
- tocar em transação recente → **Detalhe da transação**;
- tocar em meta exibida → **Detalhe da meta**;
- avatar → **Perfil/Configurações** (decisão de navegação já adotada no projeto);
- bottom nav permite navegar para Transações, Nova Transação, Planejamento e Relatórios.

**Observação:** o Dashboard é tela-resumo. Ele não deve duplicar fluxos completos de configuração.

---

# 4. Transações

## 4.1 Lista de transações

**Tela:** `02_transacoes_lista.png`

**US principal:** US03.

Entradas:
- bottom nav → **Transações**.

Saídas:
- tocar em uma transação → **Detalhe da transação**;
- tocar no filtro ↳ **Filtros avançados**;
- busca textual atua sobre a própria lista;
- bottom nav `+` → **Nova transação**.

### Filtros avançados

**Estado complementar:** `tela_filtro_transacoes.png`

Fluxo:
- Lista de transações → filtro ↳ bottom sheet;
- **Aplicar filtros** → fecha bottom sheet e atualiza lista;
- **Limpar** → remove filtros;
- **Cancelar/fechar** → retorna sem alteração.

Filtros previstos na Sprint 1:
- data;
- categoria;
- valor;
- método de pagamento;
- descrição permanece na busca textual principal.

---

## 4.2 Nova transação

**Tela:** `03_transacao_cadastro.png`

**US principais:** US01, US02, US19, US24 e integração com US12.

Entrada principal:
- botão central `+` da bottom navigation.

Ações/saídas:
- **Salvar transação** → valida campos e registra;
- se for despesa marcada como não essencial → antes de concluir ↳ **Reflexão antes da compra**;
- **Adicionar comprovante** → câmera/seleção de imagem;
- ativar **recorrência** → **Configurar recorrência**;
- ativar **lembrete de vencimento** → mesma configuração de recorrência/vencimento ou seção associada.

Após salvar com sucesso:
- retorno recomendado → **Lista de transações** ou **Detalhe da transação**.

**Decisão UX recomendada:** retornar para **Detalhe da transação**, pois confirma visualmente o registro e oferece continuidade para editar/reverter. Essa decisão não é exigida pelo requisito.

---

## 4.3 Detalhe da transação

**Tela:** `04_transacao_detalhe.png`

Entradas:
- Lista de transações → item;
- Dashboard → transação recente;
- opcionalmente após criar/salvar uma transação.

Saídas:
- **Editar** → estado de edição;
- **Reverter transação** ↳ modal de confirmação;
- **Ver recibo** → visualização do comprovante, quando houver;
- voltar → tela anterior.

### Edição da transação

**Decisão UX recomendada:** não criar uma tela visual paralela.

Fluxo:
- Detalhe → **Editar** ↔ a própria tela passa para estado editável, OU reutiliza o mesmo formulário da tela de cadastro já preenchido;
- ação principal muda para **Salvar alterações**;
- cancelar → volta ao modo de leitura.

**Pendente de formalização:** escolher definitivamente entre:
1. edição inline no detalhe; ou
2. reutilização da tela/formulário de cadastro em modo edição.

Para implementação, a opção 2 costuma reduzir duplicação de componentes.

### Reversão

**Estado complementar:** `tela_reverter_transacao.png`

Fluxo:
- Detalhe → **Reverter transação** ↳ confirmação;
- cancelar → volta ao detalhe;
- confirmar → remove a transação dos registros financeiros ativos, registra auditoria e atualiza cálculos.

**Regra:** não criar transação inversa de estorno.

---

# 5. Categorias e subcategorias

## 5.1 Categorias

**Tela:** `05_categoria_subcategorias.png`

**US principal:** US05.

Entrada recomendada:
- Transações → acesso a categorias/organização;
- alternativamente Perfil/Configurações pode oferecer atalho administrativo.

Fluxo:
- categoria principal → expandir/recolher subcategorias;
- **+ Nova subcategoria** ↳ modal/bottom sheet de criação;
- subcategoria existente → editar/remover, se a implementação incluir essas ações.

**Regra:** categorias principais são predefinidas; usuário cria subcategorias personalizadas.

**Pendente:** tela/modal específico de criar/editar subcategoria ainda precisa de definição visual final.

---

# 6. Planejamento

## 6.1 Entrada do módulo Planejamento

A bottom navigation aponta para **Planejamento**.

A organização definida para este módulo é:

- Orçamento mensal;
- Metas;
- Limites e alertas;
- Gastos livres;
- Planejado x realizado.

A tela `06_orcamento.png` pode funcionar como tela principal/hub operacional do Planejamento, desde que contenha acessos claros para os itens acima.

---

## 6.2 Orçamento mensal

**Tela:** `06_orcamento.png`

**US principal:** US06.

Entradas:
- bottom nav → Planejamento → Orçamento;
- ou Planejamento abrir diretamente essa visão.

Saídas:
- **Limites e alertas** → `07_planejamento_limites_alertas.png`;
- **Gastos livres** → `08_planejamento_gastos_livres.png`;
- **Planejado x realizado** → `09_planejamento_planejado_realizado.png`;
- **Metas** → `10_metas_lista.png`.

---

## 6.3 Limites e alertas

**Tela:** `07_planejamento_limites_alertas.png`

**US principal:** US29.

Entrada:
- Planejamento/Orçamento → **Limites e alertas**.

Fluxo:
- configurar limite diário;
- configurar limites por categoria;
- selecionar canal Push/E-mail;
- **Salvar configurações** → retorna ao Planejamento/Orçamento.

**Regra confirmada:** limite diário reinicia diariamente.

**Pendente:** período padrão de certos limites por categoria ainda precisa de decisão formal.

---

## 6.4 Gastos livres

**Tela:** `08_planejamento_gastos_livres.png`

**US principal:** US45.

Entrada:
- Planejamento/Orçamento → **Gastos livres**.

Fluxo:
- visualizar cota mensal;
- visualizar utilizado/restante;
- alterar valor da cota;
- **Salvar cota** → retorna ao Planejamento.

**Pendente importante:** ainda precisa ser formalizado como uma transação passa a consumir a cota de gastos livres. Recomendação de UX: ação explícita no cadastro da despesa, evitando confundir “sem categoria” com “gasto livre intencional”.

---

## 6.5 Planejado x realizado

**Tela:** `09_planejamento_planejado_realizado.png`

**US principal:** US40.

Entrada:
- Planejamento/Orçamento → **Planejado x realizado**.

Fluxo:
- selecionar período;
- visualizar total planejado;
- visualizar realizado;
- visualizar diferença;
- visualizar contribuição por categoria;
- voltar → Planejamento/Orçamento.

Esta tela é de **análise do orçamento**, por isso permanece dentro de Planejamento e não como destino principal da aba Relatórios.

---

# 7. Metas

## 7.1 Lista de metas

**Tela:** `10_metas_lista.png`

**US principal:** US10.

Entrada:
- Planejamento → **Metas**.

Saídas:
- tocar em uma meta → **Detalhe da meta**;
- **+ Nova meta** → **Criar meta**.

---

## 7.2 Criar meta

**Tela:** `11_meta_criar.png`

Fluxo:
- Metas → **Nova meta**;
- preencher nome, valor-alvo, data-limite e frequência da sugestão;
- sistema calcula sugestão diária/semanal;
- **Criar meta** → recomendado retornar para **Detalhe da meta criada**.

**Regra:** sugestão é calculada com base no valor restante e tempo restante; não deve ser valor fixo de mock na implementação real.

---

## 7.3 Detalhe da meta

**Tela:** `12_meta_detalhes.png`

Entrada:
- Lista de metas → meta;
- opcionalmente após criação.

Saídas:
- **Registrar aporte** ↳ bottom sheet;
- **Editar meta** → modo/formulário de edição;
- voltar → lista de metas.

### Registrar aporte

**Estado complementar:** `tela-aporte-meta.png`

Fluxo:
- Detalhe da meta → Registrar aporte ↳ bottom sheet;
- informar valor/data;
- confirmar → atualiza progresso da meta e retorna ao detalhe.

**Regra:** aportes pertencem ao módulo de metas e não são automaticamente despesas/transações comuns.

---

# 8. Reflexão antes da compra

## 8.1 Reflexão

**Tela:** `17_reflexao_compra.png`

**US principal:** US12.

Entrada:
- Nova transação → salvar uma compra/despesa classificada como não essencial.

Saídas:
- **Finalizar mesmo assim** → registra a transação;
- **Colocar em reflexão** → envia item para lista/período de espera;
- **Voltar e revisar** → retorna ao cadastro da transação.

**Pendente:** duração padrão do período de reflexão e possibilidade de alteração pelo usuário.

**Pendente visual:** uma tela/lista de itens em reflexão ainda não foi finalizada.

---

# 9. Recorrência e lembretes

## 9.1 Configuração de recorrência

**Tela:** `18_recorrencia_configuracao.png`

**US principal:** US24.

Entrada:
- Nova/Editar transação → ativar recorrência ou lembrete.

Fluxo:
- configurar frequência;
- configurar próxima ocorrência;
- configurar término, quando aplicável;
- configurar lembrete/vencimento;
- **Salvar configuração** → retorna ao formulário da transação.

Depois, ao salvar a transação:
- ocorrência futura aparece como prevista;
- antes da data prevista não afeta saldo atual;
- na data configurada a ocorrência passa a compor o extrato/cálculos.

**Pendente:** definir se editar/cancelar recorrência altera somente ocorrências futuras.

---

# 10. Relatórios

## 10.1 Relatórios

**Tela:** `13_relatorios.png`

**US principais:** US13 e US14.

Entrada:
- bottom nav → **Relatórios**.

Fluxo:
- selecionar período;
- visualizar gráficos por categoria/período;
- **Exportar dados** ↳ bottom sheet de exportação.

### Exportação

**Estado complementar:** `tela_exportar_relatorio.png`

Fluxo:
- Relatórios → Exportar dados ↳ bottom sheet;
- selecionar CSV ou formato compatível com Excel;
- selecionar/confirmar período;
- **Exportar** → gerar arquivo;
- fechar → retorna a Relatórios.

---

# 11. Segurança e configurações

## 11.1 Configurações de segurança

**Tela:** `16_seguranca_config.png`

**US principal:** US37.

Entrada recomendada:
- avatar → Perfil/Configurações → Segurança.

Fluxo:
- ativar/desativar biometria;
- configurar/alterar PIN;
- escolher preferência de desbloqueio;
- salvar ou aplicar imediatamente, conforme implementação.

Saída:
- voltar → Perfil/Configurações.

**Importante:** esta tela configura proteção local. Não substitui login/autenticação da conta.

---

# 12. Mapa resumido de navegação

```text
ABERTURA
└── Boas-vindas
    ├── Entrar ↳ Login
    └── Criar conta ↳ Cadastro
        └── Pós-login
            ├── [múltiplos perfis] → Seleção de perfil
            └── [perfil único] → Início

BLOQUEIO LOCAL
└── Biometria ↔ PIN
    └── Início

BOTTOM NAV
├── Início
│   └── Dashboard
│       ├── Transação recente → Detalhe da transação
│       ├── Meta → Detalhe da meta
│       └── Avatar → Perfil/Configurações
│
├── Transações
│   └── Lista
│       ├── Item → Detalhe
│       │   ├── Editar → Estado/Formulário de edição
│       │   └── Reverter ↳ Confirmação de reversão
│       └── Filtro ↳ Filtros avançados
│
├── +
│   └── Nova transação
│       ├── Recorrência → Configurar recorrência
│       ├── Comprovante → Câmera/arquivo
│       └── Compra não essencial → Reflexão
│
├── Planejamento
│   ├── Orçamento
│   ├── Limites e alertas
│   ├── Gastos livres
│   ├── Planejado x realizado
│   └── Metas
│       ├── Nova meta
│       └── Detalhe da meta
│           └── Registrar aporte ↳ Bottom sheet
│
└── Relatórios
    └── Relatórios gráficos
        └── Exportar ↳ CSV / Excel

PERFIL / CONFIGURAÇÕES
└── Segurança
    ├── Biometria
    └── PIN
```

---

# 13. Decisões ainda pendentes que afetam navegação

1. **Edição de transação:** confirmar se será inline no detalhe ou reutilização do formulário de cadastro em modo edição.
2. **Após criar transação:** confirmar se retorna para lista ou abre detalhe; recomendação atual: detalhe.
3. **Após criar meta:** confirmar retorno; recomendação atual: detalhe da meta criada.
4. **Gastos livres:** definir explicitamente como uma despesa é marcada para consumir a cota.
5. **Itens em reflexão:** falta definir tela/lista de espera e acesso até ela.
6. **Perfil/Configurações:** precisa de tela-hub formal para concentrar Segurança e futuras configurações.
7. **Recorrência:** confirmar se editar/cancelar afeta apenas ocorrências futuras.
8. **Cadastro/login:** sincronizar a nova US com backlog oficial e critérios de aceitação.

---

# 14. Regra para desenvolvimento

Ao implementar uma tela, a navegação deve respeitar:

**Requisito → User Story → Tela de entrada → Ação → Tela/estado de destino → Regra de negócio → Teste de navegação.**

Exemplo:

```text
RF13
→ US03
→ Lista de transações
→ tocar em filtro
→ Bottom sheet de filtros
→ aplicar filtros
→ lista atualizada
→ teste: somente transações que atendem aos critérios permanecem visíveis
```

Esse documento deve ser atualizado sempre que uma decisão de navegação for alterada.
