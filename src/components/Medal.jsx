import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';

const Medal = ({ medal }) => {
    return (
        <Container sx={{color: medal.color}}>
            <FontAwesomeIcon icon={faMedal} size="xl" ></FontAwesomeIcon>
            <Typography className={medal.name + "Medals"} variant="h5" component="div">
                {medal.count}
            </Typography>
        </Container>
    );
}
 
export default Medal;