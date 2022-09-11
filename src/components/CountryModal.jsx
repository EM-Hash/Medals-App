import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, TextField} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/system';
import React from 'react';

const CountryDialog = ({addCountry}) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');


    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setName('');
    }

    const handleNewCountry = () => {
        if(name){
            addCountry(name);
        } 
        handleClose();
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