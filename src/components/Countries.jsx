import React, { Component } from 'react';
import { Grid, Paper } from '@mui/material';
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

    getTopCountries = () => {
        //Sort by each country's score (described in getScore)
        //Make a new array that will have the ordered countries
        let topCountries = [];
        //For each country...
        for(let country of this.state.countries){
            //Get the medal count
            let score = this.getScore(country.medals);
            //Create a new object w/ the name and total medal count
            let newCountry = {"country": country.name, "score": score};
            //Add the new object to the countries
            topCountries = topCountries.concat([newCountry,]);
        }
        //Sort the countries by score (descending)
        topCountries.sort((a, b) => {
            return a.score > b.score ? -1 : 1;
        });
        //For the top three countries...
        let length = topCountries.length < 3 ? topCountries.length : 3;
        let countryList = [];
        for(let i = 0; i < length; i++){
            let country = topCountries[i];
            //List the country and its score
            countryList[i] = (
                <li key={country.country}>
                    {country.country}: {country.score} pts
                </li>
            );
        }
        let list = (
            <ol>
                {countryList.map((country) => {return country})}
            </ol>
        )
        return list;
    }

    getScore = (medals) => {
        //Score based on the medals each country gained
        //Each medal has a weighted value
        let values = {"gold": 5, "silver": 3, "bronze": 1};
        let sum = 0;
        //For each tier of medal...
        medals.map(medal => {
            //Calculate the points earned
            let points = values[medal.name] * medal.count;
            //Add it to the sum of total points
            sum += points;
            return sum;
        });
        return sum;
    }

    changeMedalNum = (countryName, medalName, quantity) => {
        let countries = this.state.countries;
        let targetCountry = countries.filter(country => country.name === countryName);
        if(targetCountry.length > 0){
            let newCountry = targetCountry[0];
            let targetMedal = newCountry.medals.filter(medal => medal.name === medalName);
            let targetMedalIndex = newCountry.medals.indexOf(targetMedal[0]);
            let countryIndex = countries.indexOf(targetCountry[0]);
            newCountry.medals[targetMedalIndex].count += quantity;
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
                <Country key={country.name} name={country.name} medals={country.medals} changeMedalNum = {this.changeMedalNum}></Country>
            )
        });
        return (
        <Box sx={{flexGrow: 1}}>
            <Grid container justifyContent="center">
                <Grid item xs={6}>
                    <Paper sx={{pb: 1, px: 10, mt: 1}}>
                        <h2>Top Countries: </h2>
                        {this.getTopCountries()}
                    </Paper>
                </Grid>
                <Grid item xs={12} container spacing={2} marginTop = {0} padding={2} >
                    {countryMedals}
                </Grid>
            </Grid>
            <CountryModal addCountry = {this.addCountry}></CountryModal>
        </Box>
        );
    }
}
 
export default Countries;