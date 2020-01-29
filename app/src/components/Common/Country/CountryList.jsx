import React from 'react';

import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@material-ui/core';

import FlagIcon from '../Flag/FlagIcon';

export default function CountryList(props) {

    return (
        <List style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {props.countries.map((country, i) => 
                <ListItem key={i}>
                    <ListItemAvatar>
                        { console.log(country) }
                        <FlagIcon code={country.code} size="2x"/>
                    </ListItemAvatar>
                    <ListItemText primary={`${i+1}º ${country.name}`} secondary={`${country.count} (${country.percentage}%)`} />
                </ListItem>
            )}
        </List>
    );
}