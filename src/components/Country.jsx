import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { Button, Typography, Grid, Box } from '@mui/material';
import React, { Component } from 'react';
import { Container } from '@mui/system';

class Country extends Component {

    state = {
        name: this.props.name,
        medals: this.props.medals,
    }

    render() { 
        let medals = this.state.medals.map((medal) => {
            return (
                <Container key={medal.name + "Medal"}>
                    <FontAwesomeIcon icon={faMedal} size="2x" style={{color: medal.color}}></FontAwesomeIcon>
                    <Typography className={medal.name + "Medals"} variant="h5" component="div">
                        {medal.count}
                    </Typography>
                </Container>
            )
        })
        let medalButtons = this.state.medals.map((medal) => {
            let upperMedalName = medal.name.slice(0,1).toUpperCase() + medal.name.slice(1);
            return (
                <Button key={medal.name + "Button"} className={"add" + upperMedalName + "MedalButton"} onClick={() => {this.props.addMedal(this.props.name, medal.name)}} color="info" variant="contained" sx={{margin: 1}}>
                    Add a {upperMedalName} Medal!
                </Button>
            )
        })

        return (
            <Grid item xs={12} sm={6} padding={1}>
                <Box className="countryMedals"  sx={{bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: '10px', 
                border: 3, borderColor: '#ba68c8'}}>
                    <Typography className="countryName" variant="h3" component="div" gutterBottom marginBottom={0}>
                        {this.state.name}
                    </Typography>
                    {medals}
                    {medalButtons}
                </Box>
            </Grid>
        );
    }
}
 
export default Country;