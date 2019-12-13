export const useStyles = makeStyles(theme => ({
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