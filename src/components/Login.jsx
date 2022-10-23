import { Button, Paper, TextField } from '@mui/material';
import { Container} from '@mui/system';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

function Login(props) {
    const { onLogin } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit');
        onLogin(username, password);
        history.push("/");
    }

    const handleCancel = () => {
        history.push("/");
    }

    return ( 
        <Paper className="loginForm">
            <form>
                <div>
                    <label htmlFor="username">Username: </label><br />
                    <TextField onChange={ (e) => setUsername(e.target.value) } value={username} 
                        autoFocus type="text" name="username" id="username" placeholder="Username" 
                        variant="outlined" color="primary" 
                        sx={{
                            bgcolor: "#64B5F6",
                            borderRadius: "5px",
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password: </label><br />
                    <TextField onChange={ (e) => setPassword(e.target.value) } value={password} type="password" 
                        name="password" id="password" placeholder="Password" 
                        variant="outlined" color="primary"
                        sx={{
                            bgcolor: "#64B5F6",
                            borderRadius: "5px",
                        }}
                    />
                </div>
                <Container sx={{display: "flex", justifyContent: "space-around", marginTop: "1rem"}}>
                    <Button disabled={username.length === 0 || password.length === 0} onClick={handleSubmit} type="submit"
                        variant="contained" color="primary">
                        Submit
                    </Button> 
                    <Button onClick={handleCancel} type="button" variant="contained" color="warning">
                        Cancel
                    </Button>
                </Container>
            </form>
        </Paper>
     );
}

export default Login;