import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import {
    GET_TODOS,
    ADD_TODO,
    UPDATE_TODO,
    TOGGLE_TODO,
    DELETE_TODO
} from "./TodoQueries.js";

const client = new ApolloClient();

function Todos() {
    const { loading, error, data } = useQuery(GET_TODOS);
    const [deleteTodo] = useMutation(DELETE_TODO);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.todos.map(({ id, text, completed }) => (
        <form className="todo" key={"todo-" + id}>
            <p>
                {completed ? "done:" : "todo"}
                <input type="text" defaultValue={text} />
                <button type="reset">Reset</button>
                <button
                    type="reset"
                    onClick={() => {
                        deleteTodo({ variables: { id: id } });
                    }}
                >
                    Delete
                </button>
            </p>
        </form>
    ));
}

function AddTodo() {
    let input;
    const [addTodo] = useMutation(ADD_TODO, {
        update(cache, { data: { addTodo } }) {
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
                required
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
