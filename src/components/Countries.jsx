import React, { Component } from 'react';
import { Grid } from '@mui/material';
import { Box} from '@mui/system';
import Country from './Country';
import CountryModal from './CountryModal';

class Countries extends Component {
    medalsTemplate = [{name: "gold", count: 0, color: "gold"}, {name: "silver", count: 0, color: "silver"}, {name: "bronze", count: 0, color: "peru"}];

    state = { 
        countries: [
            {
                "name": "America",
                "medals": this.medalsTemplate.map(medal => {return {...medal}}),
            }
        ],
    } 

    addMedal = (countryName, medalName) => {
        let countries = this.state.countries;
        let targetCountry = countries.filter(country => country.name === countryName);
        if(targetCountry.length > 0){
            let newCountry = targetCountry[0];
            let targetMedal = newCountry.medals.filter(medal => medal.name === medalName);
            let targetMedalIndex = newCountry.medals.indexOf(targetMedal[0]);
            let countryIndex = countries.indexOf(targetCountry[0]);
            newCountry.medals[targetMedalIndex].count++;
            countries[countryIndex] = newCountry;
            this.setState({countries: countries});
        }
    }

    addCountry = (countryName) => {
        let sameNameCountries = this.state.countries.filter(country => country.name.toLowerCase() === countryName.toLowerCase());
        if(sameNameCountries.length < 1){
            let newCountry = {
                "name": countryName,
                "medals": this.medalsTemplate.map(medal => {return {...medal}}),
            }
    
            let newCountries = this.state.countries.concat([newCountry]);
            this.setState({countries: newCountries});
        }
    }

    render() { 
        let countries = this.state.countries;
        let countryMedals = countries.map((country) => {
            return (
                <Country key={country.name} name={country.name} medals={country.medals} addMedal={this.addMedal}></Country>
            )
        });

        return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2} marginTop = {0} padding={2} >
              {countryMedals}
            </Grid>
            <CountryModal addCountry = {this.addCountry}></CountryModal>
        </Box>
        );
    }
}
 
export default Countries;