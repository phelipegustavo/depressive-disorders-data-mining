  
import React, { Component } from 'react';

import { api, headers, googleMapURL } from '../../constants';

import MapWithAMarker from './MapWithAMarker';
import Publications from './Publications';

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            markers: [],
            country: false,
            publications: false,
        };
    }

    componentDidMount() {
        this.getMarkers();
    }

    togglePublications() {
        const publications = !this.state.publications;
        this.setState({ publications })
    }

    selectCountry(country=false) {
        this.setState({ country })
        this.setState({ publications: !!country })
    }

    async getMarkers() {
        const url = api('publications')
        const res = await fetch(url, headers)
        const items = await res.json();
        if(items) {
            const markers = items.filter(item => item);
            this.setState({ markers });
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
                    markers={this.state.markers} 
                    select={this.selectCountry.bind(this)}
                    country={this.state.country}
                />
                <Publications open={this.state.publications} country={this.state.country} toggleMenu={this.togglePublications.bind(this)} />
            </React.Fragment>
        )
    }
}