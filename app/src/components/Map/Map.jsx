  
import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';

import { api, headers, googleMapURL } from '../../constants';
import { makeStyles, withStyles, useTheme  } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { 
    Box,
    CircularProgress,
} from '@material-ui/core';


import MapWithAMarker from './MapWithAMarker';
import Publications from './Publications';

const useStyles = makeStyles(theme => ({
    mapShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: '610px',
    }
}));

const ColorCircularProgress = withStyles({
    root: {
      color: '#6798e5',
    },
})(CircularProgress);

const Loading = (props) => {

    return (
        <Box
            display="flex"
            flex="1"
            alignItems="center"
            justifyContent="center"
            justifyItems="center"
            style={{ 
                backgroundColor: 'transparent',
                background: '#0009',
                position: 'absolute',
                top: 0,
                left: 0,
                width: `calc(100% - ${props.drawerWidth})`,
                height: '100vh',
                zIndex: '9'
            }}
            p={0}
            m={0}
        >
            <ColorCircularProgress size={50} thickness={5} />
        </Box>
    );
}

export default function Map() {

    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const [ keywords, setKeywords ] = useState([]);
    const [ showPublications, setShowPublications ] = useState(true);
    const [ country, setCountry ] = useState(false);
    const [ countries, setCountries ] = useState([]);
    const [ search, setSearch ] = useState('');
    const [ debounce, setDebounce ] = useState(null);
    const [ loading, setLoading ] = useState(null);
    
    const getCount = useCallback(async () => {
        setLoading(true);
        const url = api('publications/count', {
            search,
        })
        const res = await fetch(url, headers)
        const countries = await res.json();
        if(countries) {
            setCountries(countries);
        } else {
            console.error(`FAIL TO LOAD COUNTRIES`);
        }
        setLoading(false);
    }, [search])

    useEffect(() => {
        getCount();
    }, [getCount]);

    useEffect(() => {
        if(country && country._id) {
            const c = countries.find(({_id}) => country._id === _id);
            if(c) {
                setCountry(c);
            } else {
                setCountry(c => ({...c, count: 0}));
            }
        }
    }, [country, countries]);

    useEffect(() => {
        setShowPublications(!!matches);
    }, [matches])

    const selectCountry = async (e, newContry=false) => {
        let keywords = [];
        if(newContry && newContry._id && newContry !== country) {
            keywords = await getKeywords(newContry);
            setKeywords(keywords);
        }
        setShowPublications(matches);
        setCountry(newContry);
    }

    const getKeywords = async ({_id}) => {
        const url = api(`countries/${_id}/keywords`, {
            perPage: 5,
            page: 1,
        })
        const res = await fetch(url, headers)
        return await res.json();
    }

    const onSearch = (e) => {
        const { value } = e.target;
        clearTimeout(debounce);
        const timeout = setTimeout(() => {
            setSearch(value);
        }, 300);
        setDebounce(timeout);
    }

    return (
        <React.Fragment>
            <Box
                display="flex"
                flex="1"
                className={clsx({[classes.mapShift]: showPublications})}
                p={0}
                m={0}
            >
                { loading && <Loading drawerWidth={showPublications ? '610px' : '0'} /> }
                <MapWithAMarker
                    googleMapURL={googleMapURL}
                    loadingElement={<div style={{ display: 'flex', flex: 1 }} />}
                    containerElement={<div style={{ display: 'flex', flex: 1 }} />}
                    mapElement={<div style={{ display: 'flex', flex: 1  }} />}
                    markers={countries} 
                    select={selectCountry}
                    country={country}
                    keywords={keywords}
                />
            </Box>
            <Publications 
                open={showPublications} 
                toggleMenu={() => setShowPublications(!showPublications)} 
                countries={countries} 
                country={country} 
                selectCountry={selectCountry}
                search={search}
                onSearch={onSearch}
            />
        </React.Fragment>
    )
}