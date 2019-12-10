import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Todos from './components/Todos';
import Header from './components/layout/Header';
import AddTodo from './components/AddTodo';
import About from './components/pages/About';
import uuid from 'uuid';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';

import './App.css';

const GET_TODOS = gql`
    {
        todos {
            id
            text
            completed
        }
    }
`;

class App extends Component {
    state = {
        todos: [],
    };

    componentDidMount() {
        // TODO: get todos from server here
        const client = new ApolloClient();

        client
            .query({
                query: GET_TODOS,
            })
            .then(result => this.setState({ todos: result.data.todos }));
    }

    // Toggle Completed
    toggleComplete = id => {
        // TODO: toggleComplete to graphQL

        // toggleComplete to UI
        this.setState({
            todos: this.state.todos.map(todo => {
                if (todo.id === id) {
                    todo.completed = !todo.completed;
                }
                return todo;
            }),
        });
    };

    deleteTodo = id => {
        // TODO: deleteTodo to graphQL

        // deleteTodo to UI
        this.setState({
            todos: this.state.todos.filter(todo => todo.id !== id),
        });
    };

    updateTodo = (id, text) => {
        // TODO: updateTodo to graphQL

        // updateTodo to UI
        this.setState({
            todos: this.state.todos.map(todo => {
                if (todo.id === id) {
                    todo.text = text;
                }
                return todo;
            }),
        });
    };

    addTodo = text => {
        // TODO: addTodo to graphQL

        // addTodo to UI
        const newTodo = {
            id: uuid.v4(),
            text,
            completed: false,
        };
        // usage of the spread operator to copy initial state
        this.setState({ todos: [...this.state.todos, newTodo] });
    };

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="container">
                        <Header />
                        <Route
                            exact
                            path="/"
                            render={props => (
                                <React.Fragment>
                                    <AddTodo addTodo={this.addTodo} />
                                    <Todos
                                        todos={this.state.todos}
                                        toggleComplete={this.toggleComplete}
                                        deleteTodo={this.deleteTodo}
                                        updateTodo={this.updateTodo}
                                    />
                                </React.Fragment>
                            )}
                        />
                        <Route path="/about" component={About} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
