import js from "@eslint/js";
import htmlPlugin from "eslint-plugin-html";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    // Diz ao ESLint para inspecionar os scripts dentro dos seus ficheiros HTML
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        // Carrega todas as variáveis padrão de navegador (window, document, fetch, etc.)
        ...globals.browser,
        
        // As suas variáveis globais personalizadas do Apps Script e do CRM
        google: "readonly",
        lucide: "readonly",
        perfilUsuarioAtual: "writable",
        clientesGlobais: "writable",
        projetosGlobais: "writable",
        catalogoMateriaisGlobais: "writable",
        parcelasGlobais: "writable",
        listaUsuariosGlobais: "writable",
        diariasHistoricasAtivas: "writable"
      }
    },
    rules: {
      // 1. DESLIGA O ALERTA DE FUNÇÕES NÃO USADAS (porque o HTML as usa no onclick)
      "no-unused-vars": "off",

      // 2. DESLIGA O ALERTA DE FUNÇÕES/VARIÁVEIS NÃO DEFINIDAS (porque estão em outros arquivos HTML)
      "no-undef": "off",

      // 3. DESLIGA O ALERTA DE VARIÁVEIS REDECLARADAS (causado pelos globals do Apps Script)
      "no-redeclare": "off",

      // 4. MANTÉM OS ERROS CRÍTICOS ATIVOS
      "no-unreachable": "error",
      "no-empty": "warn"
    }
  }
];