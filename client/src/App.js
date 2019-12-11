import React from "react";
import "./App.css";
import { gql } from "apollo-boost";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

const client = new ApolloClient();

const GET_TODOS = gql`
    query GetTodos {
        todos {
            id
            text
            completed
        }
    }
`;

const ADD_TODO = gql`
    mutation addTodo($text: String!) {
        addTodo(text: $text) {
            code
            success
            message
            todo {
                id
                text
                completed
            }
        }
    }
`;

function Todos() {
    const { loading, error, data } = useQuery(GET_TODOS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.todos.map(({ id, text, completed }) => (
        <div className="todo" key={"todo-" + id}>
            <p>
                {completed ? "done:" : "todo"} {text}
            </p>
        </div>
    ));
}

function AddTodo() {
    let input;
    const [addTodo] = useMutation(ADD_TODO, {
        update(
          cache,
          {
            data: { addTodo }
          }
        ) {
          const { todos } = client.readQuery({ query: GET_TODOS });
          client.writeQuery({
            query: GET_TODOS,
            data: { todos: todos.concat([addTodo.todo]) }
          });
        }
      });

    return (
        <form
            className="addTodo"
            onSubmit={e => {
                e.preventDefault();
                addTodo({ variables: { text: input.value } });
                input.value = "";
            }}
        >
            <input
                type="text"
                placeholder="Add a new todo..."
                ref={node => {
                    input = node;
                }}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

const App = () => {
    return (
        <ApolloProvider client={client}>
            <h2>
                My first Apollo app
                <span aria-label="rocket-emoji" role="img">
                    🚀
                </span>
            </h2>
            <AddTodo />
            <Todos />
        </ApolloProvider>
    );
};

export default App;
