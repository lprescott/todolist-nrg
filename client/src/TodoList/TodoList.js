import React from "react";
import "./TodoList.css";
import "../index.css";
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
} from "./TodoListQueries.js";
import { Button, Checkbox, TextField, Container, Grid, Paper, CircularProgress, Divider } from "@material-ui/core";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useStyles } from "./TodoListStyles";
import {
    useParams
} from "react-router-dom";
import gql from 'graphql-tag';

const client = new ApolloClient();

// Logs success, or shows error to user by alert
function handleResponse(response) {
    if (response.success === true) {
        console.log(response.message);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    }

}

// Created the react component to add a new todo
// Called from the app function
function AddTodo() {

    let { lid } = useParams();
    let title;

    const GET_LIST = gql`
        query list($id: ID!) {
            list(id: $id) {
                id
                title
            }
        }
    `;

    const { loading, error, data } = useQuery(GET_LIST, {
        variables: {
            id: lid,
        },
    });

    if (loading) {

        title = "loading...";
    } else if (error) {

        Swal.fire({
            title: 'Error!',
            text: 'There was an error retrieving the title.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    } else {

        title = data.list.title;
    }

    // Declare and define needed manipulation
    const [addTodo] = useMutation(ADD_TODO, {
        update(cache, { data: { addTodo } }) {
            const { todolist } = client.readQuery({ query: GET_TODOS, variables: { list_id: lid } });
            client.writeQuery({
                query: GET_TODOS,
                variables: { list_id: lid },
                data: { todolist: todolist.concat([addTodo.todo]) }
            });
        }
    });

    // get styles from above useStyles method
    const classes = useStyles();

    // map to JSX
    return (
        <Grid item className={classes.cardNew}>
            <Paper className={classes.paper}>
                <h2>
                    {title + " "}
                </h2>
                <Divider variant="fullWidth" className={classes.divider} />
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addTodo({
                            variables: {
                                text: e.currentTarget.elements.newTodo.value,
                                list_id: lid,
                            }
                        }).then((response) => {
                            handleResponse(response.data.addTodo);
                        }).catch((error) => {
                            console.log('An unexpected error occurred: ' + error);
                        });

                        e.currentTarget.elements.newTodo.value = null;
                    }}
                >
                    <TextField
                        required
                        className={classes.newTodoInput}
                        id="newTodo"
                        label="A new task"
                        type="text"
                        name="newTodo"
                        variant="outlined"
                        size="small"
                        autoComplete="off"
                    />
                    <Button size="large" variant="contained" type="submit" color="primary">
                        Submit
                    </Button>
                </form>
            </Paper>
        </Grid>
    );
}

// Lists the todos and their respective controlling structures
// Called from the app function
function Todos() {

    let { lid } = useParams();

    // Declare and define needed queries and manipulations
    const { loading, error, data } = useQuery(GET_TODOS, {
        variables: {
            list_id: lid,
        },
    });


    const [deleteTodo] = useMutation(DELETE_TODO, {
        update(cache, { data: { deleteTodo } }) {
            const { todolist } = client.readQuery({ query: GET_TODOS, variables: { list_id: lid } });
            client.writeQuery({
                query: GET_TODOS,
                variables: { list_id: lid },
                data: {
                    todolist: todolist.filter(todo => {
                        if (todo.id !== deleteTodo.todo.id) return true;
                        else return false;
                    })
                }
            });
        }
    });

    const [updateTodo] = useMutation(UPDATE_TODO);
    const [toggleTodo] = useMutation(TOGGLE_TODO);

    // get styles from above useStyles method
    const classes = useStyles();
    const MySwal = withReactContent(Swal);

    // Catch loading and error on query
    if (loading) {
        return (
            <div className={classes.loading}>
                <CircularProgress />
            </div>
        )
    }
    if (error) {
        MySwal.fire({
            title: 'Error!',
            text: 'Could not load todos',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    }

    // map queries data to JSX
    return data.todolist.map(({ id, text, completed }) => {

        return (
            <Grid item className={classes.cardItem} key={"todo-grid-item-" + id}>
                <Paper className={classes.paper}>
                    <form
                        key={"todo-" + id}
                        onSubmit={e => {
                            e.preventDefault();
                            updateTodo({
                                variables: {
                                    id,
                                    text: e.currentTarget.elements.updateTodo.value
                                }
                            }).then((response) => {
                                handleResponse(response.data.updateTodo);
                            }).catch((error) => {
                                console.log('An unexpected error occurred: ' + error);
                            });
                        }}
                    >
                        <div>
                            <div className={classes.left}>
                                <Button type="reset" size="large" variant="outlined">
                                    reset
                                </Button>
                                <span className={classes.right}>
                                    <Button
                                        color="secondary"
                                        type="reset"
                                        size="large"
                                        variant="outlined"
                                        onClick={() => {
                                            deleteTodo({ variables: { id: id } }).then((response) => {
                                                handleResponse(response.data.deleteTodo);
                                            }).catch((error) => {
                                                console.log('An unexpected error occurred: ' + error);
                                            });
                                        }}
                                    >
                                        Delete
                                </Button>
                                </span>
                            </div>
                        </div>
                        <Divider variant="fullWidth" className={classes.divider} />
                        <div>
                            <Checkbox
                                checked={completed}
                                onChange={e => {
                                    e.preventDefault();
                                    toggleTodo({ variables: { id } }).then((response) => {
                                        handleResponse(response.data.toggleTodo);
                                    }).catch((error) => {
                                        console.log('An unexpected error occurred: ' + error);
                                    });
                                }}
                            />
                            <TextField
                                required
                                variant="outlined"
                                size="small"
                                className={`${classes.todoItemInput} ${completed ? 'text-strike' : ''}`}
                                type="text"
                                defaultValue={text}
                                name="updateTodo"
                                autoComplete="off"
                            />
                            <Button variant="contained" color="primary" type="submit" size="large">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Paper>
            </Grid>
        );
    });
}

// The app that uses an apollo provider and the above AddTodo and
// Todo components
class TodoList extends React.Component {

    render() {
        return (
            <ApolloProvider client={client} >
                <Container className="container">
                    <Grid className="root" container spacing={3}>
                        <AddTodo />
                        <Todos />
                    </Grid>
                </Container>
            </ApolloProvider>
        );
    }

};

export default TodoList;
