# Orca Finance — Design System Atualizado

> Documento de referência visual e de comportamento para o aplicativo mobile acadêmico Orca Finance. Esta versão consolida o Design System original com as decisões tomadas durante a evolução das telas da Sprint 1.
>
> Objetivo: funcionar como fonte única de verdade para criação, revisão e implementação das telas, preservando consistência visual, navegação, componentes e estados.

---

## 1. Princípios do produto

### 1.1 Personalidade visual
- Minimalista, limpa e objetiva.
- Hierarquia visual clara, priorizando dados financeiros e ações principais.
- Pouca decoração; cor comunica estado, função ou categoria.
- Sem sombras pesadas e sem gradientes nas telas de uso cotidiano.
- O nome “Orca” é representado pela identidade azul profunda, sem ilustrações literais do animal.

### 1.2 Princípios de UX
- Uma ação principal por contexto sempre que possível.
- Fluxos derivados devem preferir modal ou bottom sheet quando não justificarem nova página completa.
- Evitar duplicação de ações equivalentes na mesma tela.
- Estados destrutivos devem ser explícitos e exigir confirmação.
- Dados iguais devem ser apresentados com os mesmos valores em todas as telas quando pertencem ao mesmo cenário mockado.
- A interface não deve introduzir regra de negócio não definida nos requisitos.

---

## 2. Paleta de cores

### 2.1 Marca e ações
| Token | Hex | Uso |
|---|---|---|
| Brand / Azul profundo | `#0D3B66` | Identidade da marca, abertura e bloqueio/autenticação |
| Primary / CTA | `#2E76D6` | Botões principais, links, navegação ativa, ações interativas |
| Primary tint | `#EAF2FC` | Chips, fundos de ícones e estados selecionados neutros |

### 2.2 Semânticas
| Token | Hex | Uso |
|---|---|---|
| Positive | `#1E8F6F` | Receitas, progresso saudável, valores positivos |
| Positive tint | `#E1F5EE` | Fundos de ícones/estados positivos |
| Negative | `#D64545` | Despesas, erro, reversão, estados destrutivos, orçamento excedido |
| Warning | `#E8A33D` | Aproximação de limite, atenção e reflexão |

### 2.3 Neutros
| Token | Hex | Uso |
|---|---|---|
| Text Primary | `#10202E` | Títulos, valores, textos de maior hierarquia |
| Text Secondary | `#64748B` | Labels, legendas e apoio |
| Nav Inactive | `#94A3B8` | Ícones inativos da navegação |
| Border | `#E2E8F0` | Cards, inputs, divisores |
| Screen Background | `#F7F9FC` | Fundo padrão |
| Surface | `#FFFFFF` | Cards, inputs e modais |

### 2.4 Categorias
As cores de categoria são usadas principalmente para reconhecimento visual na tela de categorias e, de forma moderada, em ícones/listas.

- Alimentação: fundo `#FAEEDA`, ícone `#BA7517`
- Transporte: fundo `#E6F1FB`, ícone `#185FA5`
- Moradia: fundo `#E1F5EE`, ícone `#0F6E56`
- Lazer: fundo `#FBEAF0`, ícone `#993556`

Novas categorias devem seguir a lógica: fundo pastel + ícone mais escuro/saturado da mesma família de cor.

---

## 3. Tipografia

Família padrão: **Manrope**.

| Estilo | Peso | Tamanho de referência | Uso |
|---|---:|---:|---|
| Display | 700 | 26–32px | Saldo, valor principal, números de destaque |
| Título de tela/seção | 700 | 15–17px | Títulos de tela e seções |
| Label forte | 500 | 13–14px | Nome de item, label importante |
| Corpo | 400 | 12–14px | Descrições e textos comuns |
| Legenda | 400/500 | 10–11px | Datas, apoio e metadados |

Não misturar famílias tipográficas.

---

## 4. Iconografia

Biblioteca de referência: **Tabler Icons**, sempre outline.

| Contexto | Tamanho de referência |
|---|---:|
| Bottom navigation | 20px |
| Cabeçalho | 16–18px |
| Lista/card | 12–18px |
| Alertas/chevrons | 12–14px |

Evitar ícones preenchidos quando existir equivalente outline.

---

## 5. Layout base

### 5.1 Frame
- Referência de protótipo: `320×693px`.
- Referência de produção: `375×812px`.
- Padding lateral: aproximadamente `10px`.
- Padding superior: aproximadamente `14px`.
- Handle superior decorativo: `60×5px`, `#CBD5E1`, radius `4px`.

### 5.2 Espaçamento
- Entre seções/cards: `8–10px`.
- Entre itens de lista: `6px`.
- Padding interno de card: `10–14px`.

### 5.3 Raios
| Elemento | Radius |
|---|---:|
| Card principal | 12px |
| Card secundário/input | 10px |
| Bottom sheet/modal | 12–16px nos cantos superiores |
| Chips/toggles | 999px |
| Ícones em caixa | 6–8px |
| Avatar | 50% |

### 5.4 Bordas e sombras
- Borda padrão: `0.5px solid #E2E8F0`.
- Estados críticos podem usar `1.5px` na cor semântica.
- **Não usar box-shadow como padrão do sistema.**

---

## 6. Componentes padrão

### 6.1 Card
```text
background: #FFFFFF
border: 0.5px solid #E2E8F0
border-radius: 10–12px
padding: 10–14px
```

### 6.2 Botão primário
```text
background: #2E76D6
color: #FFFFFF
font-weight: 700
border-radius: 10px
height/padding confortável para toque
largura: preferencialmente 100% do container em formulários
```

### 6.3 Botão secundário
- Fundo branco ou transparente.
- Borda `#E2E8F0`.
- Texto `#2E76D6` ou `#10202E` conforme contexto.

### 6.4 Ação destrutiva
- Cor `#D64545`.
- Não competir visualmente com a ação principal.
- Reversão/exclusão deve exigir confirmação.

### 6.5 Input
```text
background: #FFFFFF
border: 0.5px solid #E2E8F0
border-radius: 10px
padding: ~10px
label: 10–11px / #64748B
valor: 13px / #10202E
```

### 6.6 Toggle / segmented control
- Container neutro.
- Opção ativa com cor semântica quando fizer sentido.
- Usar para escolhas mutuamente exclusivas curtas.
- Evitar exibir simultaneamente dropdown e segmented control para a mesma informação.

### 6.7 Barra de progresso
```text
track: #E2E8F0
height: 7–8px
border-radius: 4px
fill: cor semântica
```

### 6.8 Bottom sheet
Usar quando a ação é complementar e não precisa de página própria.

Padrão:
- overlay escuro/translúcido;
- surface branca;
- cantos superiores arredondados;
- handle cinza centralizado;
- título + conteúdo + CTA;
- sem bottom navigation dentro do sheet.

Casos atuais:
- Login
- Criar conta
- Filtros de transação
- Registrar aporte
- Exportar dados

### 6.9 Modal de confirmação
Usar para ação destrutiva ou irreversível.

Casos atuais:
- Reverter transação

Estrutura:
- título direto;
- explicação do impacto;
- resumo do objeto afetado;
- Cancelar;
- ação destrutiva destacada em vermelho.

---

## 7. Navegação principal — decisão consolidada

A bottom navigation oficial do Orca Finance é:

1. **Início**
2. **Transações**
3. **+** — Nova transação
4. **Planejamento**
5. **Relatórios**

### 7.1 Regras visuais
- 5 posições distribuídas horizontalmente.
- Item ativo: `#2E76D6`.
- Inativos: `#94A3B8`.
- Botão central `+`: círculo ~38px, fundo `#2E76D6`, ícone branco e elevação visual por recorte/borda, não por sombra.

### 7.2 Arquitetura de informação
**Início**
- Dashboard.

**Transações**
- Lista de transações.
- Busca e filtros.
- Detalhe.
- Categorias/subcategorias.

**+**
- Nova transação.

**Planejamento**
- Orçamento mensal.
- Metas.
- Limites e alertas.
- Gastos livres.
- Planejado x realizado.
- Recorrências, quando acessadas pelo contexto de transação/configuração.

**Relatórios**
- Gráficos por categoria/período.
- Exportação de dados.

Perfil e configurações **não ficam na bottom navigation**. O acesso ocorre pelo avatar/ação no topo.

---

## 8. Fluxos de autenticação e segurança

### 8.1 Conta / autenticação remota
Fluxo visual atual:
1. Boas-vindas.
2. Entrar — bottom sheet.
3. Criar conta — bottom sheet.

A identidade da conta é separada do bloqueio local do dispositivo.

### 8.2 Bloqueio local
PIN/biometria protegem o acesso local ao app e não substituem login/cadastro de conta.

Regra de UX recomendada para a tela de bloqueio:
- fluxo inicial apresenta biometria como método preferencial;
- botão alternativo: **“Usar PIN”**;
- se o usuário entrar no modo PIN, exibir teclado numérico e oferecer **“Usar biometria”** como alternativa;
- não mostrar teclado de PIN e botão “Usar PIN” ao mesmo tempo.

### 8.3 Configuração de segurança
Tela separada, acessada por Perfil/Configurações.

Permite:
- ativar/desativar biometria;
- configurar/alterar PIN;
- definir método preferencial de desbloqueio.

---

## 9. Padrões por domínio

### 9.1 Transações
Telas:
- Lista
- Cadastro
- Detalhe
- Filtros
- Confirmação de reversão

Informações principais:
- tipo;
- valor;
- data;
- hora;
- descrição;
- categoria/subcategoria;
- método de pagamento;
- tags/anotações quando aplicável;
- recibo quando aplicável;
- recorrência/lembrete quando configurados.

Regra visual importante:
- não criar campo “Título” separado sem decisão formal de requisito;
- usar descrição como identificação principal ou formalizar a mudança no backlog.

### 9.2 Categorias
- Categorias principais são tratadas como base predefinida.
- Usuário cria subcategorias personalizadas.
- A ação principal da tela é **“Nova subcategoria”**.

### 9.3 Orçamento / Planejamento
Abrange:
- orçamento mensal;
- limite diário;
- limites por categoria;
- alertas;
- gastos livres;
- planejado x realizado.

Threshold visual de orçamento:
- 0–69%: verde;
- 70–99%: âmbar;
- ≥100%: vermelho + alerta.

### 9.4 Metas
Telas:
- Lista de metas;
- Criar meta;
- Detalhe da meta;
- Registrar aporte.

Regras visuais e funcionais:
- cada meta possui valor-alvo e data-limite;
- progresso vem de aportes próprios no módulo de metas;
- aportes não são tratados automaticamente como despesas comuns;
- sugestão diária/semanal é calculada a partir do valor restante e do tempo restante;
- formulário vazio não deve apresentar uma sugestão monetária definitiva.

### 9.5 Reflexão antes da compra
- Aparece no contexto de despesa marcada como não essencial.
- Pode oferecer continuar, voltar ou enviar item para período de reflexão.
- Itens em reflexão não devem ser tratados visualmente como transações concluídas.

### 9.6 Recorrência
Tela de configuração associada à transação.

Contém:
- ativar recorrência;
- frequência;
- próxima ocorrência;
- data de término quando aplicável;
- lembrete de vencimento.

Regra visual:
- escolher **um único componente** para frequência, por exemplo segmented control ou dropdown.

### 9.7 Relatórios
- Seleção de período.
- Total de gastos.
- Gastos por categoria.
- Gráficos simples: donut/pizza e/ou barras.
- Exportação em CSV e formato compatível com Excel.

Não transformar Relatórios em duplicação do Dashboard.

---

## 10. Dados mockados e consistência visual

Durante a fase sem API real, as telas devem consumir um **dataset mock centralizado** por meio de uma abstração de acesso a dados.

Arquitetura recomendada:

```text
UI / Screen
  ↓
ViewModel / Controller
  ↓
Repository / Service
  ↓
Mock Data Source
```

Futuramente:

```text
UI / Screen
  ↓
ViewModel / Controller
  ↓
Repository / Service
  ↓
API Data Source
```

A UI não deve depender diretamente de um JSON específico.

### 10.1 Regra de consistência
Quando telas representam o mesmo usuário, perfil e período, valores devem ser derivados do mesmo conjunto mockado.

Exemplos que precisam ser padronizados:
- saldo atual;
- gastos do mês;
- valor da mesma transação;
- orçamento planejado;
- orçamento realizado;
- progresso de metas;
- totais de relatórios.

### 10.2 Dataset mock de referência inicial
Os valores abaixo são apenas uma base já adotada visualmente e devem ser mantidos ou alterados de forma centralizada:

- Saldo atual: `R$ 3.240,80`
- Gastos do mês: `R$ 1.180,00`
- Transação “Supermercado Extra”: `R$ 187,00`
- Meta “Viagem”: `R$ 2.250,00 / R$ 5.000,00` — `45%`

Quando o mock oficial for criado, ele passa a ser a fonte para todos os números exibidos.

---

## 11. Inventário visual atual

### 11.1 Telas principais numeradas
1. `01_dashboard_inicio.png`
2. `02_transacoes_lista.png`
3. `03_transacao_cadastro.png`
4. `04_transacao_detalhe.png`
5. `05_categoria_subcategorias.png`
6. `06_orcamento.png`
7. `07_planejamento_limites_alertas.png`
8. `08_planejamento_gastos_livres.png`
9. `09_planejamento_planejado_realizado.png`
10. `10_metas_lista.png`
11. `11_meta_criar.png`
12. `12_meta_detalhes.png`
13. `13_relatorios.png`
14. `14_auth_boas_vindas.png`
15. `15_auth_bloqueio_biometria.png`
16. `16_seguranca_config.png`
17. `17_reflexao_compra.png`
18. `18_recorrencia_configuracao.png`

### 11.2 Estados/modais complementares
- `tela-login.png`
- `tela_criar_conta.png`
- `tela_filtro_transacoes.png`
- `tela_reverter_transacao.png`
- `tela-aporte-meta.png`
- `tela_exportar_relatorio.png`

Esses estados devem reutilizar os componentes e a identidade das telas principais, não criar novos padrões.

---

## 12. Telas de referência prioritária

Quando uma nova tela for criada, usar as seguintes referências conforme o contexto:

- **Referência geral do app:** `01_dashboard_inicio.png`
- **Fluxo de transações:** `03_transacao_cadastro.png` e `04_transacao_detalhe.png`
- **Planejamento:** `06_orcamento.png`
- **Metas:** `10_metas_lista.png` e `12_meta_detalhes.png`
- **Relatórios:** `13_relatorios.png`
- **Entrada do app:** `14_auth_boas_vindas.png`
- **Bloqueio local:** `15_auth_bloqueio_biometria.png`

---

## 13. Estados ainda não formalizados visualmente

Devem ser definidos quando a implementação exigir:
- loading;
- empty state;
- erro de rede/API;
- erro de validação de formulário;
- sucesso após criação/edição;
- indisponibilidade de biometria;
- permissão negada de câmera/notificação;
- falha de exportação;
- meta vencida não concluída.

Esses estados não devem ser inventados como regra de negócio; apenas o comportamento visual pode ser padronizado quando necessário.

---

## 14. Pendências de produto / negócio

### 14.1 Gastos livres
Ainda precisa ser formalizado como uma transação entra na cota de gastos livres.

Possibilidades a decidir posteriormente:
- todo gasto sem categoria entra automaticamente;
- usuário marca explicitamente “contabilizar como gasto livre”.

Não assumir uma das opções sem decisão registrada.

### 14.2 Recorrência
Ainda precisa ser confirmado se editar/cancelar uma recorrência afeta somente ocorrências futuras.

### 14.3 Meta vencida
Quando uma meta chega à data-limite sem atingir o valor-alvo, o sistema deve informar o valor faltante; ainda precisa ser definido se ela:
- encerra;
- permite prorrogação;
- exige nova data-limite.

### 14.4 Reversão / auditoria
A reversão remove a transação dos registros financeiros ativos e preserva a rastreabilidade, sem criar transação inversa. Ainda precisa ser definido exatamente quais campos compõem o snapshot de auditoria.

### 14.5 Identidade de conta
Login/cadastro de conta foi incorporado ao fluxo visual e deve ser mantido separado de PIN/biometria local. A decisão arquitetural completa de identidade/backend deve ser registrada junto ao requisito/US correspondente.

---

## 15. Checklist para novas telas

Antes de aprovar qualquer nova tela, verificar:

1. Usa Manrope ou equivalente visual consistente?
2. Usa somente tokens de cor definidos?
3. Reutiliza componentes existentes?
4. Evita sombra e gradiente desnecessários?
5. Respeita a bottom navigation oficial quando aplicável?
6. A tela filha remove bottom nav quando o fluxo exige foco?
7. Os valores exibidos vêm do mesmo dataset mock?
8. A tela introduziu algum campo ou regra não existente?
9. A ação destrutiva possui confirmação?
10. Estados de erro/vazio foram tratados apenas se necessários?
11. O fluxo está consistente com a tela anterior e posterior?
12. O mesmo dado recebe o mesmo nome em todas as telas?

---

## 16. Regra para geração por IA

Ao usar IA para criar ou editar telas:

- Quando existir PNG aprovado, instruir: **“EDITE A IMAGEM ANEXADA. NÃO CRIE DO ZERO.”**
- Quando a tela for nova, usar a referência visual mais próxima da seção 12.
- Preservar layout, paleta, tipografia, espaçamento e estilo dos componentes.
- Não adicionar campos, ações ou regras não especificadas.
- Não gerar mockup inclinado, apresentação ou múltiplos celulares.
- Gerar uma única tela vertical completa.
- Não cortar topo, laterais ou rodapé.
- Não adicionar sombras ou gradientes fora das exceções já definidas.
- Estados derivados devem preferir bottom sheet/modal quando já definido neste documento.

---

## 17. Status desta versão

Este documento substitui o Design System anterior como referência atualizada do projeto para a Sprint 1.

Ele consolida:
- paleta e tipografia originais;
- componentes existentes;
- navegação inferior já definida;
- fluxo de autenticação e segurança;
- telas atuais da Sprint 1;
- padrões para metas, planejamento, relatórios, recorrência e reflexão;
- regra de dados mockados centralizados;
- pendências que não devem ser resolvidas automaticamente.

Sempre que uma nova decisão de UX ou regra de negócio alterar o comportamento das telas, atualizar este documento e os arquivos de requisitos/backlog correspondentes para manter a rastreabilidade.
