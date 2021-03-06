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

// Create users table
knex.schema
  .hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.increments('id');
        table.string('username');
        table.string('password');
      });
    }
  })

  // Then insert into the table some users
  .then(function() {
    return knex('users').insert({ username: 'user1', password: 'pass' });
  })

  .then(function() {
    return knex('users').insert({ username: 'user2', password: 'pass' });
  })

  // Finally, add a .catch handler for the promise chain
  .catch(function (e) {
    console.error(e);
  });

// Create lists table
knex.schema
  .hasTable('lists').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('lists', function (table) {
        table.increments('id');
        table.string('title');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
      });
    }
  })

  // Finally, add a .catch handler for the promise chain
  .catch(function (e) {
    console.error(e);
  });

// Create todos table
knex.schema
  .hasTable('todos').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('todos', function (table) {
        table.increments('id');
        table.string('text');
        table.boolean('completed');
        table.integer('list_id').unsigned();
        table.foreign('list_id').references('lists.id');
      });
    }
  })

  // Finally, add a .catch handler for the promise chain
  .catch(function (e) {
    console.error(e);
  });

// the data types, return types, and response types
const typeDefs = gql `
  interface Response {
    code: String!
    success: Boolean!
    message: String!
  }

  type TodoMutationResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    todo: Todo
  }

  type ListMutationResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    list: List
  }

  type UserLoginResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  # todo model
  type Todo {
    id: ID
    text: String
    completed: Boolean
    list_id: ID
  }

  # list model
  type List {
    id: ID
    title: String
    user_id: ID
  }

  # user model
  type User {
    id: ID
    username: String
    password: String
  }

  # queries: returnables
  type Query {
    todos: [Todo]
    lists(user_id: ID): [List]
    todolist(list_id: ID): [Todo]
    list(id: ID): List
    login(username: String, password: String): UserLoginResponse
  }

  type Mutation {
    addTodo(text: String, list_id: ID): TodoMutationResponse
    deleteTodo(id: ID): TodoMutationResponse
    updateTodo(id: ID, text: String): TodoMutationResponse
    toggleTodo(id: ID): TodoMutationResponse

    addList(title: String, user_id: ID): ListMutationResponse
    deleteList(id: ID): ListMutationResponse
    updateList(id: ID, title: String): ListMutationResponse    
  }
`;

// how to fetch and work with the data
const resolvers = {
  // get
  Query: {
    todos: () => {
      return knex.select().from('todos').orderBy('id', 'asc');
    },
    lists: (parent, args) => {
      return knex.select().from('lists').where('user_id', args.user_id).orderBy('id', 'asc');
    },
    todolist: (parent, args) => {
      return knex.select().from('todos').where('list_id', args.list_id).orderBy('id', 'asc');
    },
    list: (parent, args) => {
      return knex.select().from('lists').where('id', args.id).first();
    },
    login: (parent, args) => {
      return knex.select().from('users').where('username', args.username).andWhere('password', args.password).first().then((user) => {
        if(user) {
          return {
            code: "200",
            success: true,
            message: "Successfully logged on.",
            user: {
              id: user.id,
              username: user.username,
              password: null
            }
          }
        } else {
          return {
            code: "405",
            success: false,
            message: "Invalid login credentials.",
          }
        }
      })
    }
  },
  // put, post, delete
  Mutation: {
    addTodo: (parent, args) => {

      let todo = {
        text: args.text,
        list_id: args.list_id,
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

      return knex('todos').where('id', args.id).update('text', args.text).returning('*')
        .then((response) => {
          return {
            code: "200",
            success: true,
            message: "Successfully updated todo.",
            todo: response[0]
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: error,
            todo: response[0]
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
                message: "Successfully toggled todo.",
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
    },
    addList: (parent, args) => {

      let list = {
        title: args.title,
        user_id: args.user_id,
      };

      return knex('lists').insert(list, 'id')
        .then((id) => {
          list.id = id[0];
          return {
            code: "200",
            success: true,
            message: "Successfully added list.",
            list
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: "Could not add list.",
            list
          };
        });
    },
    deleteList: (parent, args) => {

      return knex('lists').where('id', args.id).del()
        .then(() => {
          return {
            code: "200",
            success: true,
            message: "Successfully deleted list.",
            list: {
              id: args.id
            }
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: "Could not delete list.",
            list: {
              id: args.id
            }
          };
        });
    },
    updateList: (parent, args) => {

      return knex('lists').where('id', args.id).update('title', args.title).returning('*')
        .then((response) => {
          return {
            code: "200",
            success: true,
            message: "Successfully updated list.",
            list: response[0]
          };
        }).catch((error) => {
          return {
            code: "500",
            success: false,
            message: "Could not update list.",
            list: response[0]
          };
        });
    },
  },
  Response: {
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