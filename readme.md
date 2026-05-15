# MAJB CRM - Resplendor Solar ☀️

Sistema corporativo de gestão (CRM) e portal de clientes desenvolvido sob medida para a operação da **Resplendor Solar**. Construído com uma arquitetura **Single Page Application (SPA)**, o sistema oferece alta performance, segurança de nível corporativo e gestão financeira detalhada das usinas solares.

## 🚀 Funcionalidades Principais

- **Arquitetura SPA:** Navegação fluida e ultrarrápida, sem recarregamentos de página.
- **Controle de Acesso Hierárquico:** Sistema de login seguro com distinção rigorosa de permissões entre Administradores e Colaboradores.
- **Segurança e Criptografia:** Validação de senhas com hashing seguro e fluxo obrigatório de troca de senha no primeiro acesso.
- **Motor Financeiro Blindado:** Cálculos dinâmicos de rentabilidade baseados em parâmetros do banco de dados em tempo real.
- **Geração de Relatórios em PDF:** Criação de balanços, extratos e relatórios formatados profissionalmente, gerados diretamente no navegador.
- **Detecção Automática de Ambiente:** O sistema identifica automaticamente se está a rodar em Produção ou Homologação, ajustando as conexões de banco de dados e a interface (faixas de aviso) sem intervenção manual.

## 🛠️ Stack Tecnológica

O projeto utiliza uma separação moderna entre o Frontend (Interface) e o Backend (Lógica e Banco de Dados), integrados via API do Google.

**Frontend (Hospedado na Hostinger)**

- HTML5 / CSS3 / JavaScript (Vanilla)
- [Tailwind CSS](https://tailwindcss.com/) para estilização rápida e responsiva.
- [Lucide Icons](https://lucide.dev/) para a iconografia.
- Google Charts para a renderização do Dashboard.

**Backend & Banco de Dados (Serverless)**

- **Google Apps Script (GAS):** Motor lógico e API do sistema.
- **Google Sheets:** Atuando como um banco de dados relacional (NoSQL) de alta disponibilidade.

**DevOps & CI/CD**

- **GitHub Actions:** Automação total de deploys.
- **Clasp (Command Line Apps Script Projects):** Push automático do código backend para o Google.
- **FTP Deploy:** Envio automático do código frontend para a Hostinger.

## ⚙️ Estrutura de Ambientes

O projeto está dividido em dois ambientes isolados para garantir a segurança das atualizações:

1. **Homologação (Testes):** \* Frontend: Subdiretório `/homologacao`
   - Backend: Script ID e Planilha de testes dedicados.
   - _Aviso visual (faixa laranja) ativado para evitar confusão._

2. **Produção (Oficial):**
   - Frontend: Raiz do domínio (via máscara de `iframe` em tela cheia).
   - Backend: Script ID e Planilha oficiais da operação.

## 📦 Fluxo de Deploy (CI/CD)

Ao realizar um `push` ou `merge` para a branch `main`, o GitHub Actions executa duas rotinas paralelas:

1. Valida e envia o código `main.js` e `planilhas.js` para o Google Apps Script de Produção via Clasp.
2. Transfere os ficheiros HTML/CSS da pasta `public_html/` para o servidor da Hostinger via FTP.

## 👨‍💻 Autoria

Desenvolvido com excelência por **MAJB Sistemas**.

"Tudo o que fizerem, façam de todo o coração, como para o Senhor." - Colossenses 3:23
© 2026 MAJB Sistemas - Todos os direitos reservados.
