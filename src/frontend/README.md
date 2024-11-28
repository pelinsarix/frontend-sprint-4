# Projeto Vite

Este é um projeto desenvolvido com o [Vite](https://vitejs.dev/), um bundler rápido e moderno focado em experiência de desenvolvimento. Ele foi configurado para um ambiente de desenvolvimento ágil e possui comandos para build e deploy.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14.18+)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)

## Instalação

Para instalar as dependências do projeto, execute o comando:

```bash
npm install
```

## Comandos Disponíveis

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Este comando irá iniciar o Vite em modo de desenvolvimento, geralmente acessível em `http://localhost:3000`. Ele suporta HMR (Hot Module Replacement), recarregando automaticamente o navegador sempre que você salvar uma alteração nos arquivos.

### Build de Produção

Para gerar uma build otimizada para produção:

```bash
npm run build
```

Este comando gera a pasta `build`, contendo todos os arquivos otimizados e prontos para deploy.

## Estrutura de Pastas

A estrutura de pastas padrão do Vite para este projeto é:

```
├── public              # Arquivos estáticos que não passam pelo bundling
├── src                 # Código-fonte principal do projeto
│   ├── assets          # Assets como imagens e fontes
│   ├── components      # Componentes reutilizáveis
│   └── main.jsx         # Ponto de entrada do Vite
└── index.html          # HTML principal
```

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
