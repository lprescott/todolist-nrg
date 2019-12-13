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
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const client = new ApolloClient();

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center'
    },
    card: {
        flexGrow: "inherit",
    },
    loading: {
        position: "absolute",
        left: "50%",
        top: "250px",
    },
    newTodoInput: {
        width: "calc(100% - 118px)",
        paddingRight: "16px",
    },
    todoItemInput: {
        width: "calc(100% - 176px)",
        paddingRight: "16px",
        paddingLeft: "16px",
    },
    left: {
        textAlign: "left",
    },
    right: {
        float: "right",
    },
    divider: {
        marginBottom: "16px",
        marginTop: "16px",
        marginLeft: "-16px",
        marginRight: "-16px"
    },
    container: {
        paddingTop: "16px"
    }
}));

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
                                            deleteTodo({ variables: { id: id } });
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
                                    toggleTodo({ variables: { id } });
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
const TodoList = () => {

    // get styles from above useStyles method
    const classes = useStyles();

    return (
        <ApolloProvider client={client} >
            <Container maxWidth="sm" className={classes.container}>
                <Grid className={classes.root} container spacing={3}>
                    <AddTodo />
                    <Todos />
                </Grid>
            </Container>
        </ApolloProvider>
    );
};

export default TodoList;
