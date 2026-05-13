/**
 * ============================================================================
 * CONFIGURAÇÃO E MOTOR DO SISTEMA - MAJB SISTEMAS
 * ============================================================================
 */

function doGet(e) {
  const configAtual = getConfig();
  const template = HtmlService.createTemplateFromFile('index');

  // Passa as configurações para o HTML (Ativa a barra de homologação)
  template.config = configAtual;

  const output = template.evaluate();
  output.setTitle('Resplendor Solar - Gestão Centralizada')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return output;
}

function getConfig() {
  // 1. Identifica em qual Script o código está rodando agora
  const scriptIdAtual = ScriptApp.getScriptId();

  // 2. Seus IDs de Projeto (Scripts)
  const ID_SCRIPT_PRODUCAO = "1casqogw0NifsUgTKevWq-2MpcN7tOTCTh4NWsaTt1YQyrr9T-9k6rQna";
  const ID_SCRIPT_HOMOLOGACAO = "1YfngKUJegdWbga7NYJzWlVSsjzZmXzYliyQGlowGyH__t7kTDVis0R54";

  // 3. IDs das Planilhas (Banco de Dados)
  const ID_PLANILHA_PRODUCAO = "1GY1tukFd1mOwhbwyZTvEXApHdktL5SuzaOKsqHHEEr8";
  const ID_PLANILHA_HOMOLOGACAO = "1WWzsJIpwx8JE7yt6WKwDVt0OU3Mg_gQ3RY5ILH3yrlM";

  // 4. Variáveis padrão assumindo que seja Homologação
  let idPlanilha = ID_PLANILHA_HOMOLOGACAO;
  let textoAmbiente = "⚠️ HOMOLOGAÇÃO (TESTES)";
  let modoDev = true;

  // 5. Verificação EXPLÍCITA usando as duas variáveis (O VS Code vai acender a variável agora)
  if (scriptIdAtual === ID_SCRIPT_PRODUCAO) {
    idPlanilha = ID_PLANILHA_PRODUCAO;
    textoAmbiente = ""; // Fica vazio na produção
    modoDev = false;
  } else if (scriptIdAtual === ID_SCRIPT_HOMOLOGACAO) {
    idPlanilha = ID_PLANILHA_HOMOLOGACAO;
    textoAmbiente = "⚠️ HOMOLOGAÇÃO (TESTES)";
    modoDev = true;
  }

  return {
    spreadsheetId: idPlanilha,
    ambiente: textoAmbiente,
    isDev: modoDev
  };
}

// Função centralizada para buscar o ID correto da Planilha
function getSpreadsheetId() {
  return getConfig().spreadsheetId;
}

// Permite importar os arquivos HTML modulares (dashboard, clientes, etc)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ============================================================================
 * MÓDULO DE CLIENTES
 * ============================================================================
 */

function salvarClienteNoServidor(obj) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Clientes");

    // Insere os dados na próxima linha vazia
    aba.appendRow([obj.id, obj.nome, obj.celular, obj.cidade, obj.bairro, obj.endereco]);
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}

function carregarListaClientes() {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Clientes");
    const dados = aba.getDataRange().getValues();
    const lista = [];

    for (let i = 1; i < dados.length; i++) {
      lista.push({
        id: dados[i][0],
        nome: dados[i][1],
        celular: dados[i][2] || "",
        cidade: dados[i][3] || "",
        bairro: dados[i][4] || "",
        endereco: dados[i][5] || ""
      });
    }
    return { sucesso: true, dados: lista };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}

/**
 * ============================================================================
 * MÓDULO FINANCEIRO E DE VENDAS
 * ============================================================================
 */

function obterProximoIdVenda() {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaControle = ss.getSheetByName("ControleVersao");

    const ultimoCodigo = Number(abaControle.getRange("F3").getValue()) || 0;
    const anoRegistrado = Number(abaControle.getRange("F5").getValue()) || 0;
    const anoAtual = new Date().getFullYear();

    let proximoNumero;

    // Regra de Negócio: Se o ano mudou, reseta a contagem
    if (anoAtual !== anoRegistrado) {
      proximoNumero = 1;
    } else {
      proximoNumero = ultimoCodigo + 1;
    }

    // Formato: VND-2026-001 (Aplica zeros à esquerda)
    const numeroFormatado = proximoNumero.toString().padStart(3, '0');
    return "VND-" + anoAtual + "-" + numeroFormatado;
  } catch (e) {
    return "VND-ERRO";
  }
}

function salvarVendaNoServidor(venda, parcelas) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaVendas = ss.getSheetByName("Vendas");
    const abaParcelas = ss.getSheetByName("Parcelas");

    // 1. Grava o cabeçalho da Venda (Agora com as 7 colunas completas)
    // Estrutura: [ID, Cliente, Data, Valor Total, Método, Saldo Devedor (igual ao valor), Status]
    abaVendas.appendRow([venda.id, venda.cliente, venda.data, venda.valor, venda.metodo, venda.valor, "EM ABERTO"]);

    // 2. Grava todas as Parcelas de uma vez respeitando a nova coluna "Pago em"
    parcelas.forEach(p => {
      // Estrutura: [ID, N° Parcela, Vencimento, Valor, Pago em (vazio), Status]
      abaParcelas.appendRow([venda.id, venda.parcelas, p.vencimento, p.valor, "", "EM ABERTO"]);
    });

    // --- BLOCO DE CONTROLE DE VERSÃO ---
    const abaControle = ss.getSheetByName("ControleVersao");
    const ultimoCodigo = Number(abaControle.getRange("F3").getValue()) || 0;
    const anoRegistrado = Number(abaControle.getRange("F5").getValue()) || 0;
    const anoAtual = new Date().getFullYear();

    if (anoAtual !== anoRegistrado) {
      abaControle.getRange("F3").setValue(1);       // Reseta o contador
      abaControle.getRange("F5").setValue(anoAtual); // Atualiza o ano na F5
    } else {
      abaControle.getRange("F3").setValue(ultimoCodigo + 1); // Apenas incrementa
    }
    // ---------------------------------

    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}

function obterListaParcelas() {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaParcelas = ss.getSheetByName("Parcelas");
    // Vamos buscar os nomes à aba que tem o cabeçalho 'CLIENTES DEVEDORES' (aba Vendas)
    const abaVendas = ss.getSheetByName("Vendas");

    if (!abaParcelas || !abaVendas) {
      return { sucesso: false, mensagem: "Abas Parcelas ou Vendas não encontradas." };
    }

    const dadosParcelas = abaParcelas.getDataRange().getValues();
    const dadosVendas = abaVendas.getDataRange().getValues();

    // 1. DICIONÁRIO EXATO (PK -> NOME)
    const mapaClientes = {};
    for (let v = 1; v < dadosVendas.length; v++) {
      let idVendaPk = String(dadosVendas[v][0]).trim(); // Coluna A: ID Venda
      let nomeCliente = String(dadosVendas[v][1]).trim(); // Coluna B: CLIENTES DEVEDORES

      if (idVendaPk !== "") {
        mapaClientes[idVendaPk] = nomeCliente; // Ex: "2025-001" = "ADAUTO / CARIRE"
      }
    }

    const lista = [];
    for (let i = 1; i < dadosParcelas.length; i++) {
      const status = (dadosParcelas[i][5] || "").toString().toUpperCase().trim();

      if (status !== "" && status !== "PAGO") {
        let idVendaFk = String(dadosParcelas[i][0]).trim(); // Coluna A: ID Vend
        let numeroParcela = String(dadosParcelas[i][1]).trim(); // Coluna B: Número (1, 2, 3...)

        // Faz a correspondência exata! Se não achar, avisa o ID.
        let nomeFinal = mapaClientes[idVendaFk] ? mapaClientes[idVendaFk] : "Não encontrado (" + idVendaFk + ")";

        lista.push({
          linha: i + 1,
          idVenda: idVendaFk,
          cliente: nomeFinal,
          parcela: numeroParcela, // Guardamos o número da parcela para exibir no HTML!
          vencimento: new Date(dadosParcelas[i][2]).toLocaleDateString('pt-BR'),
          valor: (parseFloat(dadosParcelas[i][3]) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          status: status
        });
      }
    }
    return { sucesso: true, dados: lista };
  } catch (e) {
    return { sucesso: false, mensagem: "Erro no servidor: " + e.message };
  }
}

/**
 * ============================================================================
 * MÓDULO DASHBOARD
 * ============================================================================
 */

function getResumoFinanceiro() {
  try {
    atualizarStatusParcelas();

    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaParcelas = ss.getSheetByName("Parcelas");
    const abaVendas = ss.getSheetByName("Vendas");

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    let totalCents = 0, vendasMes = 0, aberto = 0, urgente = 0, atraso = 0;
    const pagasMes = new Array(12).fill(0);
    const receberMes = new Array(12).fill(0);

    // Contagem de Vendas do Mês Atual
    if (abaVendas) {
      const dv = abaVendas.getDataRange().getValues();
      for (let i = 1; i < dv.length; i++) {
        let d = new Date(dv[i][2]);
        if (!isNaN(d.getTime()) && d.getMonth() === mesAtual && d.getFullYear() === anoAtual) {
          vendasMes++;
        }
      }
    }

    // Soma das Parcelas
    if (abaParcelas) {
      const dp = abaParcelas.getDataRange().getValues();
      for (let i = 1; i < dp.length; i++) {
        const dataVencimento = new Date(dp[i][2]); // Coluna C (Vencimento)
        const val = parseFloat(dp[i][3]) || 0;     // Coluna D (Valor)
        const dataPagamentoRaw = dp[i][4];         // Coluna E (NOVO: Pago em - Índice 4)
        const status = (dp[i][5] || "").toString().toUpperCase().trim(); // Coluna F (Status - Índice 5)

        if (status === "PAGO") {
          // Usa a data do pagamento real, se não houver, cai para o vencimento
          let dataPagamento = new Date(dataPagamentoRaw);
          if (isNaN(dataPagamento.getTime())) dataPagamento = dataVencimento;

          if (!isNaN(dataPagamento.getTime()) && dataPagamento.getFullYear() === anoAtual) {
            pagasMes[dataPagamento.getMonth()] += Math.round(val * 100);
          }
        } else if (status !== "") {
          if (!isNaN(dataVencimento.getTime())) {
            totalCents += Math.round(val * 100);
            if (status === "EM ABERTO") aberto++;
            if (status === "URGENTE") urgente++;
            if (status === "EM ATRASO") atraso++;

            if (dataVencimento.getFullYear() === anoAtual) {
              receberMes[dataVencimento.getMonth()] += Math.round(val * 100);
            }
          }
        }
      }
    }

    // Configuração dos Gráficos
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const gPagas = [["Mês", "R$ Recebido", { role: 'style' }]];
    const gRec = [["Mês", "R$ A Receber", { role: 'style' }]];

    meses.forEach((m, i) => {
      gPagas.push([m, pagasMes[i] / 100, "color: #10b981"]);
      let cor = (i < mesAtual && receberMes[i] > 0) ? "#ef4444" : "#3b82f6";
      gRec.push([m, receberMes[i] / 100, `color: ${cor}`]);
    });

    return {
      sucesso: true,
      dados: {
        total: (totalCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        vendasMes: vendasMes.toString(),
        aberto: aberto,
        urgente: urgente,
        atraso: atraso
      },
      graficos: { pagas: gPagas, receber: gRec }
    };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}

function atualizarStatusParcelas() {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Parcelas");
    if (!aba) return;

    const dados = aba.getDataRange().getValues();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const novosStatus = [];

    for (let i = 1; i < dados.length; i++) {
      let st = (dados[i][5] || "").toString().toUpperCase().trim(); // Lendo da Coluna F (Índice 5)
      let d = new Date(dados[i][2]);
      let nSt = st;

      if (st !== "PAGO" && !isNaN(d.getTime())) {
        d.setHours(0, 0, 0, 0);
        const diff = Math.ceil((d.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
        if (diff < 0) nSt = "EM ATRASO";
        else if (diff <= 10) nSt = "URGENTE";
        else nSt = "EM ABERTO";
      }
      novosStatus.push([nSt]);
    }

    if (novosStatus.length > 0) {
      // O SEGREDO ESTÁ AQUI: Escrevendo na Coluna 6 (F), e não mais na 5!
      aba.getRange(2, 6, novosStatus.length, 1).setValues(novosStatus);
    }
  } catch (e) {
    console.error("Erro na atualização de status: " + e.message);
  }
}

/**
 * ============================================================================
 * SEGURANÇA E LOGIN
 * ============================================================================
 */

function gerarHashSeguro(usuario, senha) {
  // Combina usuário e senha como Salt
  const entrada = usuario.toLowerCase().trim() + senha;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, entrada);

  let hash = '';
  for (let i = 0; i < digest.length; i++) {
    let b = digest[i];
    if (b < 0) b += 256;
    let hex = b.toString(16);
    if (hex.length === 1) hex = '0' + hex;
    hash += hex;
  }
  return hash;
}

function validarAcesso(usuario, senha) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Usuarios");
    const dados = aba.getDataRange().getValues();
    const hashDigitado = gerarHashSeguro(usuario, senha);

    for (let i = 1; i < dados.length; i++) {
      if (usuario === dados[i][1] && hashDigitado === dados[i][2]) {
        return {
          sucesso: true,
          nome: dados[i][0],
          nivel: dados[i][3],
          precisaTrocar: (dados[i][4] || "").toString().toUpperCase().trim() === "SIM"
        };
      }
    }
    return { sucesso: false, mensagem: "Usuário ou senha incorretos. Acesso negado." };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}

function atualizarSenhaDefinitiva(usuario, novaSenha) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Usuarios");
    const dados = aba.getDataRange().getValues();

    for (let i = 1; i < dados.length; i++) {
      if (usuario === dados[i][1]) {
        aba.getRange(i + 1, 3).setValue(gerarHashSeguro(usuario, novaSenha));
        aba.getRange(i + 1, 5).setValue("NAO");
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * ============================================================================
 * 7. OPERAÇÃO DE BAIXA DE PARCELAS (COM BAIXA PARCIAL)
 * ============================================================================
 */

function registrarBaixaParcela(linhaPlanilha, valorPago) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaParcelas = ss.getSheetByName("Parcelas");

    if (!abaParcelas) {
      return { sucesso: false, mensagem: "Aba Parcelas não encontrada." };
    }

    // Gera a data de hoje para registrar o momento exato do pagamento
    const dataHoje = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy");

    // Lê os dados essenciais da linha (ID, Número/Cliente e Valor Total)
    const dadosLinha = abaParcelas.getRange(linhaPlanilha, 1, 1, 4).getValues()[0];
    const idVenda = dadosLinha[0];      // Coluna A
    const infoSecundaria = dadosLinha[1]; // Coluna B
    const valorTotal = parseFloat(dadosLinha[3]) || 0; // Coluna D

    // =========================================================================
    // NOVO BLOCO RESTAURADO: ATUALIZA O SALDO DEVEDOR NA ABA DE VENDAS
    // =========================================================================
    const abaVendas = ss.getSheetByName("Vendas");
    if (abaVendas) {
      const dadosVendas = abaVendas.getDataRange().getValues();
      const idProcurado = String(idVenda).trim().toUpperCase(); // Blindagem contra espaços

      for (let v = 1; v < dadosVendas.length; v++) {
        const idNaPlanilha = String(dadosVendas[v][0]).trim().toUpperCase();
        
        if (idNaPlanilha === idProcurado) {
          
          let saldoAtual = parseFloat(dadosVendas[v][5]) || 0;
          let novoSaldo = saldoAtual - valorPago;

          if (novoSaldo < 0.01) novoSaldo = 0;

          // Atualiza o Saldo Devedor
          abaVendas.getRange(v + 1, 6).setValue(novoSaldo);

          // Conclui se estiver pago
          if (novoSaldo === 0) {
            abaVendas.getRange(v + 1, 7).setValue("CONCLUÍDO");
          }
          break; 
        }
      }
    }
    // =========================================================================

    // VERIFICA SE É UMA BAIXA PARCIAL
    if (valorPago < valorTotal) {
      abaParcelas.getRange(linhaPlanilha, 4).setValue(valorPago);
      abaParcelas.getRange(linhaPlanilha, 5).setValue(dataHoje);
      abaParcelas.getRange(linhaPlanilha, 6).setValue("PAGO");

      const valorRestante = valorTotal - valorPago;

      let novaData = new Date();
      novaData.setMonth(novaData.getMonth() + 1);

      abaParcelas.appendRow([idVenda, infoSecundaria, novaData, valorRestante, "", "EM ABERTO"]);

      return { sucesso: true, parcial: true };

    } else {
      abaParcelas.getRange(linhaPlanilha, 5).setValue(dataHoje);
      abaParcelas.getRange(linhaPlanilha, 6).setValue("PAGO");
      
      return { sucesso: true, parcial: false };
    }

  } catch (e) {
    return { sucesso: false, mensagem: "Erro ao dar baixa: " + e.message };
  }
}

/**
 * GRAVAR OU ATUALIZAR CLIENTE
 */
function salvarCliente(obj) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaClientes = ss.getSheetByName("Clientes");
    const dados = abaClientes.getDataRange().getValues();
    let linhaDestino = -1;

    // 1. Verifica se o cliente já existe (para Atualizar)
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0].toString() === obj.id.toString()) {
        linhaDestino = i + 1;
        break;
      }
    }

    const novaLinha = [obj.id, obj.nome, obj.celular, obj.cidade, obj.bairro, obj.endereco];

    if (linhaDestino !== -1) {
      // 2A. ATUALIZAR CLIENTE EXISTENTE
      abaClientes.getRange(linhaDestino, 1, 1, 6).setValues([novaLinha]);
      return { sucesso: true, mensagem: "Cliente atualizado com sucesso!" };

    } else {
      // 2B. CADASTRAR NOVO CLIENTE
      abaClientes.appendRow(novaLinha);

      // =======================================================
      // 3. ATUALIZAR A ABA 'ControleVersao' COM O NOVO CÓDIGO
      // =======================================================
      const abaControle = ss.getSheetByName("ControleVersao");

      // Extrai apenas os números do ID que chegou do formulário.
      // Exemplo: Transforma a string "CLI-195" no número inteiro 195
      const numeroSalvo = parseInt(obj.id.replace(/\D/g, ''), 10);

      // Se a extração for um número válido, atualiza a célula F1
      if (!isNaN(numeroSalvo)) {
        abaControle.getRange("F1").setValue(numeroSalvo);
      }
      // =======================================================

      return { sucesso: true, mensagem: "Novo cliente cadastrado!" };
    }
  } catch (e) {
    return { sucesso: false, mensagem: "Erro: " + e.message };
  }
}

/**
 * GERA O PRÓXIMO ID DE CLIENTE (PADRÃO CLI-X)
 */

function gerarProximoIdCliente() {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const abaControle = ss.getSheetByName("ControleVersao");

    // Lê a célula F1
    const ultimoCodigo = Number(abaControle.getRange("F1").getValue()) || 0;
    const proximoNumero = ultimoCodigo + 1;

    return "CLI-" + proximoNumero;
  } catch (e) {
    return "CLI-ERRO";
  }
}

function excluirCliente(idCliente) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Clientes");
    const dados = aba.getDataRange().getValues();

    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0].toString() === idCliente.toString()) {
        aba.deleteRow(i + 1);
        return { sucesso: true, mensagem: "Cliente removido com sucesso!" };
      }
    }
    return { sucesso: false, mensagem: "Cliente não encontrado." };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}

/**
 * EXCLUIR LANÇAMENTO FINANCEIRO (VENDA E PARCELAS)
 */
function excluirLancamentoFinanceiro(idVenda) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    let vendasExcluidas = 0;
    let parcelasExcluidas = 0;

    // TRAVA DE SEGURANÇA: Se não achou a Venda, aborta tudo e avisa o usuário
    if (vendasExcluidas === 0) {
      return { 
        sucesso: false, 
        mensagem: "ERRO: O sistema não encontrou a venda " + idVenda + " na aba Vendas." 
      };
    }
    // 1. LIMPEZA NA ABA PARCELAS (As "filhas" da venda)
    const abaParcelas = ss.getSheetByName("Parcelas");
    if (abaParcelas) {
      const dadosParcelas = abaParcelas.getDataRange().getValues();
      const idProcurado = String(idVenda).trim().toUpperCase();

      // Laço REVERSO para deletar múltiplas linhas sem falhar o índice
      for (let i = dadosParcelas.length - 1; i >= 1; i--) {
        const idNaPlanilha = String(dadosParcelas[i][0]).trim().toUpperCase();
        
        if (idNaPlanilha === idProcurado) {
          abaParcelas.deleteRow(i + 1);
          parcelasExcluidas++;
        }
      }
    }
    
    // 2. LIMPEZA NA ABA VENDAS (Aba principal)
    const abaVendas = ss.getSheetByName("Vendas");
    if (abaVendas) {
      const dadosVendas = abaVendas.getDataRange().getValues();
      const idProcurado = String(idVenda).trim().toUpperCase();

      for (let i = 1; i < dadosVendas.length; i++) {
        const idNaPlanilha = String(dadosVendas[i][0]).trim().toUpperCase();
        
        if (idNaPlanilha === idProcurado) {
          abaVendas.deleteRow(i + 1);
          vendasExcluidas++;
          break;
        }
      }
    }

    return {
      sucesso: true,
      mensagem: `Venda ${idVenda} e ${parcelasExcluidas} parcela(s) apagadas com sucesso!`
    };

  } catch (e) {
    return { sucesso: false, mensagem: "Erro crítico ao excluir: " + e.message };
  }
}

/**
 * Busca todos os usuários (exceto a senha por segurança)
 */
function obterUsuarios() {
  const ss = SpreadsheetApp.openById(getSpreadsheetId()); // <-- A Mágica da sua arquitetura aqui
  const sheet = ss.getSheetByName("Usuarios");
  const dados = sheet.getDataRange().getValues();
  dados.shift(); // Remove cabeçalho

  return dados.map((r, index) => ({
    linha: index + 2,
    nome: r[0],
    login: r[1],
    nivel: r[3],
    trocar: r[4]
  }));
}

/**
 * Salva ou Atualiza um usuário
 */
function gerenciarUsuario(obj) {
  const ss = SpreadsheetApp.openById(getSpreadsheetId()); // <-- E aqui também!
  const sheet = ss.getSheetByName("Usuarios");
  const dados = sheet.getDataRange().getValues();

  // Hash simples para exemplo
  const senhaFinal = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, obj.senha));

  // Verifica se o login já existe para decidir se é NOVO ou EDIÇÃO
  let linhaExistente = -1;
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][1] === obj.login) {
      linhaExistente = i + 1;
      break;
    }
  }

  if (linhaExistente !== -1) {
    // Atualiza os dados básicos
    sheet.getRange(linhaExistente, 1).setValue(obj.nome);
    sheet.getRange(linhaExistente, 4).setValue(obj.nivel);
    sheet.getRange(linhaExistente, 5).setValue(obj.trocar);

    // Se digitou uma senha nova, atualiza o Hash também. Se deixou em branco, mantém a antiga.
    if (obj.senha && obj.senha.trim() !== "") {
      sheet.getRange(linhaExistente, 3).setValue(senhaFinal);
    }
  } else {
    // Novo
    sheet.appendRow([obj.nome, obj.login, senhaFinal, obj.nivel, obj.trocar]);
  }

  return { sucesso: true, mensagem: "Usuário processado com sucesso!" };
}

function obterListaProjetos() {
  const ss = SpreadsheetApp.openById(getSpreadsheetId());
  const aba = ss.getSheetByName("Projetos");
  const dados = aba.getDataRange().getValues();
  dados.shift(); // Remove cabeçalho

  return dados.map((r, index) => {
    // Tratamento de data para o padrão do input type="date"
    let dataISO = "";
    let dataBR = "---";
    if (r[0]) {
      let d = new Date(r[0]);
      if (!isNaN(d.getTime())) {
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // Corrige fuso horário
        dataBR = d.toLocaleDateString('pt-BR');
        dataISO = d.toISOString().split('T')[0];
      }
    }

    return {
      linha: index + 2, // Guarda o número da linha da planilha
      dataBR: dataBR,
      dataISO: dataISO,
      cliente: r[1] || "",
      total: parseFloat(r[2]) || 0,
      kit: parseFloat(r[3]) || 0,
      servico: parseFloat(r[4]) || 0,
      impostos: parseFloat(r[5]) || 0,
      outros: parseFloat(r[6]) || 0,
      comissao: parseFloat(r[7]) || 0,
      maquininha: parseFloat(r[8]) || 0,
      liquido: r[9] || 0,
      entrada: parseFloat(r[10]) || 0,
      residual: r[11] || 0,
      status: r[12] || "AGUARDANDO KIT"
    };
  });
}

function salvarProjetoNoServidor(obj) {
  try {
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const aba = ss.getSheetByName("Projetos");

    const arrayDados = [
      obj.data, obj.cliente, obj.total, obj.kit, obj.servico,
      obj.impostos, obj.outros, obj.comissao, obj.maquininha,
      obj.liquido, obj.entrada, obj.residual, obj.status
    ];

    if (obj.linha && obj.linha !== "") {
      // É EDIÇÃO: Atualiza a linha específica
      aba.getRange(obj.linha, 1, 1, arrayDados.length).setValues([arrayDados]);
    } else {
      // É NOVO: Cria uma linha no final
      aba.appendRow(arrayDados);
    }

    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
}
// Lançar no Homolog