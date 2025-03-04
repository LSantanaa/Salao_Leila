# Salão Da Leila - DSIN

Este projeto foi desenvolvido para o case da DSIN na vaga de desenvolvimento de software, consiste em um sistema de agendamento de salão de beleza
feito com **Next.js** para o frontend e **Node.js + Express + Prisma** para o backend. O banco de dados utilizado é **SQLite**.

É **muito importante** seguir o passo a passo corretamente para garantir que o ambiente funcione sem problemas.

---

## 📁 Estrutura do Repositório

```
/
├── frontend/   # Código do frontend (Next.js)
├── backend/    # Código do backend (Node.js + Express + Prisma)
├── docs/       # Documentação e imagens do projeto
```

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) → [Download Node.js](https://nodejs.org/)
- **NPM** ou **Yarn** (NPM já vem com o Node.js)

Para verificar se o Node.js está instalado, execute:
```sh
node -v
```

## 🛠️ Configuração do Ambiente

### 🔽 Clonando o Repositório
```sh
git clone hhttps://github.com/LSantanaa/Salao_Leila.git
cd Salao_Leila
```

---

## 🛠️ Executando o Backend

1. Acesse a pasta do backend:
   ```sh
   cd backend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo **.env** na raiz do backend e adicione:
     ```env
     PORT=8080
     DATABASE_URL="file:./db/database.db"
     ```
4. Execute as migrações do banco de dados:
   ```sh
   npm run migrate
   ```
5. Popule o banco de dados (Obrigatório para inserir administrador e serviços):
   ```sh
   npm run seed
   ```
   - O comando **seed** insere um login de **admin** e um de **cliente** para testes, além de **5 serviços** para o salão:
     - **Admin:**
       - Email: `admin@salao.com`
       - Senha: `admin123`
     - **Cliente:**
       - Email: `karen@cliente.com`
       - Senha: `cliente123`
     - **Serviços**
       - name: "Corte Simples", price: 50.00,
       - name: "Corte Especial", price: 70.00,
       - name: "Tintura", price: 90.00,
       - name: "Progressiva", price: 130.00,
       - name: "Hidratação", price: 50.00
        
6. Inicie o servidor:
   ```sh
   npm start
   ```
7. O backend estará rodando em:
   ```
   http://localhost:8080
   ```

---

## 🚀 Executando o Frontend

1. Acesse a pasta do frontend:
   ```sh
   cd frontend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Faça o build do projeto:
   ```sh
   npm run build
   ```
4. Inicie o servidor:
   ```sh
   npm start
   ```
5. Acesse no navegador:
   ```
   http://localhost:3000
   ```

---

## 🖼️ Documentação

A pasta **docs/** contém imagens e documentações adicionais sobre o projeto.

---

## ✨ Tecnologias Utilizadas

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
- **Banco de Dados:** SQLite

---

## 📜 Licença

Este projeto está sob a licença **MIT**.

