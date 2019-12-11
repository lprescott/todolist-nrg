import React from 'react';
import logo from './logo.svg';
import './App.css';
import { gql } from "apollo-boost";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';


const GET_TODOS = gql`
  query {
    todos {
      id
      text
      completed
    }
  }
`;

const client = new ApolloClient();

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app 🚀</h2>
      </div>
    </ApolloProvider>
  );
}

export default App;
