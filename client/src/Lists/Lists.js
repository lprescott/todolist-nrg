import React from "react";
import "./Lists.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import {
    GET_LISTS,
    ADD_LIST,
    UPDATE_LIST,
    DELETE_LIST
} from "./ListsQueries.js";
import { Button, TextField, Container, Grid, Paper, CircularProgress, Divider, ButtonGroup } from "@material-ui/core";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useStyles } from "./ListsStyles";
import TodoList from "../TodoList/TodoList";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

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

// Created the react component to add a new list
// Called from the app function
function AddList() {

    // Declare and define needed manipulation
    const [addList] = useMutation(ADD_LIST, {
        update(cache, { data: { addList } }) {
            const { lists } = client.readQuery({ query: GET_LISTS });
            client.writeQuery({
                query: GET_LISTS,
                data: { lists: lists.concat([addList.list]) }
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
                <Divider variant="fullWidth" className={classes.divider} />
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addList({
                            variables: {
                                title: e.currentTarget.elements.newList.value
                            }
                        }).then((response) => {
                            handleResponse(response.data.addList);
                        }).catch((error) => {
                            console.log('An unexpected error occurred: ' + error);
                        });

                        e.currentTarget.elements.newList.value = null;
                    }}
                >
                    <TextField
                        required
                        className={classes.newListInput}
                        id="newList"
                        label="A new list"
                        type="text"
                        name="newList"
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

// Lists the lists and their respective controlling structures
// Called from the app function
function ListofLists() {
    // Declare and define needed queries and manipulations
    const { loading, error, data } = useQuery(GET_LISTS);
    const [deleteList] = useMutation(DELETE_LIST, {
        update(cache, { data: { deleteList } }) {
            const { lists } = client.readQuery({ query: GET_LISTS });
            client.writeQuery({
                query: GET_LISTS,
                data: {
                    lists: lists.filter(list => {
                        if (list.id !== deleteList.list.id) return true;
                        else return false;
                    })
                }
            });
        }
    });
    const [updateList] = useMutation(UPDATE_LIST);

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
            text: 'Could not load lists.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    }

    // map queries data to JSX
    return data.lists.map(({ id, title }) => {

        return (
            <Grid item className={classes.card} key={"list-grid-item-" + id}>
                <Paper className={classes.paper}>
                    <form
                        key={"list-" + id}
                        onSubmit={e => {
                            e.preventDefault();
                            updateList({
                                variables: {
                                    id,
                                    title: e.currentTarget.elements.updateList.value
                                }
                            }).then((response) => {
                                handleResponse(response.data.updateList);
                            }).catch((error) => {
                                console.log('An unexpected error occurred: ' + error);
                            });
                        }}
                    >
                        <div>
                            <div className={classes.left}>
                                <Button variant="outlined" size="large" href={"/list/" + id}>  
                                    GoTo
                                </Button>
                                <span className={classes.right}>
                                    <ButtonGroup>
                                        <Button 
                                            type="reset"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            color="secondary"
                                            type="reset"
                                            size="large"
                                            onClick={() => {
                                                deleteList({ variables: { id: id } }).then((response) => {
                                                    handleResponse(response.data.deleteList);
                                                }).catch((error) => {
                                                    console.log('An unexpected error occurred: ' + error);
                                                });
                                            }}
                                        >
                                            Delete
                                </Button>
                                    </ButtonGroup>

                                </span>
                            </div>
                        </div>
                        <Divider variant="fullWidth" className={classes.divider} />
                        <div>
                            <TextField
                                required
                                variant="outlined"
                                size="small"
                                type="text"
                                defaultValue={title}
                                name="updateList"
                                autoComplete="off"
                                className={classes.listItemInput}
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

// The app that uses an apollo provider and the above AddList and
// Todo components
class Lists extends React.Component {

    render() {
        return (
            <Router>
                <Switch >
                    <Route exact path="/">
                        <ApolloProvider client={client} >
                            <Container maxWidth="sm" className="container">
                                <Grid className="root" container spacing={3}>
                                    <AddList />
                                    <ListofLists />
                                </Grid>
                            </Container>
                        </ApolloProvider>
                    </Route>
                    <Route path="/list/:id" component={TodoList}>
                    </Route>
                </Switch>
            </Router>
        );
    }

};

export default Lists;
