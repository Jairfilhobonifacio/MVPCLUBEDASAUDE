# SGF - Sistema de Gerenciamento Fitness

Este projeto é uma aplicação web completa projetada para a gestão de academias, estúdios de personal trainer e clubes de saúde. Ele oferece uma solução robusta e intuitiva para administrar clientes, finanças e programas de treinamento, com portais dedicados para administradores e clientes.

## ✨ Funcionalidades Principais

O sistema é dividido em dois painéis principais, cada um com funcionalidades específicas para seu tipo de usuário.

### 🔑 Painel do Administrador

O portal do administrador oferece controle total sobre a operação do negócio:

-   **Gestão de Clientes**: Adicione, visualize, edite e remova clientes de forma centralizada.
-   **Gestão Financeira**: Crie e gerencie faturas, acompanhe status de pagamento (pendente, pago, vencido) e aprove comprovantes enviados pelos clientes.
-   **Gestão de Treinos**: Crie e atribua fichas de treino personalizadas para cada cliente, detalhando exercícios, séries, repetições e mais.
-   **Visão Geral (Dashboard)**: Um painel com métricas e visões rápidas sobre o status dos clientes e finanças.

### 👤 Portal do Cliente

Uma área exclusiva para o cliente acompanhar seu progresso e gerenciar sua conta:

-   **Visualizador de Treinos**: Acesse a ficha de treino atualizada a qualquer momento, com detalhes de cada exercício.
-   **Gestão de Pagamentos**: Envie comprovantes de pagamento de forma fácil e rápida.
-   **Painel Pessoal**: Visualize o status de suas faturas, com alertas visuais para pagamentos pendentes ou vencidos.

## 🖼️ Telas da Aplicação

*Para adicionar as imagens, substitua as URLs de placeholder abaixo pelos links das suas imagens. Você pode fazer o upload das imagens para o próprio GitHub ou usar um serviço como o Imgur.*

### Painel do Administrador
![Painel do Administrador](https://via.placeholder.com/800x400.png?text=Painel+do+Administrador)

### Portal do Cliente
![Portal do Cliente](https://via.placeholder.com/800x400.png?text=Portal+do+Cliente)

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com um stack de tecnologias modernas, focadas em performance, escalabilidade e uma ótima experiência de desenvolvimento.

-   **Frontend**: [Next.js](https://nextjs.org/) (com App Router)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
-   **Gerenciamento de Estado**: React Context API
-   **Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para validação

> **Nota**: Atualmente, a aplicação opera com dados simulados ("mockados") e utiliza o `localStorage` do navegador para persistência, sem a necessidade de um backend ou banco de dados.

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para rodar a aplicação em seu ambiente de desenvolvimento.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Jairfilhobonifacio/MVPCLUBEDASAUDE.git
    cd MVPCLUBEDASAUDE
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000).

### Credenciais de Acesso (Mock)

-   **Administrador**:
    -   **Email**: `admin@sgf.com`
    -   **Senha**: `123456`
-   **Cliente**:
    -   **Email**: `joao@email.com`
    -   **Senha**: `123456`

## 🤝 Como Contribuir

Contribuições são bem-vindas! Se você tem ideias para novas funcionalidades ou melhorias, sinta-se à vontade para abrir uma *issue* para discussão ou enviar um *pull request*.
