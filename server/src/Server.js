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
        post(text: String, completed: Boolean): Todo
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
    }
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves todos from the "todos" array above.
let todoCount = todos.length;
const resolvers = {
    Query: {
        todos: () => todos,
    },
    Mutation: {
        post: (parent, args) => {
            const todo = {
             id: `${++todoCount}`,
             text: args.text,
             completed: args.completed,
           }
           todos.push(todo)
           return todo
         }
    }
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
