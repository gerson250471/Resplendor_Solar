# ☀️ MAJB CRM - Resplendor Solar (Gestão Centralizada)

Um sistema de gestão de relacionamento com clientes (CRM) e controle financeiro construído para otimizar operações comerciais. Desenvolvido com uma arquitetura _Serverless_ utilizando o ecossistema Google Workspace.

## 🚀 Tecnologias Utilizadas

- **Front-end:** HTML5, JavaScript (ES6+), Tailwind CSS (Design System), Lucide Icons.
- **Back-end:** Google Apps Script (GAS) operando como API/Servidor.
- **Banco de Dados:** Google Sheets (Relacional com cruzamento de Chaves Primárias e Estrangeiras).
- **Hospedagem (White Label):** Hostinger (Iframe Masking para ocultação de banners e domínio customizado).
- **Controle de Versão:** Git e GitHub, integrado com `clasp` (Command Line Apps Script Projects).

## ⚙️ Arquitetura e Ambientes

O sistema possui inteligência de roteamento dinâmico que detecta a URL de acesso e direciona o usuário para o banco de dados correto:

- ⚠️ **Homologação (Testes):** Ambiente para validação de novas _features_ e garantia de qualidade (QA).
- ✅ **Produção:** Ambiente final para operação diária do cliente.

## ✨ Principais Funcionalidades

### 🔐 Segurança e Autenticação

- Sistema de login customizado.
- Criptografia de senhas utilizando _hashing_ SHA-256.
- Regra de negócio para troca obrigatória de senha no primeiro acesso.

### 👥 Módulo de Clientes (CRUD)

- Interface _Single Page Application_ (SPA) para Criar, Ler, Atualizar e Deletar cadastros sem recarregar a página.
- Geração automática de ID do Cliente (Padrão: `CLI-X`).
- Modais customizados em Tailwind CSS para transições de estado (Edição/Exclusão) com proteção contra erros de digitação.

### 💰 Módulo Financeiro e Lançamentos

- Lançamento de vendas com geração automática de chaves (`VND-X`).
- Cálculo e desdobramento automático de parcelas com arredondamento preciso de centavos.
- Cruzamento relacional em tempo real entre a tabela de Vendas e a tabela de Parcelas para exibir o nome correto dos clientes.

### 🔄 Operações de Baixa e Inteligência de Negócio

- **Baixa Integral:** Liquidação instantânea de parcelas.
- **Baixa Parcial:** Regra de negócio avançada que calcula o valor pago, abate a dívida e gera automaticamente uma nova parcela com o saldo devedor restante reagendado para **1 mês** à frente.
- _State Reset_ automático após interações com o banco de dados.

### 📊 Dashboard Analítico

- Visão geral do saldo total a receber e vendas do mês.
- Classificação automática de status de parcelas (EM ABERTO, URGENTE, EM ATRASO) baseada na data atual.
- Gráficos dinâmicos de Fluxo de Recebimento e Previsão de Recebíveis.

## 🤝 Desenvolvido por

**MAJB Sistemas** - Analista de Desenvolvimento de Sistemas focado em produtividade e automação corporativa.

"Tudo o que fizerem, façam de todo o coração, como para o Senhor." - Colossenses 3:23
© 2026 MAJB Sistemas - Todos os direitos reservados.
