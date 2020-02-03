import React, { Component } from 'react';

import { 
    Card,
    Typography, 
    CardContent,
    Box,
} from '@material-ui/core';

import { api, headers } from '../../constants';

import { Trans } from 'react-i18next';

import MiningChart from './MiningChart';
import MiningCountries from './MiningCountries';

export default class Charts extends Component {

    state = {
        mining: [],
        countries: [],
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const url = api('charts/list')
        const res = await fetch(url, headers);
        const {identifiedCountry, total, countries} = await res.json();
        const mining = [
            { value: identifiedCountry,  name: 'Defined Country', color: '#00e676' },
            { value: total - identifiedCountry,  name: 'Undefined Country', color: '#f50057' }
        ];
        this.setState({ mining, countries });
    }

    render() {
        return (
            <React.Fragment>
                <Typography gutterBottom variant="h5" component="h2" style={{ padding: '30px'}}>
                    <Trans i18nKey="Charts" />
                </Typography>
                <Box 
                    display="flex"
                    alignItems="center"
                    justifyContent="space-around" 
                    p={1}
                    m={0}
                >
                    <Card>
                        <CardContent>
                            <MiningChart data={this.state.mining}/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <MiningCountries data={this.state.countries}/>
                        </CardContent>
                    </Card>
                </Box>
            </React.Fragment>
        )
    }
}