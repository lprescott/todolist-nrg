const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
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

// the todos list
var todos = [
  {
    id: 1,
    text: "Take out the trash!",
    completed: false
  },
  {
    id: 2,
    text: "Learn the energy stack.",
    completed: true
  },
  {
    id: 3,
    text: "Full 8 hours.",
    completed: false
  },
  {
    id: 4,
    text: "Clean room.",
    completed: false
  },
  {
    id: 5,
    text: "Practice guitar.",
    completed: true
  }
];

// how to fetch the data (hard-coded)
let todoCount = todos.length;
const resolvers = {
  Query: {
    todos: () => todos
  },
  Mutation: {
    addTodo: (parent, args) => {
      const todo = {
        id: ++todoCount,
        text: args.text,
        completed: false
      };
      todos.push(todo);
      return {
        code: "200",
        success: true,
        message: "Successfully added todo.",
        todo
      };
    },
    deleteTodo: (parent, args) => {
      let flag = false;
      let deleted;
      todos = todos.filter(todo => {
        if (todo.id != args.id) return todo;
        else { flag = true; deleted = todo;}
      });
      if (flag == true) {
        return {
          code: "200",
          success: true,
          message: "Successfully deleted todo.",
          todo: deleted
        };
      } else {
        return {
          code: "404",
          success: false,
          message: "Could not find todo.",
          todo: {
            id: args.id
          }
        };
      }
    },
    updateTodo: (parent, args) => {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == args.id) {
          const todo = todos[i];
          if (todos[i].text == args.text) {
            return {
              code: "304",
              success: false,
              message: "No change.",
              todo
            };
          } else {
            todos[i].text = args.text;
            return {
              code: "200",
              success: true,
              message: "Successfully updated todo.",
              todo
            };
          }
        }
      }
      return {
        code: "404",
        success: false,
        message: "Could not find todo."
      };
    },
    toggleTodo: (parent, args) => {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == args.id) {
          const todo = todos[i];
          todos[i].completed = !todos[i].completed;
          return {
            code: "200",
            success: true,
            message: "Successfully updated todo.",
            todo
          };
        }
      }
      return {
        code: "404",
        success: false,
        message: "Could not find todo."
      };
    }
  }
};

// create new server with the above typeDefs and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}graphql`);
});
