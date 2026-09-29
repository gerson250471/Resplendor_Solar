Cronograma de implementação — Resplendor Solar

Base: reunião com Renan de 03/09/2026, com aproximadamente 37 minutos. Planejamento preparado em 23/09/2026, considerando a informação de que as atividades ainda vão começar.

## Premissas

- Proposta inicial de **20 dias úteis**, considerando uma pessoa responsável pela implementação no sistema existente. É uma estimativa de planejamento, ainda sem avaliação do código e da disponibilidade diária.
- **D1 é o primeiro dia efetivo de trabalho.** Os intervalos abaixo são dias úteis contados a partir dele.
- Renan fornece taxas, arquivos e informações solicitadas e valida as entregas. Atrasos nessas respostas podem deslocar as etapas dependentes.
- Os prazos abaixo são sugeridos agora; não são prazos aprovados pelo cliente na reunião.

## Cronograma principal

| Período | Atividade sob sua responsabilidade | Entrega e critério de conclusão | Dependência |
|---|---|---|---|
| D1–D2 | Confirmar o escopo e atualizar as taxas do cartão | Parcelamentos de 6, 12, 18 e 21 vezes disponíveis nos parâmetros e nos fluxos aplicáveis de venda/simulação; conferir um exemplo de cada opção | Tabela atualizada das taxas enviada por Renan |
| D3–D4 | Revisar o simulador de precificação | Conferir soma de custos, margem, frete, mão de obra, custos diretos e tratamento do ISS; comparar exemplos com a referência de Renan; manter estimativas pré-venda separadas dos custos reais da obra | Referência de cálculo de Renan e confirmação dos parâmetros fiscais com o contador |
| D5 | Apresentar e validar o protótipo dos custos por projeto | Renan aprova a organização dos campos, o fluxo de preenchimento no celular e quem pode editar preços ou informar quantidades | Disponibilidade de Renan para validação |
| D6–D8 | Implementar o registro dos custos reais | Registrar custo do kit, profissionais/diárias, materiais/acessórios e serviço de engenharia vinculados ao cliente/projeto; conferir o resultado de uma obra de exemplo | Protótipo aprovado e dados de exemplo |
| D9–D12 | Implementar o estoque virtual e sua ligação com as obras | Cadastro de itens e variações, itens ativos/inativos, compras/entradas, quantidades consumidas/baixas, preço unitário e aviso de reposição; testar uma entrada e um consumo vinculado a uma obra | Lista inicial de materiais, quantidades, preços e limites mínimos |
| D13–D14 | Ajustar o relatório financeiro por cliente e período | Exibir valor do contrato, custo do kit, outros custos agrupados e lucro líquido; mostrar o total líquido do período e conferir com os lançamentos detalhados | Custos reais e regras de cálculo funcionando |
| D15–D16 | Disponibilizar anexos de orçamento no Kanban | Anexar e consultar PDFs das tabelas de orçamento; identificar a referência temporal dos arquivos para comparar preços anteriores | PDFs de exemplo e confirmação de onde os anexos ficarão no Kanban |
| D17–D18 | Testar o fluxo completo com Renan | Validar no computador e no celular: simulação, venda, custos, consumo de estoque, permissões, relatório e consulta aos PDFs | Uma obra de exemplo e participação de Renan/usuário operacional |
| D19–D20 | Corrigir ajustes finais e entregar | Resolver os problemas encontrados, obter aceite de Renan e orientar o uso do sistema; combinar o início dos registros e a conferência do estoque | Validação final e ambiente de entrega disponível |

## Checklist do escopo extraído da reunião

### 1. Custos reais por obra — aproximadamente 00:00–04:15

- [ ] Detalhar profissionais envolvidos e o valor de suas diárias/serviços, contemplando instalador, eletricista e pedreiro conforme o cadastro definido.
- [ ] Registrar serviço de engenharia/projeto separadamente. R$ 400 foi citado como referência média; confirmar o valor padrão e permitir o ajuste necessário.
- [ ] Registrar materiais e acessórios utilizados na obra.
- [ ] Manter o custo do kit solar (placas e inversores) identificável separadamente.
- [ ] Permitir o preenchimento pelo celular durante a instalação.
- [ ] Apurar o resultado com os custos efetivamente registrados.

### 2. Estoque virtual — aproximadamente 04:15–07:40

- [ ] Registrar compras e entradas de materiais.
- [ ] Cadastrar novos itens e variações; permitir ativar/desativar itens.
- [ ] Relacionar o consumo/baixa de materiais à obra correspondente.
- [ ] Restringir a edição dos valores a Renan/perfil autorizado, deixando o usuário operacional informar quantidades.
- [ ] Configurar o nível mínimo por item e avisar quando houver necessidade de reposição.
- [ ] Combinar a conferência periódica entre estoque físico e sistema; na reunião foi sugerida uma conferência semanal.

**Ponto a definir antes da implementação:** como a alteração do preço de uma nova compra afeta o custo registrado nas obras. Recomendação técnica: preservar o custo histórico das obras já registradas e combinar a regra usada nas novas baixas.

### 3. Relatório de resultados — aproximadamente 07:40–11:10 e 34:40–35:40

- [ ] Mostrar o valor do contrato.
- [ ] Mostrar o custo do kit solar.
- [ ] Agrupar os demais custos no resumo, incluindo mão de obra, engenharia, acessórios e comissão, mantendo o detalhamento no registro da venda/projeto.
- [ ] Mostrar o lucro líquido de cada cliente e o total do período.
- [ ] Conferir a inclusão de taxas e demais despesas aplicáveis, evitando duplicidades.

### 4. Taxas do cartão e simulador — aproximadamente 11:10–13:45, 15:05–24:15 e 30:45–34:45

- [ ] Incluir as opções de 6, 12, 18 e 21 parcelas e suas taxas.
- [ ] Refletir as opções e taxas nos locais aplicáveis do sistema.
- [ ] Conferir a fórmula da margem e a composição do preço com exemplos concretos de Renan.
- [ ] Revisar o comportamento do campo de ISS/dedução discutido na reunião; confirmar a regra fiscal com o contador antes da configuração definitiva.
- [ ] Manter a precificação estimada disponível antes de conhecer os custos exatos da instalação.

### 5. PDFs no Kanban — aproximadamente 35:45–36:30

- [ ] Receber os PDFs das tabelas de orçamento citadas por Renan.
- [ ] Definir o local de anexação no Kanban.
- [ ] Permitir anexar e consultar os documentos, identificando os períodos para consulta histórica dos preços.

O pedido confirmado no encerramento é de **anexação dos PDFs existentes**. Geração automática de novos PDFs não foi incluída como requisito confirmado.

## O que solicitar a Renan no início

1. Tabela das taxas atuais para 6, 12, 18 e 21 parcelas, incluindo condições de recebimento que afetem o cálculo.
2. Lista inicial de materiais/variações, preços, estoque disponível e limites mínimos desejados.
3. Profissionais, diárias e referência de custo de engenharia.
4. Uma obra com valores completos para conferir os cálculos e o relatório.
5. PDFs das tabelas de orçamento e referência usada para conferir a precificação.
6. Confirmação, com o contador, das regras e parâmetros fiscais aplicáveis ao sistema.
7. Definição de quem registrará quantidades, quem editará valores e quem fará a conferência do estoque.

## Segunda etapa: estimativas com base no histórico

**Quando:** após cerca de dois meses de registros consistentes das obras — referência discutida na reunião, aproximadamente entre 18:00–18:40 e 29:10–30:45.

- Calcular médias de custo por placa e de deslocamento/região/bairro.
- Confirmar desde a primeira etapa que os dados necessários estão sendo registrados.
- Comparar as médias com os custos reais e avaliar sua utilização no simulador.
- Reestimar o trabalho dessa etapa quando houver volume e qualidade de dados suficientes.

## Prazos mencionados na gravação

A gravação contém uma previsão de ajuste do cartão para uma terça-feira e uma discussão sobre apresentar um protótipo na sexta-feira da semana seguinte. São referências da reunião de 03/09/2026 e precisam ser realinhadas, pois você informou que ainda vai iniciar. O cronograma acima é uma nova proposta e não presume que aqueles compromissos foram cumpridos.

## Observação sobre a fonte

O planejamento foi elaborado a partir de transcrição automática da gravação e conferência de telas do vídeo. Os trechos usados para esclarecer o pedido de PDFs e os prazos foram reprocessados. Pontos sem definição suficiente, como regras fiscais, cálculo do custo de estoque e posição dos anexos no Kanban, foram mantidos como itens de validação.
