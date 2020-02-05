  
import React, { Component } from 'react';

import { api, headers, googleMapURL } from '../../constants';

import MapWithAMarker from './MapWithAMarker';
import Publications from './Publications';

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            countries: [],
            keywords: [],
            country: false,
            publications: false,
        };
    }

    componentDidMount() {
        this.getCountries();
    }

    togglePublications() {
        const publications = !this.state.publications;
        this.setState({ publications })
    }

    async selectCountry(e, country=false) {
        let keywords = [];
        if(country && country._id) {
            keywords = await this.getKeywords(country);
        }
        console.log({ 
            keywords,
            country,
            publications: !!country,
        });
        this.setState({ 
            keywords,
            country,
            publications: !!country,
        });
    }

    async getKeywords({_id}) {
        const url = api(`countries/${_id}/keywords`, {
            perPage: 5,
            page: 1,
        })
        const res = await fetch(url, headers)
        return await res.json();
    }

    async getCountries() {
        const url = api('publications')
        const res = await fetch(url, headers)
        const countries = await res.json();
        if(countries) {
            this.setState({ countries });
        } 
    }

    render() {
        return (
            <React.Fragment>
                <MapWithAMarker
                    googleMapURL={googleMapURL}
                    loadingElement={<div style={{ display: 'flex', flex: 1 }} />}
                    containerElement={<div style={{ display: 'flex', flex: 1 }} />}
                    mapElement={<div style={{ display: 'flex', flex: 1  }} />}
                    markers={this.state.countries} 
                    select={this.selectCountry.bind(this)}
                    country={this.state.country}
                    keywords={this.state.keywords}
                />
                <Publications 
                    open={this.state.publications} 
                    country={this.state.country} 
                    countries={this.state.countries} 
                    toggleMenu={this.togglePublications.bind(this)} 
                    selectCountry={this.selectCountry.bind(this)}
                />
            </React.Fragment>
        )
    }
}