  
import React, { useState, useEffect } from 'react';

import { api, headers, googleMapURL } from '../../constants';

import MapWithAMarker from './MapWithAMarker';
import Publications from './Publications';

export default function Map() {

    const [ keywords, setKeywords ] = useState([]);
    const [ publications, setPublications ] = useState(false);
    const [ country, setCountry ] = useState(false);

    const [ countries, setCountries ] = useState([]);
    useEffect(() => {        
        getPublications();
    }, []);

    const getPublications = async () => {
        const url = api('publications')
        const res = await fetch(url, headers)
        const countries = await res.json();
        if(countries) {
            setCountries(countries);
        } else {
            console.error(`FAIL TO LOAD COUNTRIES`);
        }
    }

    const selectCountry = async (e, country=false) => {
        let keywords = [];
        if(country && country._id) {
            keywords = await getKeywords(country);
        }
        setCountry(country);
        setKeywords(keywords);
        setPublications(!!country);
    }

    const getKeywords = async ({_id}) => {
        const url = api(`countries/${_id}/keywords`, {
            perPage: 5,
            page: 1,
        })
        const res = await fetch(url, headers)
        return await res.json();
    }

    return (
        <React.Fragment>
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
            <Publications 
                open={publications} 
                country={country} 
                countries={countries} 
                toggleMenu={() => setPublications(!publications)} 
                selectCountry={selectCountry}
            />
        </React.Fragment>
    )
}