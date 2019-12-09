const {
    ApolloServer,
    gql
} = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql `
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
`;

const todos = [{
        id: 1,
        text: 'Harry Potter and the Chamber of Secrets',
        completed: false,
    },
    {
        id: 2,
        text: 'Harry Potter',
        completed: false,
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves todos from the "todos" array above.
const resolvers = {
    Query: {
        todos: () => todos,
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// The `listen` method launches a web server.
server.listen().then(({
    url
}) => {
    console.log(`Server ready at ${url}`);
});