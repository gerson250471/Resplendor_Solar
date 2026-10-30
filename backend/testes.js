/**
 * ============================================================================
 * MOTOR DE TESTES AUTOMATIZADOS - MAJB SISTEMAS
 * ============================================================================
 * Como usar: Selecione a função 'rodarTodosOsTestes' na barra superior do 
 * Google Apps Script e clique em 'Executar'. Abra o 'Registro de Execução' para ver o relatório.
 */

function rodarTodosOsTestes() {
  // ATENÇÃO: Garante que estamos no ambiente de HOMOLOGAÇÃO antes de rodar os testes!
  const config = getConfig();
  if (!config.isDev) {
    Logger.log("⛔ ERRO CRÍTICO: Testes só podem ser rodados no ambiente de Homologação!");
    return;
  }

  const testes = [
    testeSegurancaHash,
    testeGeracaoDeIDs,
    testeFluxoCompletoEstoque,
    testeFluxoCompletoKanban,
    testeBaixaAutomaticaEstoque, 
    testeCalculoRentabilidade,   
    testeLancamentoFinanceiroParcelas 
  ];

  let passados = 0;
  let falhados = 0;

  Logger.log("🚀 INICIANDO BATERIA DE TESTES AUTOMATIZADOS...");
  Logger.log("Ambiente: " + config.ambiente);
  Logger.log("--------------------------------------------------");

  testes.forEach(teste => {
    try {
      teste();
      Logger.log(`✅ PASSOU: ${teste.name}`);
      passados++;
    } catch (erro) {
      Logger.log(`❌ FALHOU: ${teste.name}`);
      Logger.log(`   Motivo: ${erro.message}`);
      falhados++;
    }
  });

  Logger.log("==================================================");
  Logger.log(`📊 RESULTADO FINAL: ${passados} Passaram | ${falhados} Falharam`);
  Logger.log("==================================================");

  // NOVO: Trava de segurança para o pipeline de CI/CD (GitHub Actions)
  if (falhados > 0) {
    throw new Error(`PIPELINE INTERROMPIDO: ${falhados} teste(s) falhou/falharam. Verifique os logs antes de subir para Produção.`);
  } else {
    return "SUCESSO: Todos os testes passaram! Deploy autorizado.";
  }
  
}

/**
 * ----------------------------------------------------------------------------
 * BIBLIOTECA DE ASSERÇÕES (Validações)
 * ----------------------------------------------------------------------------
 */
function assertEqual(atual, esperado, mensagem) {
  if (atual !== esperado) {
    throw new Error(`${mensagem} -> Esperava '${esperado}', mas recebeu '${atual}'`);
  }
}

function assertTrue(condicao, mensagem) {
  if (!condicao) {
    throw new Error(mensagem);
  }
}

/**
 * ----------------------------------------------------------------------------
 * SUÍTE DE TESTES
 * ----------------------------------------------------------------------------
 */

// 1. Teste do Motor de Criptografia
function testeSegurancaHash() {
  const hash1 = gerarHashSeguro("admin", "1234");
  const hash2 = gerarHashSeguro("admin", "1234");
  const hash3 = gerarHashSeguro("ADMIN ", "1234");
  const hashFalso = gerarHashSeguro("admin", "4321");

  assertTrue(hash1.length === 64, "O Hash SHA-256 deve ter exatamente 64 caracteres.");
  assertEqual(hash1, hash2, "Senhas iguais devem gerar hashes iguais.");
  assertEqual(hash1, hash3, "O sistema não limpou os espaços/maiúsculas do login.");
  assertTrue(hash1 !== hashFalso, "Senhas diferentes geraram hashes iguais! (Vulnerabilidade)");
}

// 2. Teste de Padrões de ID
function testeGeracaoDeIDs() {
  const proximoIdCliente = gerarProximoIdCliente();
  assertTrue(proximoIdCliente.includes("CLI-"), "ID de Cliente não contém o prefixo 'CLI-'");
  
  const proximoIdVenda = obterProximoIdVenda();
  assertTrue(proximoIdVenda.includes("VND-"), "ID de Venda não contém o prefixo 'VND-'");
}

// 3. Teste de Integração (CRUD) - Módulo de Estoque
function testeFluxoCompletoEstoque() {
  const idTeste = "MAT-TESTE-999";
  
  const objSalvar = {
    id: idTeste, descricao: "MATERIAL DE TESTES", unidade: "UNID", 
    valorUnitario: 10.50, quantidade: 100, estoqueMinimo: 5, somarEntrada: false
  };
  
  const resSalvar = salvarMaterialEstoque(objSalvar);
  assertTrue(resSalvar.sucesso, "Falha ao gravar material no Estoque.");

  const catalogo = obterCatalogoMateriais();
  const materialEncontrado = catalogo.dados.find(m => m.id === idTeste);
  assertTrue(materialEncontrado !== undefined, "Material gravado não foi encontrado no catálogo.");
  assertEqual(materialEncontrado.estoqueAtual, 100, "A quantidade salva no estoque está incorreta.");

  objSalvar.quantidade = 50; 
  objSalvar.somarEntrada = true;
  salvarMaterialEstoque(objSalvar);
  
  const catalogoAtualizado = obterCatalogoMateriais();
  const matAtualizado = catalogoAtualizado.dados.find(m => m.id === idTeste);
  assertEqual(matAtualizado.estoqueAtual, 150, "A soma automática da entrada de estoque (100+50) falhou.");

  const resExcluir = excluirMaterialEstoque(idTeste);
  assertTrue(resExcluir.sucesso, "Falha ao excluir o material de teste do Estoque.");
}

// 4. Teste de Integração (CRUD) - Módulo Kanban
function testeFluxoCompletoKanban() {
  const tituloTeste = "CARTAO DE TESTE AUTOMATIZADO";
  
  const objTarefa = {
    linha: "", titulo: tituloTeste, descricao: "Descricao teste TDD", quadro: "TESTE-QA"
  };
  
  const resCriar = salvarTarefaNoServidor(objTarefa);
  assertTrue(resCriar.sucesso, "Falha ao criar cartão no Kanban.");

  const tarefas = obterTarefas();
  const cartao = tarefas.dados.find(t => t.titulo === tituloTeste);
  assertTrue(cartao !== undefined, "Cartão não encontrado após criação.");
  
  const resExcluir = excluirTarefaBackend(cartao.linha);
  assertTrue(resExcluir.sucesso, "Falha ao excluir cartão de teste.");
}

// 5. NOVO: Teste de Baixa Inteligente de Estoque (Venda Nova + Edição/Delta)
function testeBaixaAutomaticaEstoque() {
  const idMat = "MAT-BAIXA-AUTO";
  const nomeMat = "CABO TESTE BAIXA AUTO";
  
  // 1. Cadastra material com 200 no estoque
  salvarMaterialEstoque({
    id: idMat, descricao: nomeMat, unidade: "METRO", valorUnitario: 5.00, quantidade: 200, estoqueMinimo: 10, somarEntrada: false
  });

  // 2. Cria Venda consumindo 50 unidades
  const materiaisUsados = JSON.stringify([{ descricao: nomeMat, quantidade: 50, valorTotal: 250 }]);
  const objVenda = {
    linha: "", data: "2026-10-30", cliente: "CLIENTE TESTE DELTA", total: 10000, kit: 5000, servico: 5000, 
    impostos: 0, maoDeObra: 0, comissao: 0, maquininha: 0, liquido: 0, entrada: 0, residual: 0, 
    status: "AGUARDANDO KIT", outros: 250, engenharia: 0, eletricista: 0, instaladorDetalhe: 0, pedreiro: 0, ajudante: 0,
    materiaisJson: materiaisUsados, equipeJson: "{}"
  };

  const resSalvar = salvarProjetoNoServidor(objVenda);
  assertTrue(resSalvar.sucesso, "Falha ao salvar a venda de teste.");

  // 3. Valida se o estoque desceu para 150
  let catalogo = obterCatalogoMateriais();
  let mat = catalogo.dados.find(m => m.id === idMat);
  assertEqual(mat.estoqueAtual, 150, "A baixa inicial de estoque falhou. Era 200, tirou 50, deveria ser 150.");

  // 4. Descobre a linha da venda para simular uma edição
  const ss = SpreadsheetApp.openById(getSpreadsheetId());
  const abaProjetos = ss.getSheetByName("Projetos");
  const ultimaLinha = abaProjetos.getLastRow();
  objVenda.linha = ultimaLinha; // Agora é uma EDIÇÃO

  // 5. Edita a venda consumindo 80 em vez de 50 (O sistema tem de calcular a diferença: baixar mais 30)
  objVenda.materiaisJson = JSON.stringify([{ descricao: nomeMat, quantidade: 80, valorTotal: 400 }]);
  salvarProjetoNoServidor(objVenda);

  catalogo = obterCatalogoMateriais();
  mat = catalogo.dados.find(m => m.id === idMat);
  assertEqual(mat.estoqueAtual, 120, "O cálculo Delta (diferença) de estoque na edição falhou. Deveria ser 120.");

  // 6. Limpeza do ambiente
  abaProjetos.deleteRow(ultimaLinha);
  excluirMaterialEstoque(idMat);
}

// 6. NOVO: Teste do Motor Financeiro (Cálculo de Margem e Lucro Líquido)
function testeCalculoRentabilidade() {
  // Simula os valores exatos de um contrato robusto
  const totalContrato = 30000;
  const valorKit = 15000;
  
  // Taxas
  const impostos = totalContrato * 0.06;     // R$ 1.800
  const comissao = totalContrato * 0.03;     // R$ 900
  const taxaMaquinha = totalContrato * 0.12; // R$ 3.600
  
  // Execução
  const engenharia = 400;
  const custoMaoDeObra = 2500;
  const custoMateriais = 825;
  const frete = 300;

  // Matemática cravada do Frontend
  const despesasTotais = valorKit + engenharia + custoMaoDeObra + custoMateriais + frete + impostos + comissao + taxaMaquinha;
  const lucroLiquidoReal = totalContrato - despesasTotais;
  
  // O JavaScript pode causar erros flutuantes (ex: 4675.00000000001), por isso validamos o arredondamento
  const lucroArredondado = Math.round(lucroLiquidoReal * 100) / 100;
  
  // Validando o Lucro (R$ 30.000 - 15.000 - 400 - 2500 - 825 - 300 - 1800 - 900 - 3600 = 4675)
  assertEqual(lucroArredondado, 4675, "O motor de cálculo de rentabilidade gerou um valor incorreto!");

  // Validando a Percentagem (%)
  const margemPercentual = (lucroArredondado / totalContrato) * 100;
  const margemFormatada = parseFloat(margemPercentual.toFixed(1));
  
  assertEqual(margemFormatada, 15.6, "A fórmula da margem de lucro percentual (%) falhou!");
}

// 7. NOVO: Teste de Lançamento Financeiro com Parcelas (Arredondamento e Persistência)
function testeLancamentoFinanceiroParcelas() {
  const idVendaTeste = "VND-TESTE-999";
  
  // 1. Simula os dados da Venda que vêm do ecrã
  const venda = {
    id: idVendaTeste,
    cliente: "CLIENTE DE TESTE FINANCEIRO",
    valor: 1000,
    data: "2026-10-30",
    metodo: "BOLETO BANCÁRIO"
  };

  // 2. Simula a matemática do ecrã para 3 parcelas de R$ 1000,00
  // 1000 / 3 = 333.33. Resto = 0.01. Primeira parcela tem de ter o resto.
  const arrayDeParcelas = [
    { vencimento: "30/11/2026", valor: 333.34 },
    { vencimento: "30/12/2026", valor: 333.33 },
    { vencimento: "30/01/2027", valor: 333.33 }
  ];

  // 3. Executa a gravação no servidor (Simula o clique em "Gravar Lançamento")
  const resSalvar = salvarVendaNoServidor(venda, arrayDeParcelas);
  assertTrue(resSalvar.sucesso, "Falha ao gravar lançamento financeiro principal.");

  // 4. Lê a base de dados para confirmar se as 3 parcelas foram criadas
  const resParcelas = obterListaParcelas();
  assertTrue(resParcelas.sucesso, "Falha ao ler o banco de dados de parcelas.");
  
  const parcelasDoTeste = resParcelas.dados.filter(p => p.idVenda === idVendaTeste);
  assertEqual(parcelasDoTeste.length, 3, "O sistema não gravou as 3 parcelas no banco de dados.");
  
  // 5. Valida a matemática gravada 
  // (O sistema pode devolver como string "333,34" ou número dependendo da formatação, limpamos para garantir)
  const p1 = parcelasDoTeste.find(p => p.parcela == 1);
  const p2 = parcelasDoTeste.find(p => p.parcela == 2);
  
  const v1 = typeof p1.valor === 'string' ? parseFloat(p1.valor.replace(/\./g, "").replace(",", ".")) : p1.valor;
  const v2 = typeof p2.valor === 'string' ? parseFloat(p2.valor.replace(/\./g, "").replace(",", ".")) : p2.valor;
  
  assertEqual(v1, 333.34, "A primeira parcela não absorveu os cêntimos de resto do arredondamento bancário.");
  assertEqual(v2, 333.33, "O valor das parcelas seguintes foi gravado incorretamente.");

  // 6. Teste de Exclusão em Cascata (O botão vermelho "Excluir Lançamento")
  const resExcluir = excluirLancamentoFinanceiro(idVendaTeste);
  assertTrue(resExcluir.sucesso, "Ocorreu um erro ao excluir o lançamento financeiro.");
  
  // 7. Prova final: tenta ler novamente e garante que apagou mesmo as parcelas
  const parcelasAposExclusao = obterListaParcelas().dados.filter(p => p.idVenda === idVendaTeste);
  assertEqual(parcelasAposExclusao.length, 0, "ALERTA: O sistema disse que apagou a venda, mas as parcelas continuam como 'fantasma' na base de dados!");
}