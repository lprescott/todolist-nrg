import React from 'react';
import './App.css';
import { gql } from "apollo-boost";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';

const client = new ApolloClient();

function Todos() {
  const { loading, error, data } = useQuery(gql`
    {
      todos {
        id
        text
        completed
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.todos.map(({ id, text, completed }) => (
    <div key={id}>
      <p>
        {text}: {(completed) ? 'yes' : 'no'}
      </p>
    </div>
  ));
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app 
          <span aria-label="rocket-emoji" role="img">🚀</span>
        </h2>
        <Todos />
      </div>
    </ApolloProvider>
  );
}

export default App;
