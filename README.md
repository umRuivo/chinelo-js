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

## Middlewares Globais

Os middlewares que são aplicados a todas as rotas da aplicação foram centralizados em `core/middlewares/global.middleware.js`. Isso inclui a configuração de sessão, parsers de corpo de requisição, arquivos estáticos, CORS, e o middleware de autenticação global (se aplicável). O handler de 404 também é definido no `server.js` após o registro de todas as rotas.

## Estrutura do Projeto

```
/
├── prisma/                 # Configuração e migrações do Prisma
├── public/                 # Arquivos estáticos (CSS, JS, imagens)
├── src/
│   ├── controllers/        # Lógica de controle da aplicação
│   ├── middlewares/        # Middlewares de autenticação, validação, etc.
│   ├── models/             # Lógica de acesso a dados (usando Prisma)
│   └── views/              # Arquivos de template (Pug)
├── core/
│   ├── autoRoutes.js       # Core do sistema de auto-rotas
│   ├── helpers/            # Funções auxiliares
│   ├── middlewares/        # Middlewares globais do core
│   └── scripts/            # Scripts de automação
├── chinelo.config.js       # Arquivo de configuração principal
├── custom.routes.js        # Definição de rotas manuais
├── server.js               # Ponto de entrada da aplicação
└── package.json
```

## Helper `getRota()`

O helper `getRota()` é uma função assíncrona que facilita a geração de URLs dinâmicas em sua aplicação, garantindo que as rotas estejam sempre corretas e consistentes com a configuração do sistema. Ele é especialmente útil para links em views, actions de formulários e redirecionamentos.

**Uso:**

```javascript
import { getRota } from './core/helpers/routeHelper.js';

// Para rotas sem parâmetros:
const homeUrl = await getRota('index'); // Retorna '/'
const loginUrl = await getRota('login'); // Retorna '/login.asp' (ou o sufixo configurado)

// Para rotas com parâmetros:
// getRota('controllerName', 'methodName', [param1, param2, ...]);
const userProfileUrl = await getRota('user', 'show', [user.uid]); // Ex: '/user/show.asp/123'
const editUserUrl = await getRota('user', 'edit', [user.uid]); // Ex: '/user/edit.asp/123'

// Para rotas que não existem ou com número incorreto de parâmetros:
const nonexistentRoute = await getRota('nonexistent', 'method'); // Retorna 'rota inexistente'
const mismatchedParams = await getRota('user', 'show', ['id1', 'id2']); // Retorna 'rota inexistente' se 'show' espera apenas 1 parâmetro
```

**Características:**

*   **Assíncrono:** Deve ser chamado com `await`.
*   **Método Padrão:** Se `methodName` for omitido, assume-se `'index'` (ex: `getRota('user')` é o mesmo que `getRota('user', 'index')`).
*   **Rota Raiz:** `getRota('index')` ou `getRota('index', 'index')` retorna `'/'`.
*   **Validação de Existência:** Retorna `'rota inexistente'` se o controller ou o método não existirem, ou se o número de parâmetros fornecidos não corresponder ao esperado pela rota.

## Instalação e Uso

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/umRuivo/chinelo-js.git
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
        bun run export-routes && bun --hot server.js
        ```
    *   **Produção:**
        ```bash
        bun run export-routes && bun server.js
        ```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida em `chinelo.config.js`).

## Configuração (`chinelo.config.js`)

O arquivo `chinelo.config.js` permite customizar o comportamento da aplicação:

*   `port`: Porta do servidor.
*   `siteIP`: Endereço IP do servidor.
*   `urlViews`: Diretório das views.
*   `dirPublic`: Diretório de arquivos públicos.
*   `templateEngine`: Motor de templates (ex: 'pug').
*   `pageNotFound`: Nome do arquivo da view de página não encontrada.
*   `msgNotFound`: Mensagem exibida quando a página não é encontrada.
*   `activeLimiter`: Ativa ou desativa o limitador de requisições.
*   `apiMode`: `true` para uma API JSON, `false` para uma aplicação web com views.
*   `routeSufix`: Sufixo adicionado a todas as rotas (ex: '/index.html').
*   `globalRoutePrefix`: Prefixo global adicionado a todas as rotas (ex: 'admin/').
*   `maxRequests`: Número máximo de requisições permitidas dentro do `maxRequestsTime`.
*   `maxRequestsTime`: Tempo em minutos para o limite de requisições.
*   `maxRequestsMessage`: Mensagem exibida quando o limite de requisições é excedido.
*   `globalData`: Objeto contendo dados globais para as views, como `siteName`, `author`, `prefix`, `sufix` e `sessionTime`.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

![Exemplo de uso](.github/images/print.png)