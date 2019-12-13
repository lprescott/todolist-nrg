import React from "react";
import "../App.css";
import ApolloClient from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import {
    GET_TODOS,
    ADD_TODO,
} from "../TodoQueries.js";
import { 
    Button, 
    TextField, 
    Grid, 
    Paper, 
    Divider 
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


const client = new ApolloClient();

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center'
    },
    card: {
        flexGrow: "inherit",
    },
    newTodoInput: {
        width: "calc(100% - 118px)",
        paddingRight: "16px",
    },
    divider: {
        marginBottom: "16px",
        marginTop: "16px",
        marginLeft: "-16px",
        marginRight: "-16px"
    },
}));

// Created the react component to add a new todo
// Called from the app function
const AddTodo = () => {

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

export default AddTodo;