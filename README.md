Aqui está a seção traduzida e atualizada:

### Projeto Node.js com Express, TypeORM, JWT, Nodemailer e Dayjs

#### Tecnologias Utilizadas

- Node.js
- Express
- TypeORM
- JWT (JSON Web Tokens)
- Nodemailer
- Dayjs

#### Configuração do Projeto

#### Extensões do VS Code Necessárias

- **SQLite**
- **SQLite Viewer**

1. **Clone o repositório**

2. **Instale as dependências**

   npm install

3. **Configuração das variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```dotenv
   PORT=3000
   JWT_SECRET=sua_chave_secreta
   EMAIL_USER="seuemail@gmail.com"
   EMAIL_PASS="sua_senha_de_aplicativo"
   ```

#### Execução do Projeto

1. **Execute as migrações do banco de dados**

   ```
   npm run migration:run
   ```

   (Certifique-se de que seu ambiente esteja configurado para suportar SQLite ou o banco de dados que você está utilizando com TypeORM)

2. **Inicie o servidor**

   ```
   npm run dev
   ```

   O servidor estará rodando em http://localhost:3000.

#### Rotas Disponíveis

1. **Criar uma clínica**

   - **Rota**: `POST /clinic/createClinic`
   - **Exemplo de Corpo de Requisição**:

     ```json
     {
       "name": "clinica 1",
       "address": "avenida vasco da gama",
       "phone": 71987309678,
       "cnpj": "12.345.678/0001-00",
       "cep": "41098031"
     }
     ```

   - **Exemplo de Resposta**:

     ```json
     {
       "name": "clinica 1",
       "address": "avenida vasco da gama",
       "phone": 71987309678,
       "cnpj": "12.345.678/0001-00",
       "cep": "41098031",
       "created_at": "2024-07-09T02:03:46.853Z",
       "updated_at": "2024-07-09T02:03:46.854Z",
       "id": 9
     }
     ```

2. **Criar um médico**

   - **Rota**: `POST /doctor/createDoctor`
   - **Exemplo de Corpo de Requisição**:

     ```json
     {
       "name": "clinica 1",
       "cpf": "12334568900",
       "phone": 719873009,
       "email": "doctor@email.com",
       "crm": "20392093",
       "specialty": "Cardiologia",
       "clinic": "clinica 1"
     }
     ```

   - **Exemplo de Resposta**:

     ```json
     {
       "id_person": 3,
       "id_clinic": 1,
       "specialty": "Cardiologia",
       "crm": "20392093",
       "created_at": "2024-07-09T02:05:41.751Z",
       "updated_at": "2024-07-09T02:05:41.751Z",
       "id": 2
     }
     ```

3. **Criar um usuário**
   **Certifique-se de que o e-mail seja acessível para visualização do PDF que será enviado para ele ao final da criação da consulta.**

   - **Rota**: `POST /users/createUser`
   - **Exemplo de Corpo de Requisição**:

     ```json
     {
       "email": "vel2@email.com",
       "password": "senha",
       "name": "vel",
       "cpf": "123.456.789-09",
       "phone": 71987566959
     }
     ```

   - **Exemplo de Resposta**:

     ```json
     {
       "id_person": 4,
       "email": "vel2@email.com",
       "created_at": "2024-07-09T02:11:16.899Z",
       "updated_at": "2024-07-09T02:11:16.899Z",
       "insurance": null,
       "desc_insurance": null,
       "id": 2
     }
     ```

4. **Login do usuário**

   - **Rota**: `POST /users/login`
   - **Exemplo de Corpo de Requisição**:

     ```json
     {
       "email": "vel2@gmail.com",
       "password": "senha"
     }
     ```

   - **Exemplo de Resposta**:

     ```json
     {
       "userData": {
         "id": 2,
         "id_person": 4,
         "email": "vel2@email.com",
         "insurance": null,
         "desc_insurance": null,
         "created_at": "2024-07-09T02:11:16.899Z",
         "updated_at": "2024-07-09T02:11:16.899Z"
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwNDkxMTQ2LCJleHAiOjE3MjA1MTk5NDZ9.YFwqR0IYjs226YBWD_JHwqQktozWyM_Of51pO8Ru9mA"
     }
     ```

5. **Obter perfil do usuário autenticado**

- **Incluir o Token retornado ao fazer login no cabeçalho Authorization como "Bearer token"**

  - **Rota**: `GET /users/profile`
  - **Exemplo de Resposta**:

    ```json
    {
      "id": 2,
      "id_person": 4,
      "email": "vel2@email.com",
      "insurance": null,
      "desc_insurance": null,
      "created_at": "2024-07-09T02:11:16.899Z",
      "updated_at": "2024-07-09T02:11:16.899Z"
    }
    ```

6. **Criar uma consulta**
   **Nessa rota será gerado um pdf que se encontrará na pasta deste repositório e também será enviado para o email do usuário cadastrado anteriormente.**

- **Incluir o Token retornado ao fazer login no cabeçalho Authorization como "Bearer token"**

  - **Rota**: `POST /appointment/createAppointment`
  - **Exemplo de Corpo de Requisição**:

    ```json
    {
      "date": "2024-07-09T17:40:00.000Z",
      "id_clinic": 1,
      "id_doctor": 1
    }
    ```

  - **Exemplo de Resposta**:

    ```json
    {
      "id_user": 1,
      "id_doctor": 1,
      "date": "2089-05-09T17:40:00.000Z",
      "id_clinic": 1,
      "created_at": "2024-07-09T01:32:27.952Z",
      "updated_at": "2024-07-09T01:32:27.952Z",
      "id": 67
    }
    ```

7. **Modificar dados da consulta**

- **Incluir o Token retornado ao fazer login no cabeçalho Authorization como "Bearer token"**

  - **Rota**: `POST /appointment/updateAppointment`
  - **Exemplo de Corpo de Requisição**:

    ```json
    {
      "id": 2,
      "date": "2025-05-09T17:40:00.000Z",
      "id_doctor": 1,
      "id_clinic": 1
    }
    ```

  - **Exemplo de Resposta**:

    ```json
    {
      "id": 2,
      "id_user": 1,
      "id_doctor": 1,
      "date": "2025-05-09T17:40:00.000Z",
      "id_clinic": 1,
      "created_at": "2024-07-09T02:32:43.082Z",
      "updated_at": "2024-07-09T02:32:43.082Z"
    }
    ```

8. **Deletar dados da consulta**

- **Incluir o Token retornado ao fazer login no cabeçalho Authorization como "Bearer token"**

  - **Rota**: `POST /appointment/deleteAppointment`
  - **Exemplo de Corpo de Requisição**:

    ```json
    {
      "id": 2
    }
    ```

9. **Visualizar dados das consultas**

   - **Rota**: `GET /appointment/getAppointments`
   - **Incluir o Token retornado ao fazer login no cabeçalho Authorization como "Bearer token"**
