
# Zé-Delivery-Challenge

Projeto pensado primeiramente para me desafiar,utilizo frequentemente estes repositorios do github para me aperfeiçoar.  

Back-End: https://github.com/CollabCodeTech/backend-challenges

Front-End: https://github.com/felipefialho/frontend-challenges

Repositorio exato do desafio https://github.com/ZXVentures/ze-code-challenges/blob/master/backend.md

## Rodando localmente

Clone o projeto

```bash
front end
    git clone https://github.com/ShotokanTI/zedelivery-challenge-frontend.git
back end
    git clone https://github.com/ShotokanTI/zedeliverychallenge.git
```

Entre no diretório do projeto

```bash
  cd zedelivery-challenge-frontend
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```

Obs: Para conseguir rodar o projeto localmente é necessário também instalar no banco POSTGRESQL o POSTGIS que é uma extensão onde permite manipular dados geométricos. 

Abra seu Query tool e digite este comando sql.

```bash
CREATE EXTENSION postgis;
```

## Testando na nuvem

https://dynamic-kulfi-afd474.netlify.app/


## Sobre o projeto

 O projeto tem a finalidade de salvar/deletar/atualizar areas demarcadas de lojas de parceiros,exibindo a localização exata da sua loja no mapa.


## Stack utilizada

**Front-end:** Vue 3 Composition Api, TailwindCSS,Typescript,Axios e Leafleat

**Back-end:** Java 17, Spring Boot,Hibernate e POSTGRESQL obs:(Utilizando o POSTGIS instalado para salvamento de dados geometricos.)

