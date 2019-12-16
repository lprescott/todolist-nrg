import React from "react";
import "./TodoList.css";
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

const client = new ApolloClient();

function handleResponse(response) {
    if (response.success === true) {
        console.log('success');
    } else {
        console.log('error');
    }
    console.log(response);
}

// Created the react component to add a new todo
// Called from the app function
function AddTodo() {

    // Declare and define needed manipulation
    const [addTodo] = useMutation(ADD_TODO, {
        update(cache, { data: { addTodo } }) {
            const { todos } = client.readQuery({ query: GET_TODOS });
            client.writeQuery({
                query: GET_TODOS,
                data: { todos: todos.concat([addTodo.todo]) }
            });
        }
    });

    // get styles from above useStyles method
    const classes = useStyles();

    // map to JSX
    return (
        <Grid item className={classes.card}>
            <Paper className={classes.paper}>
                <h2>
                    A Todolist in the eNeRGy stack.{" "}
                    <span aria-label="rocket-emoji" role="img">
                        🚀
                    </span>
                </h2>
                <h4>Node.js, React.js and GraphQL</h4>
                <p>Material-UI, Apollo, Knex and PostgresQL</p>
                <Divider variant="fullWidth" className={classes.divider}/>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addTodo({
                            variables: {
                                text: e.currentTarget.elements.newTodo.value
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
    // Declare and define needed queries and manipulations
    const { loading, error, data } = useQuery(GET_TODOS);
    const [deleteTodo] = useMutation(DELETE_TODO, {
        update(cache, { data: { deleteTodo } }) {
            const { todos } = client.readQuery({ query: GET_TODOS });
            client.writeQuery({
                query: GET_TODOS,
                data: {
                    todos: todos.filter(todo => {
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
    return data.todos.map(({ id, text, completed }) => {

        return (
            <Grid item className={classes.card}  key={"todo-grid-item-" + id}>
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
                                <Button type="reset" size="large">
                                    reset
                                </Button>
                                <span className={classes.right}>
                                    <Button
                                        color="secondary"
                                        type="reset"
                                        size="large"
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
                        <Divider variant="fullWidth" className={classes.divider}/>
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
                <Container maxWidth="sm" className="container">
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
