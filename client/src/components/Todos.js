import React from "react";
import "../App.css";
import ApolloClient from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import {
    GET_TODOS,
    UPDATE_TODO,
    TOGGLE_TODO,
    DELETE_TODO
} from "../TodoQueries.js";
import { 
    Button, 
    Checkbox, 
    TextField, 
    Grid, 
    Paper, 
    CircularProgress, 
    Divider 
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const client = new ApolloClient();

const useStyles = makeStyles(theme => ({

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
}));

// Lists the todos and their respective controlling structures
// Called from the app function
const Todos = () => {
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

export default Todos;