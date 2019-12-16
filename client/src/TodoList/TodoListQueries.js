import { gql } from "apollo-boost";

export const GET_TODOS = gql`
    query GetTodos($list_id: ID!) {
        todolist(list_id: $list_id) {
            id
            text
            completed
            list_id
        }
    }
`;

export const ADD_TODO = gql`
    mutation addTodo($text: String!, $list_id: ID!) {
        addTodo(text: $text, list_id: $list_id) {
            code
            success
            message
            todo {
                id
                text
                completed
                list_id
            }
        }
    }
`;

export const UPDATE_TODO = gql`
    mutation addTodo($id: ID!, $text: String!) {
        updateTodo(id: $id, text: $text) {
            code
            success
            message
            todo {
                id
                text
                completed
                list_id
            }
        }
    }
`;

export const TOGGLE_TODO = gql`
    mutation addTodo($id: ID!) {
        toggleTodo(id: $id) {
            code
            success
            message
            todo {
                id
                text
                completed
                list_id
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
                list_id
            }
        }
    }
`;