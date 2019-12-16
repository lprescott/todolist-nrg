import { gql } from "apollo-boost";

export const GET_LISTS = gql`
    query GetLists {
        lists {
            id
            title
        }
    }
`;

export const ADD_LIST = gql`
    mutation addList($title: String!) {
        addList(title: $title) {
            code
            success
            message
            list {
                id
                title
            }
        }
    }
`;

export const UPDATE_LIST = gql`
    mutation updateList($id: ID!, $title: String!) {
        updateList(id: $id, title: $title) {
            code
            success
            message
            list {
                id
                title
            }
        }
    }
`;

export const DELETE_LIST = gql`
    mutation deleteList($id: ID!) {
        deleteList(id: $id) {
            code
            success
            message
            list {
                id
                title
            }
        }
    }
`;