import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { Component } from 'react';

class Medal extends Component {
    render() { 
        return (
            <Container sx={{color: this.props.medal.color}}>
                <FontAwesomeIcon icon={faMedal} size="xl" ></FontAwesomeIcon>
                <Typography className={this.props.medal.name + "Medals"} variant="h5" component="div">
                    {this.props.medal.count}
                </Typography>
            </Container>
        );
    }
}
 
export default Medal;