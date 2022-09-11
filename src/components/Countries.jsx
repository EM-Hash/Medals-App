import React, { useState, useEffect } from 'react';
import { Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Country from './Country';
import CountryModal from './CountryModal';
import Medal from './Medal';

const Countries = () => {

    const medalsTemplate =[
        {name: "gold", count: 0, color: "gold"}, 
        {name: "silver", count: 0, color: "silver"}, 
        {name: "bronze", count: 0, color: "peru"}
    ]

    const [countries, setCountries] = useState([]);

    // const [countries, setCountries] = useState([{
    //     "name": "America",
    //     "medals": medalsTemplate.map(medal => {return {...medal}})
    // }]);

    const getTopCountries = () => {
        //Sort by each country's score (described in getScore)
        //Make a new array that will have the ordered countries
        let topCountries = [];
        //For each country...
        for(let country of countries){
            //Get the medal count
            let score = getScore(country.medals);
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
                <ListItem key={country.country}>
                    <ListItemText disableTypography>
                        <Typography sx={{fontSize: '1.5rem'}}>
                            {i+1}. {country.country}: {country.score} pts
                        </Typography>
                    </ListItemText>
                </ListItem>
            );
        }
        let list = (
            <List>
                {countryList.map((country) => {return country})}
            </List>
        )
        return list;
    }

    const getScore = (medals) => {
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

    const changeMedalNum = (countryName, medalName, quantity) => {
        let targetCountry = countries.filter(country => country.name === countryName);

        if(targetCountry.length > 0){
            let newCountry = targetCountry[0];

            let targetMedal = newCountry.medals.filter(medal => medal.name === medalName);
            let targetMedalIndex = newCountry.medals.indexOf(targetMedal[0]);
            let countryIndex = countries.indexOf(targetCountry[0]);

            let newCountries = countries.slice();

            newCountry.medals[targetMedalIndex].count += quantity;
            newCountries[countryIndex] = newCountry;
            setCountries(newCountries);
        }
    }

    const addCountry = (countryName) => {
        let sameNameCountries = countries.filter(country => country.name.toLowerCase() === countryName.toLowerCase());
        
        if(sameNameCountries.length < 1){
            let newCountry = {
                "name": countryName,
                "medals": medalsTemplate.map(medal => {return {...medal}})
            }
    
            let newCountries = countries.concat([newCountry]);
            setCountries(newCountries);
        }
    }

    const deleteCountry = (country) => {
        let newCountries = countries.slice();
        newCountries.splice(newCountries.indexOf(country),1);
        setCountries(newCountries);
    }

    const getTotalMedals = () => {
        let totalMedals = countries.reduce((total, country) => {
            let totalMedals = country.medals.reduce((medalSum, medal) => {
                return medalSum + medal.count;
            }, 0);
            return total + totalMedals;
        }, 0);
        return totalMedals;
    }

    useEffect(() => {
        const medalsTemplate =[
            {name: "gold", count: 0, color: "gold"}, 
            {name: "silver", count: 0, color: "silver"}, 
            {name: "bronze", count: 0, color: "peru"}
        ]

        let newCountries = [{
            "name": "America",
            "medals": medalsTemplate.map(medal => {return {...medal}})
        }];
        setCountries(newCountries);
    }, []);

    let countryMedals = countries.map((country) => {
        return (
            <Country key={country.name} handleDelete={deleteCountry} country={country} changeMedalNum = {changeMedalNum}></Country>
        )
    });

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container justifyContent="center">
                <Grid item xs={12} container>
                    <Paper sx={{mt: 1, mx: 10, width:'100%', bgcolor:'secondary.main', borderRadius:'10px', border: 3,
                        borderColor: 'secondary.dark'}}>
                        <Typography color="primary.main" variant="h3">Olympic Medals</Typography>
                        <Medal medal={{"name": "all", "count": getTotalMedals(), "color": "primary.main"}}></Medal>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{pb: 1, px: 10, mt: 1, mx: 2, bgcolor:'secondary.dark', borderRadius:'10px', border: 3,
                    borderColor: 'secondary.main', color: 'primary.main'}}>
                        <Typography variant="h4">Top Countries:</Typography>
                        {getTopCountries()}
                    </Paper>
                </Grid>
                <Grid item xs={12} container spacing={2} marginTop = {0} padding={2} >
                    {countryMedals}
                </Grid>
            </Grid>
            <CountryModal addCountry = {addCountry}></CountryModal>
        </Box>
    );
}
 
export default Countries;