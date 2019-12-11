import { gql } from "apollo-boost";

export const GET_TODOS = gql`
    query GetTodos {
        todos {
            id
            text
            completed
        }
    }
`;

export const ADD_TODO = gql`
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

export const UPDATE_TODO = gql`
    mutation addTodo($id: String!, $text: String!) {
        updateTodo(id: $id, text: $text) {
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

export const TOGGLE_TODO = gql`
    mutation addTodo($id: String!) {
        toggleTodo(id: $id) {
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

export const DELETE_TODO = gql`
    mutation deleteTodo($id: ID!) {
        deleteTodo(id: $id) {
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