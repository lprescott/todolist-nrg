import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import "../index.css";
import ApolloClient from "apollo-boost";
import {
  LOGIN,
} from "./SigninQueries";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';

const client = new ApolloClient();

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: '14px 22px'
  },
}));

const cookies = new Cookies();

export default function SignIn() {

  const classes = useStyles();
  cookies.remove('user');
  
  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Button color="inherit" className="right" href="/">Login</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form id="login-form" className={classes.form} onSubmit={ (e) => {
            e.preventDefault();
            handleLogin(e)
            Swal.fire({
              title: 'Success',
              text: 'You will be logged in momentarily.',
              icon: 'success'
            }).then(
              document.getElementById("login-form").reset()
            );
          }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              type="username"
              autoComplete="off"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

function handleLogin(e) {

  let username = e.currentTarget.elements.username.value;
  let password = e.currentTarget.elements.password.value;

  client
    .query({
      query: LOGIN,
      variables: {
        username,
        password
      }
    })
    .then(result => {

      if (result.data.login.success === true) {
        
        cookies.set('user', result.data.login.user);
        window.location.href = "/user";
      } else {

        Swal.fire({
          title: 'Invalid Login Credentials',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      }

    }).catch(error => {
      console.log(error)
      Swal.fire({
        title: 'Error!',
        text: 'There was an unknown error while logging in.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    });
}