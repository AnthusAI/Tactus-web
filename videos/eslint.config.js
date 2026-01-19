const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ["node_modules/**", "out/**", ".remotion/**", "public/**", "babulus/**"],
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
    files: [
      "src/components/diagrams/ContainerSandboxDiagram.tsx",
      "src/components/diagrams/GuardrailsStackDiagram.tsx",
      "src/components/diagrams/StagedToolAccessDiagram.tsx",
      "src/components/diagrams/PromptEngineeringCeilingDiagram.tsx",
      "src/components/diagrams/OldWayFlowchartDiagram.tsx",
      "src/components/diagrams/NewWayFlowchartDiagram.tsx",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
