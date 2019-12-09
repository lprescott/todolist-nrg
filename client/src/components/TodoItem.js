import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class TodoItem extends Component {
    // determine if text should be strike-through
    getStyle = () => {
        return {
            textDecoration: this.props.todo.completed ? 'line-through' : 'none',
        };
    };

    render() {
        const { id, text, completed } = this.props.todo;
        return (
            <div style={todoItemStyle}>
                <p>
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={this.props.toggleComplete.bind(this, id)}
                    />
                    <input
                        style={this.getStyle()}
                        className="item"
                        type="text"
                        name="text"
                        onChange={event =>
                            this.props.updateTodo(id, event.target.value)
                        }
                        defaultValue={text}
                    />
                    <button
                        onClick={this.props.deleteTodo.bind(this, id)}
                        style={btnStyle}
                    >
                        x
                    </button>
                </p>
            </div>
        );
    }
}

// PropTypes
TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    toggleComplete: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
};

const btnStyle = {
    background: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '50%',
    cursor: 'pointer',
    float: 'right',
};

const todoItemStyle = {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderBottom: '1px #ccc dotted',
};

export default TodoItem;
