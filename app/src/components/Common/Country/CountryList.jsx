import React from 'react';

import {
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Box,
    CircularProgress,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';

import { useTranslation } from 'react-i18next';

import FlagIcon from '../Flag/FlagIcon';

const ColorCircularProgress = withStyles({
    root: {
      color: '#6798e5',
    },
})(CircularProgress);

export default function CountryList(props) {
    
    const { t } = useTranslation();

    return (
        <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="space-around" 
            p={1}
            m={1}
        >
            <TextField 
                variant="outlined" 
                label={t('Search')} 
                placeholder={t('Search by name')} 
                value={props.search} 
                onChange={props.onSearch}
                disabled={props.loading}
                width="100%"
            />
            { props.loading ? 
                <ColorCircularProgress size={30} thickness={5} /> 
                : props.countries && !!props.countries.length ? 
                    <List style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        { props.countries
                            .filter(({name}) => (new RegExp(`.*${props.search}.*`, 'gi')).test(name))
                            .map((country, i) => 
                                <ListItem key={i}>
                                    <ListItemAvatar>
                                        <FlagIcon code={country.code} size="2x"/>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${country.index+1}º ${country.name}`} secondary={props.secondary(country)} />
                                </ListItem>
                        )}
                    </List>
                    : t('No Data')
            }
        </Box>
    );
}