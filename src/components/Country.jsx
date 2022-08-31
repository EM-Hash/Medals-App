import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Typography, Grid, Box, IconButton} from '@mui/material';
import React, { Component } from 'react';
import Medal from './Medal';

class Country extends Component {

    render() { 
        let country = this.props.country;

        let medalButtons = country.medals.map((medal) => {
            let upperMedalName = medal.name.slice(0,1).toUpperCase() + medal.name.slice(1);
            return (
            <Grid item xs={4} key={medal.name + "Medal"} mt={2}>
                <Medal medal={medal}></Medal>
                <Button key={medal.name + "ButtonPlus"} className={"add" + upperMedalName + "MedalButton"} onClick={() => {this.props.changeMedalNum(country.name, medal.name, 1)}} color="info" variant="contained" sx={{margin: 1}}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                <Button key={medal.name + "ButtonMinus"} className={"add" + upperMedalName + "MedalButton"} disabled={!medal.count > 0} onClick={() => {this.props.changeMedalNum(country.name, medal.name, -1)}} color="info" variant="contained" sx={{margin: 1}}>
                    <FontAwesomeIcon icon={faMinus} />
                </Button>
            </Grid>
            )
        })

        let totalMedal = {'name': 'all', color: 'secondary.light', 'count': country.medals.reduce((total, medal) => {return total + medal.count}, 0)};

        return (
            <Grid item xs={12} sm={6} padding={1}>
                <Box className="countryMedals"  sx={{bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '10px', 
                border: 3, borderColor: 'primary.light'}}>
                    <div className="countryHeader">
                        <Typography className="countryName" variant="h3" component="div" gutterBottom marginBottom={0}>
                            {country.name}
                        </Typography>
                        <IconButton sx={{color: 'white'}} className="trashIcon" onClick={() => {this.props.handleDelete(country)}}>
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </IconButton>
                    </div>
                    <Medal medal={totalMedal}></Medal>
                    <Grid container>
                        {medalButtons}
                    </Grid>
                </Box>
            </Grid>
        );
    }
}
 
export default Country;