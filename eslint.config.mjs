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
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-unreachable": "error"
    }
  }
];