  
import React, { Component } from 'react';

import { api, headers, googleMapURL } from '../../constants';

import MapWithAMarker from './MapWithAMarker';
import Publications from './Publications';

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            countries: [],
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

    selectCountry(e, country=false) {
        this.setState({ country })
        this.setState({ publications: !!country })
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