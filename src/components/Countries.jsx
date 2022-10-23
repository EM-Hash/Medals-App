import React, { useState, useEffect, useRef } from 'react';
import { Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Country from './Country';
import CountryModal from './CountryModal';
import Medal from './Medal';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import Login from './Login';

const Countries = () => {
    const apiEndpoint = "https://e-medals-api.azurewebsites.net/jwt/api/country";
    const hubEndpoint = "https://e-medals-api.azurewebsites.net/medalsHub";
    const usersEndpoint = "https://e-medals-api.azurewebsites.net/api/users/login";

    const [countries, setCountries] = useState([]);
    const [connection, setConnection] = useState(null);

    let latestCountries = useRef(null);
    // latestCountries.current is a ref variable to countries
    // this is needed to access state variable in useEffect w/o dependency
    latestCountries.current = countries;

    const [ user, setUser ] = useState(
        {
            name: null,
            canPost: false,
            canPatch: false,
            canDelete: false
        }
    );

    const medals = useRef([
        {id: 1, name: 'gold'},
        {id: 2, name: 'silver'},
        {id: 3, name: 'bronze'}
    ]);

    const getTopCountries = () => {
        //Sort by each country's score (described in getScore)
        //Make a new array that will have the ordered countries
        let topCountries = [];
        //For each country...
        for(let country of countries){
            //Get the medal count
            let score = getScore(country.gold.saved_value, country.silver.saved_value, country.bronze.saved_value);
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

    const getScore = (gold, silver, bronze) => {
        //Score based on the medals each country gained
        //Each medal has a weighted value
        let values = {"gold": 5, "silver": 3, "bronze": 1};
        let sum = 0;
        sum = (gold * values.gold) + (silver * values.silver) + (bronze * values.bronze);
        return sum;
    }

    const changeMedalNum = async (countryId, medalName, factor) => {
        const index = countries.findIndex(c => c.id === countryId);

        let newCountries = [...countries];

        newCountries[index][medalName].page_value += factor;
        setCountries(newCountries);
    }

    const handleSave = async (countryId) => {
        const index = countries.findIndex(country => country.id === countryId);
        let originalCountry = countries[index];
        let newCountries = [ ...countries ];
        let country = newCountries[index];
        let jsonPatch = [];

        medals.current.forEach((medal) => {
            if(country[medal.name].page_value !== country[medal.name].saved_value){
                jsonPatch.push({op: "replace", path: medal.name, value: country[medal.name].page_value});
                country[medal.name].saved_value = country[medal.name].page_value;
            }
        });

        setCountries(newCountries);

        if(isValidToken()){  
            try{
                await axios.patch(`${apiEndpoint}/${countryId}`, jsonPatch, {
                    headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (exception) {
                medals.current.forEach(medal => {
                    country[medal.name].page_value = originalCountry[medal.name].page_value;
                    country[medal.name].saved_value = originalCountry[medal.name].saved_value;
                });
                if(exception.response && exception.response.status === 404){
                    console.log("Error - this country does not exist in the records. It may have been deleted.");
                } else if(exception.response && (exception.response.status === 401 || exception.response.status === 403)) {
                    alert('You are not authorized to complete this request');
                    window.location.reload(false);
                } else if(exception.response) {
                    console.log(exception.response);
                } else {
                    alert('An error occurred while updating.');
                }
            }
        } else {
            medals.current.forEach(medal => {
                country[medal.name].page_value = originalCountry[medal.name].page_value;
                country[medal.name].saved_value = originalCountry[medal.name].saved_value;
            });
            alert("Your token has expired. Please log in again.");
        }

    }

    const handleReset = (countryId) => {
        const index = countries.findIndex(c => c.id === countryId);
        
        let newCountries = [...countries];
        let newCountry = countries[index];

        medals.current.forEach((medal) => {
            newCountry[medal.name].page_value = newCountry[medal.name].saved_value;
        });

        setCountries(newCountries);
    }

    const addCountry =  async (countryName) => {
        if(isValidToken()){
            let sameNameCountries = countries.filter(country => country.name.toLowerCase() === countryName.toLowerCase());
            if(sameNameCountries.length < 1){
                await axios.post(apiEndpoint, {
                    name: countryName
                  }, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  });
            } else {
                // eslint-disable-next-line no-throw-literal
                throw {"name": "Duplicate Names", message: `"${countryName}" is already registered.`}
            }
        } else {
            alert("Your token has expired. Please log in again.");
        }
    }

    const deleteCountry = async (country) => {
        if(isValidToken){
            const originalCountries = countries;
            setCountries(countries.filter(c => c.id !== country.id));
            try{
                await axios.delete(`${apiEndpoint}/${country.id}`, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (exception){
                if(exception.response && exception.response.status === 404){
                    //We don't want to set the countries back to the original set here, because that country shouldn't 
                    //Be in the set anyways
                    console.error("Error 404: Record could not be found.")
                } else {
                    setCountries(originalCountries);
                    if (exception.response && (exception.response.status === 401 || exception.response.status === 403)) {
                        alert("You are not authorized to complete this request");
                      } else if (exception.response) {
                        console.log(exception.response);
                      } else {
                        console.log("Request failed");
                      }
                }
            }
        } else {
            alert('Your token has expired. Please log in again.');
        }
    }

    const getTotalMedals = () => {
        let totalMedals = countries.reduce((total, country) => {
            let sum = country.gold.page_value + country.silver.page_value + country.bronze.page_value;
            return total + sum;
        }, 0);
        return totalMedals;
    }

    const isValidToken = () => {
        const encodedJwt = localStorage.getItem("token");
        // check for existing token
        if (encodedJwt) {
          const decodedJwt = jwtDecode(encodedJwt);
          const diff = Date.now() - (decodedJwt['exp'] * 1000);
          if (diff < 0) {
            console.log(`token expires in ${parseInt((diff * -1) / 60000)} minutes`);
            return true;
          } else {
            console.log(`token expired ${parseInt(diff / 60000)} minutes ago`);
            handleLogout();
          }
        }
        return false;
    }

    const getUser = (encodedJwt) => {
        //Return unencoded user/permissions
        const decodedJwt = jwtDecode(encodedJwt);
        const dateDiff = Date.now() - (decodedJwt["exp"] * 1000);
        if(dateDiff < 0){
            //Token not expired
            return {
                name: decodedJwt['username'],
                canPost: decodedJwt['roles'].indexOf('medals-post') === -1 ? false : true,
                canPatch: decodedJwt['roles'].indexOf('medals-patch') === -1 ? false : true,
                canDelete: decodedJwt['roles'].indexOf('medals-delete') === -1 ? false : true,
            };
        }
        //Token expired
        return {
            name: null,
            canPost: false,
            canPatch: false,
            canDelete: false,
        }
    }

    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post(usersEndpoint, {username: username, password: password});
            const encodedJwt = response.data.token;
            localStorage.setItem('token', encodedJwt);
            setUser(getUser(encodedJwt));
        } catch (ex) {
            if (ex.response && (ex.response.status === 401 || ex.response.status === 400 )) {
                alert("Login failed");
            } else if (ex.response) {
                console.log(ex.response);
            } else {
                console.log("Request failed");
            }
        }
    }

    const handleLogout = (e) => {
        e && e.preventDefault();
        console.log("logout");
        localStorage.removeItem('token');
        setUser({
            name: null,
            canPost: false,
            canPatch: false,
            canDelete: false
        });
        return false;
    }

    useEffect(() => {
        async function fetchData(){
            const {data : fetchedCountries} = await axios.get(apiEndpoint);
            let newCountries = [];
            fetchedCountries.forEach((country) => {
                let newCountry = {
                    id: country.id,
                    name: country.name,
                };
                medals.current.forEach((medal) => {
                    const count = country[medal.name];
                    newCountry[medal.name] = { page_value: count, saved_value: count, color: medal.color}
                });
                newCountries.push(newCountry);
            });
            setCountries(newCountries);
        }

        fetchData();

        const encodedJwt = localStorage.getItem("token");
        if(encodedJwt){
            setUser(getUser(encodedJwt));
        }

        //signalR
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubEndpoint)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if(connection){
            connection.start()
            .then(() => {
                console.log("Connected to Hub!");

                connection.on("RecieveAddMessage", (country) => {
                    console.log("Add: " + country.name);

                    let newCountry = {
                        id: country.id,
                        name: country.name,
                    };

                    medals.current.forEach(medal => {
                        const count = country[medal.name];
                        newCountry[medal.name] = {page_value: count, saved_value: count};
                    });

                    let newCountries = [...latestCountries.current];
                    newCountries = newCountries.concat(newCountry);
                    setCountries(newCountries);
                });

                connection.on("RecieveDeleteMessage", id => {
                    console.log("Delete country with id of " + id);

                    let newCountries = [...latestCountries.current];
                    newCountries = newCountries.filter(c => c.id !== id);
                    setCountries(newCountries);
                });

                connection.on("RecievePatchMessage", country => {
                    console.log("Patch " + country.name);
                    let updatedCountry = {
                        id: country.id,
                        name: country.name,
                    }

                    medals.current.forEach(medal => {
                        const count = country[medal.name];
                        updatedCountry[medal.name] = {page_value: count, saved_value: count};
                    });

                    let newCountries = [...latestCountries.current];
                    let index = newCountries.findIndex(c => c.id === country.id);
                    newCountries[index] = updatedCountry;

                    setCountries(newCountries);
                });
            })
            .catch((e) => {console.log("Connection failed", e)});
        }
    }, [connection]);

    let countryMedals = countries.map((country) => {
        return (
            <Country key={country.name} handleDelete={deleteCountry} country={country} canDelete={user.canDelete} canPatch={user.canPatch}
            changeMedalNum = {changeMedalNum} onSave = {handleSave} onReset = {handleReset}></Country>
        )
    });

    return (
        <Router>
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
                        {
                            //TODO: Make pretty(?)

                            user.name ? 
                            <span className="logOut"><a href="/" onClick={handleLogout} className = "logoutLink">Logout</a> [{user.name}]</span>
                            :
                            <Link to="/login" className="loginLink">Login</Link>
                        }
                    </Grid>
                    <Route exact path="/login">
                        <Login onLogin={handleLogin} />
                    </Route>
                    <Grid item xs={12} container spacing={2} marginTop = {0} padding={2} >
                        {countryMedals}
                    </Grid>
                </Grid>
                { user.canPost && <CountryModal addCountry = {addCountry}></CountryModal>}
            </Box>
        </Router>
    );
}
 
export default Countries;