# Impacta RH — Backend API

API desenvolvida em **ASP.NET Core Web API** para o sistema **Impacta RH**, responsável pelo gerenciamento de funcionários.  
Este backend fornece endpoints REST para operações CRUD e se conecta a um banco **SQL Server** utilizando **Entity Framework Core**.

O projeto faz parte de um sistema completo com **frontend em React** e **banco de dados relacional**, desenvolvido como trabalho acadêmico.

---

## Tecnologias utilizadas

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger (OpenAPI)

---

## Funcionalidades da API

A API permite:

- listar funcionários
- buscar funcionário por ID
- cadastrar funcionário
- atualizar funcionário
- excluir funcionário

Todos os dados são persistidos no banco **SQL Server**.

---

## Estrutura principal do projeto

ImpactaRH.Api

- Controllers  
  Contém os endpoints da API.

- Data  
  Contém a configuração do contexto do banco de dados (Entity Framework).

- Models  
  Entidades utilizadas pela aplicação.

- appsettings.json  
  Configuração da aplicação e connection string.

- Program.cs  
  Arquivo principal de inicialização da API.

---

## Banco de dados

A aplicação utiliza **SQL Server**.

Banco utilizado:

ImpactaRH

Tabela principal:

Funcionarios

Campos da tabela:

- Id
- Nome
- Email
- CPF
- Cargo
- DataCadastro

---

## Configuração da conexão

No arquivo **appsettings.json**, configure a connection string do banco:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ImpactaRH;Trusted_Connection=True;TrustServerCertificate=True"
  }
}

---

## Como executar o projeto

### 1. Clonar o repositório

git clone https://github.com/seuusuario/impacta-rh-backend.git

---

### 2. Entrar na pasta do projeto

cd ImpactaRH.Api

---

### 3. Restaurar dependências

dotnet restore

---

### 4. Executar a API

dotnet run

---

## Documentação da API

Após iniciar a aplicação, o Swagger estará disponível em:

https://localhost:xxxx/swagger

O Swagger permite visualizar e testar todos os endpoints da API diretamente no navegador.

---

## Integração com o Frontend

O frontend da aplicação consome esta API para realizar as operações de funcionários.

Durante o desenvolvimento, o frontend roda localmente em:

http://localhost:8080

Por isso, a API possui configuração de **CORS** permitindo chamadas desse endereço.

---

## Objetivo do projeto

Este sistema foi desenvolvido como projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas**, com o objetivo de demonstrar integração entre:

- Frontend em React
- Backend em ASP.NET Core
- Banco de dados SQL Server
- API REST

---

## Autor

Projeto desenvolvido para fins acadêmicos.
