import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, TextField} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/system';
import React, { Component } from 'react';

class CountryDialog extends Component {
    state = { 
        open: false,
        name: '',
    } 

    handleOpen = () => this.setState({open: true});
    handleClose = () => this.setState({open: false, name: ''});

    addCountry = () => {
        if(this.state.name){
            this.props.addCountry(this.state.name);
        } 
        this.handleClose();
    }

    handleChange = (event) => {
        let newName = event.target.value;
        this.setState({"name": newName});
    }

    render() { 
        return (
            <Container sx={{'display': 'flex', 'justifyContent': 'right'}}>
                <Fab color="info" size="large" onClick={this.handleOpen}><AddIcon /></Fab>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth={'md'} id="countryDialog">
                    <DialogTitle>Please Enter the Country's Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Country Name:</DialogContentText>
                        <TextField variant="outlined" color="secondary" margin="dense" fullWidth value={this.state.name} onChange={this.handleChange}></TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button color="error" variant="contained" onClick={this.handleClose}>Cancel</Button>
                        <Button color="success" variant="contained" disabled={this.state.name.trim() === ''} onClick={this.addCountry}>Add Country</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}
 
export default CountryDialog;