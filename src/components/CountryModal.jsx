import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, TextField, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/system';
import React, { useState } from 'react';

const CountryDialog = ({addCountry}) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setName('');
        setErrorMessage('');
        setIsValidName(true);
    }

    const handleNewCountry = async () => {
        if(name){
            try{
                await addCountry(name);
                handleClose();
            } catch (exception){
                setIsValidName(false);
                let errorMessage = (<span><b>Error - {exception.name}:</b> {exception.message}</span>);
                console.log(errorMessage);
                setErrorMessage(errorMessage);
            }
        }
    }

    const handleChange = (event) => {
        let newName = event.target.value;
        setName(newName);
    }

    return (
        <Container sx={{'display': 'flex', 'justifyContent': 'right'}}>
            <Fab color="info" size="large" onClick={handleOpen}><AddIcon /></Fab>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'} id="countryDialog">
                <DialogTitle>Please Enter the Country's Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>Country Name:</DialogContentText>
                    <TextField variant="outlined" color="secondary" margin="dense" fullWidth value={name} 
                    onChange={handleChange}></TextField>
                    <Typography  id="errorText" hidden={isValidName} style={{'color': '#ff6f00', 'font-size': '1.2rem'}}>{errorMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={handleClose}>Cancel</Button>
                    <Button color="success" variant="contained" disabled={name.trim() === ''} onClick={handleNewCountry}>
                        Add Country
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
 
export default CountryDialog;