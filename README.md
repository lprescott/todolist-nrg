# todolist-node-react-graphql
A simple secured web application that allows users to maintain multiple lists of tasks, built with the NRG stack.


## Getting started

### Cloning

```bash
git clone https://github.com/lprescott/todolist-nrg/
cd todolist-nrg/client
npm install             # Install javascript package requirements
npm start               # Serve the react app
cd ../server    
npm install             # Install javascript package requirements
node app.js             # Start the Node.js server
```

### Folder Structure

```bash
.
│  README.md│
└──[web]
│  │  package.json                     # node dependencies
│  └──[src]                            # Frontend source files
│
└──[server]
   │  package.json                     # node dependencies
   └──[src]                            # Backend source files
```

## my NRG stack

| Component      | Technology                                                                                      | Version  |
| -------------- | ----------------------------------------------------------------------------------------------- | -------- |
| Language       | [JavaScript](https://www.javascript.com/)                                                       | v1.8.5   |
| Frontend       | [React.js](https://reactjs.org/)                                                                | v16.12.0 |
| Backend        | [Node.js](https://nodejs.org/en/) [(Apollo)](https://www.apollographql.com/docs/apollo-server/) | v12.13.0 |
| Query Language | [GraphQL](https://graphql.org/)                                                                 | v14.5.8  |
| Database       | [PostgresQL](https://www.postgresql.org//)                                                      | v12.1    |

## JavaScript
is a very popular computer language used on the web. All modern browsers come with JS support, making it indispensible in web development. On the front-end, JS can be used to collect user input, process data, and draw and manipulate elements on the screen. Additionally, using Node.js, Javascript can be run on the server.

## SASS
is a style sheet language that is compiled into CSS. It is known as "syntactic sugar" because it does not add any functionality to CSS, but makes it easier to read and write by allowing developers to use mechanisms like variables and mixins, which are not normally available in CSS. At compilation time, these are simply replaced with their values.

Sass comes in two flavors, Sass and the more common SCSS (Sassy CSS). Sass uses its own syntax, while SCSS is a superset of CSS syntax, meaning any valid CSS is also valid SCSS. 

## react.js 
is a front-end, open-source JavaScript library used to make developing user interfaces easier. React excels at displaying and updating data-driven components - that is, bits of your webpage that display data or rely on data. This is great for elements like charts, data tables, or any websites that display lots of changing data - for example, Facebook or Twitter. React can be very fast, but is also weighty and, like any framework, can be hard to fully understand, since it abstracts away what its doing.

## Node.js 
us an environment for server-side Javascript, allowing programmers to develop a back-end entirely in Javascript -- or in this case -- TypeScript.

### Apollo
is a community-maintained open-source GraphQL server. It works with pretty much all Node.js HTTP server frameworks! Apollo Server works with any GraphQL schema built with GraphQL.js--so you may build your schema with that or a convenience library such as graphql-tools.

## GraphQL
a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## PostgreSQL
often simply Postgres, is an object-relational database management system (ORDBMS). It is a free and open source, ACID-compliant and transactional database management system.
