import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { 
    Container, 
    Grid, 
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';

const client = new ApolloClient();

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        paddingTop: "16px"
    }
}));

// The app that uses an apollo provider and the above AddTodo and
// Todo components
const App = () => {

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

export default App;
