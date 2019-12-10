const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Todo" type defines the queryable fields for every todo in our data source.
    type Todo {
        id: ID
        text: String
        completed: Boolean
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "todos" query returns an array of zero or more Todos (defined above).
    type Query {
        todos: [Todo]
    }

    type Mutation {
        addTodo(text: String, completed: Boolean): Todo
        updateTodo(id: ID, text: String): Todo
        toggleCompleted(id: ID): Todo
        removeTodo(id: ID): Boolean
    }
`;

const todos = [
    {
        id: 1,
        text: 'Test todo 1',
        completed: false,
    },
    {
        id: 2,
        text: 'Test todo 2',
        completed: false,
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves todos from the "todos" array above.
let todoCount = todos.length;
const resolvers = {
    Query: {
        todos: () => todos,
    },
    Mutation: {
        addTodo: (parent, args) => {
            const todo = {
                id: `${++todoCount}`,
                text: args.text,
                completed: args.completed,
            };
            todos.push(todo);
            return todo;
        },
        updateTodo: (parent, args) => {
            for(i = 0; i < todos.length; i++) {
                if(todos[i].id == args.id) {
                    todos[i].text = args.text;
                    return(todos[i]);
                }
            }
            return null;
        },
        toggleCompleted: (parent, args) => {
            for(i = 0; i < todos.length; i++) {
                if(todos[i].id == args.id) {
                    todos[i].completed = !todos[i].completed;
                    return(todos[i]);
                }
            }
            return null;
        },        
        removeTodo: (parent, args) => {
            for(i = 0; i < todos.length; i++) {
                if(todos[i].id == args.id) {
                    todos.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
