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
import { Button, Checkbox, TextField, Container, ButtonGroup, Grid, Paper, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const client = new ApolloClient();

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    item: {
        flexGrow: "inherit",
    },
    loading: {
        position: "absolute",
        left: "50%",
        top: "250px",
    }
}));

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
            <Grid className={classes.item} item key={"todo-grid-item-" + id}>
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
                            });
                        }}
                    >

                        <ButtonGroup size="large">
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                                </Button>
                            <Button variant="contained" type="reset">
                                Reset
                                </Button>
                            <Button
                                color="secondary"
                                variant="contained"
                                type="reset"
                                onClick={() => {
                                    deleteTodo({ variables: { id: id } });
                                }}
                            >
                                Delete
                                </Button>
                        </ButtonGroup>

                        <div>
                            <Checkbox
                                checked={completed}
                                onChange={e => {
                                    e.preventDefault();
                                    toggleTodo({ variables: { id } });
                                }}
                            />
                            <TextField
                                required
                                variant="outlined"
                                size="small"
                                className={completed ? "text-strike" : null}
                                type="text"
                                defaultValue={text}
                                name="updateTodo"
                                autoComplete="off"
                            />
                        </div>
                    </form>
                </Paper>
            </Grid>
        );
    });
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
        <Grid className={classes.item} item>
            <Paper className={classes.paper}>
                <h2>
                    A Todolist in the eNeRGy stack.{" "}
                    <span aria-label="rocket-emoji" role="img">
                        🚀
                    </span>
                </h2>
                <p>Node.js, React.js and GraphQL</p>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addTodo({
                            variables: {
                                text: e.currentTarget.elements.newTodo.value
                            }
                        });
                    }}
                >
                    <TextField
                        required
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

// The app that uses an apollo provider and the above AddTodo and
// Todo components
const App = () => {

    // get styles from above useStyles method
    const classes = useStyles();

    return (
        <ApolloProvider client={client} >
            <Container maxWidth="sm">
                <Grid className={classes.root} container spacing={3}>
                    <AddTodo />
                    <Todos />
                </Grid>
            </Container>
        </ApolloProvider>
    );
};

export default App;
