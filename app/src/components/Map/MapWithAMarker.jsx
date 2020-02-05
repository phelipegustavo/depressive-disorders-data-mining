import React from 'react';
import FlagIcon from '../Common/Flag/FlagIcon';

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
		{props.markers.map(country => (
			<Marker 
				key={country._id} 
				position={{ lat: country.lat, lng: country.lng }} 
				label={{fontSize: '10px', fontWeight: '600', color: '#fff', text: country.count.toString()}} 
				onClick={(e) => props.select(e, country)}>
					{props.country && props.country._id === country._id && 
                    <InfoWindow onCloseClick={props.select}>
						<div> 
							<span>{ country.code && <FlagIcon code={country.code} />}</span>
							<span style={{ margin: '0 10px' }}>{ country.name } ({country.count})</span>
							<ul>
								{ props.keywords.map(({_id, name, total}) => <li key={_id}>{name} ({total})</li>) }
							</ul>
						</div>
					</InfoWindow>}
			</Marker>
		))}
	</GoogleMap>
));
