import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Typography, Grid, Box, IconButton} from '@mui/material';
import React from 'react';
import Medal from './Medal';

const Country = ( {country, changeMedalNum, handleDelete} ) => {
    const medalColors = [
        {name: "all", color: "secondary.light"},
        {name: "gold", color: "gold"},
        {name: "silver", color: "silver"},
        {name: "bronze", color: "peru"}
    ]

    let medals = [
        {"name": "gold", "count": country.goldMedalCount},
        {"name": "silver", "count": country.silverMedalCount},
        {"name": "bronze", "count": country.bronzeMedalCount}
    ];

    let getMedalColor = (medalName) => {
        let color = medalColors.filter((medal) => {
            return medal.name === medalName;
        });
        return color.length > 0 ? color[0].color : 'black';
    }

    //Takes in an array of medals, and returns a component w/ buttons for each medal
    let medalButtons = medals.map((medal) => {
        medal.color = getMedalColor(medal.name);
        let upperName = medal.name.slice(0,1).toUpperCase() + medal.name.slice(1);
        return(
            <Grid item xs={4} key={medal.name + "Medal"} mt={2}>
                <Medal medal={medal}></Medal>
                <Button key={medal.name + "ButtonPlus"} className={"add" + upperName + "MedalButton"} 
                    onClick={() => {changeMedalNum(country.name, medal.name, 1)}} color="info" variant="contained" sx={{margin: 1}}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                <Button key={medal.name + "ButtonMinus"} className={"add" + upperName + "MedalButton"} 
                disabled={!medal.count > 0} onClick={() => {changeMedalNum(country.name, medal.name, -1)}} color="info" 
                variant="contained" sx={{margin: 1}}>
                    <FontAwesomeIcon icon={faMinus} />
                </Button>
            </Grid>
        )
    });

    let totalMedal = {
        'name': 'all', 
        'count': (country.goldMedalCount + country.silverMedalCount + country.bronzeMedalCount),
        'color': (getMedalColor("all"))
    };

    return (
        <Grid item xs={12} sm={6} padding={1}>
            <Box className="countryMedals"  sx={{bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '10px', 
            border: 3, borderColor: 'primary.light'}}>
                <div className="countryHeader">
                    <Typography className="countryName" variant="h3" component="div" gutterBottom marginBottom={0}>
                        {country.name}
                    </Typography>
                    <IconButton sx={{color: 'white'}} className="trashIcon" onClick={() => {handleDelete(country)}}>
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
 
export default Country;