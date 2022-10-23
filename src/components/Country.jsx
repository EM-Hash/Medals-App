import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faMinus, faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { Button, Typography, Grid, Box, IconButton} from '@mui/material';
import React from 'react';
import Medal from './Medal';

const Country = ( {country, changeMedalNum, handleDelete, onSave, onReset, canDelete, canPatch} ) => {
    const medalColors = [
        {name: "all", color: "secondary.light"},
        {name: "gold", color: "gold"},
        {name: "silver", color: "silver"},
        {name: "bronze", color: "peru"}
    ]

    let medals = [
        {"name": "gold", "count": country.gold.page_value},
        {"name": "silver", "count": country.silver.page_value},
        {"name": "bronze", "count": country.bronze.page_value}
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
                {
                    (country[medal.name].page_value !== country[medal.name].saved_value ? 
                    <div className="unsaved medalContainer">
                        <Medal medal={medal}></Medal>
                    </div>
                     : 
                    <div className="medalContainer">
                        <Medal medal={medal}></Medal>
                    </div>)
                }
                {
                    canPatch && 
                    <React.Fragment>
                        <Button key={medal.name + "ButtonPlus"} className={"add" + upperName + "MedalButton"} 
                            onClick={() => {changeMedalNum(country.id, medal.name, 1)}} color="info" variant="contained" sx={{margin: 1}}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                        <Button key={medal.name + "ButtonMinus"} className={"add" + upperName + "MedalButton"} 
                        disabled={!medal.count > 0} onClick={() => {changeMedalNum(country.id, medal.name, -1)}} color="info" 
                        variant="contained" sx={{margin: 1}}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>
                    </React.Fragment>
                }
            </Grid>
        )
    });

    let totalMedal = {
        'name': 'all', 
        'count': (medals.reduce((total, medal) => {return total + medal.count}, 0)),
        'color': (getMedalColor("all"))
    };

    const renderSaveButton = () => {
        let unsaved = false;
        medals.forEach((medal) => {
            if(medal.count !== country[medal.name].saved_value){
                unsaved = true;
            }
        });
        return unsaved;
    }

    return (
        <Grid item xs={12} sm={6} padding={1}>
            <Box className="countryMedals"  sx={{bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '10px', 
            border: 3, borderColor: 'primary.light'}}>
                <div className="countryHeader">
                    <Typography className="countryName" variant="h3" component="div" gutterBottom marginBottom={0}>
                        {country.name}
                    </Typography>
                    {
                        renderSaveButton() &&
                        <React.Fragment>
                            <IconButton color="success" className="icon" onClick={() => onSave(country.id)}>
                                <FontAwesomeIcon icon={faFloppyDisk}></FontAwesomeIcon>
                            </IconButton>
                            <IconButton color="error" className="endIcon" onClick={() => onReset(country.id)}>
                                <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
                            </IconButton>
                        </React.Fragment> 
                    }
                    {
                        (!renderSaveButton() && canDelete) &&
                        <IconButton sx={{color: 'white'}} className="endIcon" onClick={() => {handleDelete(country)}}>
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </IconButton>
                    }
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