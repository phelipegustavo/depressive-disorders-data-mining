import React from 'react';
import './style.css';

import {
    TextField,
    List,
    ListItem,
    ListItemText,
    Box,
    CircularProgress,
    LinearProgress,
    Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';

import { Trans, useTranslation } from 'react-i18next';

const ColorCircularProgress = withStyles({
    root: {
      color: '#6798e5',
    },
})(CircularProgress);

const ColorLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor: '#eef3fd',
    },
    barColorPrimary: {
      backgroundColor: '#6798e5',
    },
})(LinearProgress);

export default function InfiniteScroll(props) {
    
    const { t } = useTranslation();
    

    return (
        <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="start" 
            p={1}
            height="100%"
            style={props.style}
        >
            { props.title && 
                <Typography gutterBottom variant="h5" component="h5">
                    <Trans i18nKey={props.title}/> 
                </Typography>
            }
            <TextField 
                variant="outlined" 
                label={t('Search')} 
                placeholder={t('Search by name')} 
                value={props.search} 
                onChange={props.onSearch}
                disabled={!!props.isLoading}
                style={{marginBottom: '5px', width: '100%'}}
            />
            <div style={{display: 'flex', flexGrow: 1, alignItems: !!props.items.length && !props.isLoading ? 'start' : 'center', justifyContent: 'center', width: '100%'}}>
            { props.isLoading === 'NO_DATA' || props.isLoading === true ? 
                <ColorCircularProgress size={50} thickness={5} /> 
                : props.items && !!props.items.length ? 
                    <List className="scroll" component="ul" style={{ maxHeight: props.height ? props.height : '350px', overflowY: 'auto',  width: '100%' }} onScroll={props.onScroll}>
                        { props.items
                            .map((item, i) => 
                                <ListItem 
                                    key={i}
                                    button 
                                    selected={!!props.selected && props.selected(item, i)} 
                                    onClick={(e) => props.onSelect ? props.onSelect(e, item) : undefined}
                                >
                                    { !!props.avatar && props.avatar(item, i) }
                                    <ListItemText primary={props.primary(item, i)} secondary={props.secondary(item, i)} />
                                </ListItem>
                        )}
                    </List>
                : t('No Data')
            }
            </div>
            { props.isLoading === 'MORE' && <ColorLinearProgress style={{width: '30%', marginTop: '5px'}} /> }
        </Box>
    );
}