# ☀️ MAJB CRM - Resplendor Solar

![Status](https://img.shields.io/badge/Status-Produção-success)
![Versão](https://img.shields.io/badge/Version-1.00.05_Modular-blue)
![Stack](https://img.shields.io/badge/Stack-Google_Apps_Script_%7C_JS_%7C_Tailwind-orange)

Sistema corporativo de gestão (CRM) e portal financeiro desenvolvido sob medida para a operação da **Resplendor Solar**. Construído sob uma arquitetura **Single Page Application (SPA)** serverless, o sistema centraliza as vendas, automatiza a precificação e oferece gestão financeira detalhada com alta performance e segurança.

---

## 🚀 Módulos e Funcionalidades

O sistema foi desenhado de forma modular para eliminar gargalos operacionais e blindar as regras de negócio da empresa:

- **📊 Dashboard Analítico:** Visão geral de recebíveis, parcelas em atraso e fluxo de caixa renderizados em tempo real via Google Charts.
- **🧮 Simulador de Preços Inteligente:** Motor matemático que calcula margens de lucro, comissões, fretes e taxas de maquininha dinamicamente, sugerindo o preço ideal de venda.
- **💰 Gestão Financeira e Baixas:** Controle de parcelamentos, identificação automática de status (Urgente/Em Atraso) e suporte a baixas parciais com recálculo automático de saldo devedor.
- **📄 Relatórios Profissionais:** Geração nativa de relatórios em PDF diretamente pelo navegador, com filtros de período (Data Inicial/Final) e totalizadores contábeis.
- **🔐 Segurança e Controle de Acesso:** Autenticação criptografada (Hashing SHA-256), troca obrigatória de senha no primeiro acesso e controle hierárquico estrito (Administrador vs. Colaborador).

---

## 🛠️ Stack Tecnológica e Arquitetura

O projeto adota uma arquitetura moderna separando completamente a Interface (Frontend) do Motor de Banco de Dados (Backend), comunicando-se via API.

**Frontend (Hospedado via Hostinger)**

- HTML5 / JavaScript (Vanilla)
- [Tailwind CSS](https://tailwindcss.com/) (Estilização utilitária e responsiva)
- [Lucide Icons](https://lucide.dev/) (Iconografia leve)

**Backend & Banco de Dados (Serverless Google)**

- **Google Apps Script (GAS):** API e motor de regras de negócio.
- **Google Sheets:** Banco de dados relacional (NoSQL) garantindo alta disponibilidade e fácil auditoria.

**DevOps & CI/CD**

- **GitHub Actions:** Esteira de deploy totalmente automatizada.
- **Clasp (Google):** Envio automatizado do código backend para o servidor da Google.
- **FTP Deploy:** Sincronização automática do frontend com a Hostinger a cada novo commit na branch `main`.

---

## ⚙️ Ambientes de Implantação

Para garantir a estabilidade da operação, o fluxo de desenvolvimento respeita dois ambientes isolados:

1.  **Homologação (Testes):** \* Frontend servido em subdiretório (`/homologacao`).
    - Backend conectado a uma base de dados espelho.
    - _Aviso visual persistente na interface (faixa amarela) para prevenir uso acidental pela operação._
2.  **Produção (Oficial):** \* Frontend servido na raiz do domínio protegido por máscara de iframe.
    - Conectado à base de dados oficial.

---

## 💻 Como Rodar Localmente (Desenvolvimento)

Para programadores que desejem clonar o repositório e utilizar o Visual Studio Code para edição e manutenção do sistema, é necessário configurar a ponte com o Google Apps Script utilizando o Node.js.

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado.
- Git instalado.
- Permissão de edição no Script do Google.

### 1. Instalar e Autenticar o Clasp

Abra o seu terminal e instale a ferramenta de linha de comandos do Google Apps Script globalmente:

```bash
npm install -g @google/clasp
```

Faça o login na sua conta Google (abrirá uma janela no navegador):

```Bash
clasp login 2. Clonar o Ambiente
```

Clone este repositório para a sua máquina local:

```Bash
git clone <URL_DO_SEU_REPOSITORIO>
cd resplendor-solar
```

Associe a sua pasta local ao Script de Homologação da Google:

```Bash
clasp clone <ID_DO_SEU_SCRIPT_DE_HOMOLOGACAO>
```

### 3. Sincronizar o Código

Após fazer edições nos seus ficheiros locais (.js ou .html), envie as alterações para o servidor da Google para testar:

```Bash
clasp push
```

Para o deploy final de interface, basta fazer um commit e um git push para a branch main, e as Actions encarregar-se-ão de atualizar a Hostinger.

### 👨‍💻 Autoria

Desenvolvido com excelência por MAJB Sistemas.

```
"Tudo o que fizerem, façam de todo o coração, como para o Senhor." - Colossenses 3:23
```

© 2026 MAJB Sistemas - Todos os direitos reservados.
