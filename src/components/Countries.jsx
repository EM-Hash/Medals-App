import React, { useState, useEffect } from 'react';
import { Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import Country from './Country';
import CountryModal from './CountryModal';
import Medal from './Medal';

const Countries = () => {
    const apiEndpoint = "https://localhost:5001/api/country";

    const [countries, setCountries] = useState([]);

    const getTopCountries = () => {
        //Sort by each country's score (described in getScore)
        //Make a new array that will have the ordered countries
        let topCountries = [];
        //For each country...
        for(let country of countries){
            //Get the medal count
            let score = getScore(country);
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

    const getScore = (country) => {
        //Score based on the medals each country gained
        //Each medal has a weighted value
        let values = {"gold": 5, "silver": 3, "bronze": 1};
        let sum = 0;
        sum = (country.goldMedalCount * values.gold) + (country.silverMedalCount * values.silver) + (country.bronzeMedalCount * values.bronze);
        return sum;
    }

    const changeMedalNum = (countryName, medalName, quantity) => {
        // let targetCountry = countries.filter(country => country.name === countryName);

        // if(targetCountry.length > 0){
        //     let newCountry = targetCountry[0];

        //     let targetMedal = newCountry.medals.filter(medal => medal.name === medalName);
        //     let targetMedalIndex = newCountry.medals.indexOf(targetMedal[0]);
        //     let countryIndex = countries.indexOf(targetCountry[0]);

        //     let newCountries = countries.slice();

        //     newCountry.medals[targetMedalIndex].count += quantity;
        //     newCountries[countryIndex] = newCountry;
        //     setCountries(newCountries);
        // }
    }

    const addCountry =  async (countryName) => {
        let sameNameCountries = countries.filter(country => country.name.toLowerCase() === countryName.toLowerCase());
        if(sameNameCountries.length < 1){
            let newCountry = {
                "name": countryName,
                "goldMedalCount": 0,
                "silverMedalCount": 0,
                "bronzeMedalCount": 0
            }
    
            const {data : post} = await axios.post(apiEndpoint, newCountry);
            setCountries(countries.concat(post));
        } else {
            // eslint-disable-next-line no-throw-literal
            throw {"name": "Duplicate Names", message: `"${countryName}" is already registered.`}
        }
    }

    const deleteCountry = async (country) => {
        const originalCountries = countries;
        setCountries(countries.filter(c => c.id !== country.id));
        try{
            await axios.delete(`${apiEndpoint}/${country.id}`);
        } catch (exception){
            if(exception.response && exception.response.status === 404){
                //We don't want to set the countries back to the original set here, because that country shouldn't 
                //Be in the set anyways
                console.error("Error 404: Record could not be found.")
            } else {
                setCountries(originalCountries);
                console.error("An error occured during your request: ", exception.name, exception.message);
            }
        }
        
        // let newCountries = countries.slice();
        // newCountries.splice(newCountries.indexOf(country),1);
        // setCountries(newCountries);
    }

    const getTotalMedals = () => {
        let totalMedals = countries.reduce((total, country) => {
            let sum = country.goldMedalCount + country.silverMedalCount + country.bronzeMedalCount;
            return total + sum;
        }, 0);
        return totalMedals;
    }

    useEffect(() => {
        async function fetchData(){
            const {data : fetchedCountries} = await axios.get(apiEndpoint);
            setCountries(fetchedCountries);
        }

        fetchData();
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