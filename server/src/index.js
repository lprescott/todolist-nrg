//TODO: https://github.com/cvburgess/SQLDataSource 
//TODO: https://www.apollographql.com/docs/apollo-server/data/data-sources/#community-data-sources 

const {
  ApolloServer,
  gql
} = require("apollo-server");

// create connection to database
var knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'test_user',
    password: 'test_code',
    database: 'test_db',
    port: '5432'
  }
});

// Create a table
knex.schema
  .hasTable('todos').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('todos', function (table) {
        table.increments('id');
        table.string('text');
        table.boolean(('completed'));
      });
    }
  })

  // Finally, add a .catch handler for the promise chain
  .catch(function (e) {
    console.error(e);
  });

// the data types, return types, and response types
const typeDefs = gql `
  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type TodoMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    todo: Todo
  }

  # todo model
  type Todo {
    id: ID
    text: String
    completed: Boolean
  }

  # queries: returnables
  type Query {
    todos: [Todo]
  }

  type Mutation {
    addTodo(text: String): TodoMutationResponse
    deleteTodo(id: ID): TodoMutationResponse
    updateTodo(id: ID, text: String): TodoMutationResponse
    toggleTodo(id: ID): TodoMutationResponse
  }
`;

// how to fetch and work with the data
const resolvers = {
  // get
  Query: {
    todos: () => {
      return knex.select().from('todos').orderBy('id', 'asc');
    }
  },
  // put, post, delete
  Mutation: {
    addTodo: (parent, args) => {

      let todo = {
        text: args.text,
        completed: false
      };

      return knex('todos').insert(todo, 'id')
        .then((id) => {
          todo.id = id[0];
          return {
            code: "200",
            success: true,
            message: "Successfully added todo.",
            todo
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: error,
            todo
          };
        });
    },
    deleteTodo: (parent, args) => {

      return knex('todos').where('id', args.id).del()
        .then(() => {
          return {
            code: "200",
            success: true,
            message: "Successfully deleted todo.",
            todo: {
              id: args.id
            }
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: "Could not delete todo.",
            todo: {
              id: args.id
            }
          };
        });
    },
    updateTodo: (parent, args) => {

      return knex('todos').where('id', args.id).update('text', args.text)
        .then(() => {
          return {
            code: "200",
            success: true,
            message: "Successfully update todo.",
            todo: {
              id: args.id,
              text: args.text
            }
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: error,
            todo: {
              id: args.id,
              text: args.text
            }
          };
        });
    },
    toggleTodo: (parent, args) => {

      return knex.select().from('todos').where('id', args.id)
        .then((todo) => {
          return knex('todos').where('id', args.id).update('completed', !todo[0].completed)
            .then(() => {
              return {
                code: "200",
                success: true,
                message: "Successfully toggled todo",
                todo: {
                  id: args.id,
                  completed: !todo[0].completed
                }
              }
            }).catch((error) => {
              return {
                code: "500",
                success: false,
                message: error,
                todo: {
                  id: args.id
                }
              }
            })
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: error,
            todo: {
              id: args.id
            }
          };
        });
    }
  },
  MutationResponse: {
    __resolveType() {
      return null;
    }
  }
};

// create new server with the above typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({
  url
}) => {
  console.log(`Server ready at ${url}graphql`);
});