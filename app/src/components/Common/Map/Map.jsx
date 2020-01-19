import React, { Component } from 'react';

import { 
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker, 
    InfoWindow
} from "react-google-maps"

import './Map.css';

const { compose, withStateHandlers } = require("recompose");

const MapWithAMarker = compose(
	withStateHandlers((props) => ({
        options: {
            minZoom: 2,
            maxZoom: 6,
        },
        zoom: 2,
		center: {
			lat: 0,
			lng: 0
        },
	}), {
	}),
	withScriptjs,
	withGoogleMap
	)(props => (
	<GoogleMap
        options={props.options}
		defaultZoom={props.zoom}
		defaultCenter={props.center}>
		{props.markers.map(({lat, lng, count, name, _id}) => (
			<Marker 
				key={_id} 
				position={{ lat, lng }} 
				label={{fontSize: '10px', fontWeight: '600', color: '#fff', text: count.toString()}} 
				onClick={() => props.select({count, name, _id})}>
					{props.country && props.country._id === _id && 
                    <InfoWindow onCloseClick={props.select}>
						<span>{ name } ({count})</span>
					</InfoWindow>}
			</Marker>
		))}
	</GoogleMap>
));
  
export default class Map extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            markers: [] 
        };
    }

    componentDidMount() {
        this.getMarkers();
    }

    async getMarkers() {
        const res = await fetch('http://localhost:5555/publications', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' },
            mode: 'cors',
            cache: 'default'
        })
        const items = await res.json();
        if(items) {
            const markers = items.filter(item => item);
            this.setState({ markers });
        }
    }

    render() {
        return (
            <MapWithAMarker
                googleMapURL={`https://maps.googleapis.com/maps/api/js?${'AIzaSyBU_jAnvZKTJ3s4ewBwimDqMZdh09J8NJ0'}`}
                loadingElement={<div style={{ display: 'flex', flex: 1 }} />}
                containerElement={<div style={{ display: 'flex', flex: 1 }} />}
                mapElement={<div style={{ display: 'flex', flex: 1  }} />}
                zoom={this.zoom} 
                center={this.center} 
                markers={this.state.markers} 
                select={this.props.select}
                country={this.props.country}
            />
        )
    }
}