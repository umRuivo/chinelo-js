# Chinelo.js - Sistema de Auto-Rotas para Express.js

Chinelo.js é um sistema de backend leve e extensível para Node.js e Express, projetado para simplificar a criação de APIs e aplicações web. O core do sistema é um mecanismo de roteamento automático que gera rotas RESTful a partir dos seus controllers, permitindo que você se concentre na lógica de negócios em vez de na configuração de rotas.

## Funcionalidades

*   **Roteamento Automático:** As rotas são geradas automaticamente a partir dos arquivos e funções nos seus controllers.
*   **Convenção sobre Configuração:** Inferência inteligente de métodos HTTP (GET, POST, PUT, DELETE) baseada nos nomes das funções.
*   **Configuração Centralizada:** Gerencie as configurações da sua aplicação em um único arquivo (`chinelo.config.js`).
*   **Flexível:** Permite a definição de rotas personalizadas, middlewares e parâmetros de rota diretamente nos controllers.
*   **Prisma ORM:** Integração com o Prisma para uma interação moderna e segura com o banco de dados.
*   **View Engine:** Suporte para renderização de views no servidor com Pug.
*   **Modo API:** Alterne facilmente entre uma aplicação web tradicional e uma API JSON pura.

## Como Funciona

O sistema utiliza o `autoRoutes.js` para escanear o diretório `src/controllers`. Para cada função exportada em um arquivo de controller, uma rota é registrada no Express.

*   **Nome do Controller:** O nome do arquivo (sem a extensão `.js`) se torna a base da rota (ex: `user.js` → `/user`).
*   **Nome da Função:** O nome da função se torna o endpoint (ex: `function list()` → `/user/list`).
*   **Metadados de Rota:**

    Os metadados da rota (método HTTP, parâmetros e middlewares) são definidos em arrays exportados:

    ```javascript
    export const middlewares = [
        ['minhaFuncao', [authMiddleware, adminMiddleware]]
    ];

    export const httpMethods = [
        ['minhaFuncao', 'POST']
    ];

    export const routeParams = [
        ['minhaFuncao', ['id']] // Gera a rota /controller/minhaFuncao/:id
    ];
    ```

## Estrutura do Projeto

```
/
├── prisma/                 # Configuração e migrações do Prisma
├── public/                 # Arquivos estáticos (CSS, JS, imagens)
├── src/
│   ├── controllers/        # Lógica de controle da aplicação
│   ├── core/               # Core do sistema (autoRoutes.js)
│   ├── middlewares/        # Middlewares de autenticação, validação, etc.
│   ├── models/             # Lógica de acesso a dados (usando Prisma)
│   └── views/              # Arquivos de template (Pug)
├── chinelo.config.js       # Arquivo de configuração principal
├── custom.routes.js        # Definição de rotas manuais
├── server.js               # Ponto de entrada da aplicação
└── package.json
```

## Instalação e Uso

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/chinelo-js.git
    cd chinelo-js
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    bun install
    ```

3.  **Configure o ambiente:**
    *   Renomeie o arquivo `.env.example` para `.env`.
    *   Adicione a URL do seu banco de dados no arquivo `.env`:
        ```
        DATABASE_URL="mysql://usuario:senha@servidor:porta/banco"
        ```

4.  **Execute as migrações do Prisma:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Inicie o servidor:**
    *   **Desenvolvimento (com hot-reload):**
        ```bash
        npm run dev
        ```
    *   **Produção:**
        ```bash
        npm start
        ```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida em `chinelo.config.js`).

## Configuração (`chinelo.config.js`)

O arquivo `chinelo.config.js` permite customizar o comportamento da aplicação:

*   `port`: Porta do servidor.
*   `urlViews`: Diretório das views.
*   `dirPublic`: Diretório de arquivos públicos.
*   `templateEngine`: Motor de templates (ex: 'pug').
*   `apiMode`: `true` para uma API JSON, `false` para uma aplicação web com views.
*   `activeLimiter`: Ativa ou desativa o limitador de requisições.
*   ...e outras opções.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.