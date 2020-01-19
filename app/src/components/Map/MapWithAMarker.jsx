import React from 'react';

import { 
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker, 
    InfoWindow
} from "react-google-maps"

const { compose, withStateHandlers } = require("recompose");

export default compose(
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
