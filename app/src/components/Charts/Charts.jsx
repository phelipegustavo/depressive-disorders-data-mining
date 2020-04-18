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
        loading: false,
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        this.setState({ loading: true })
        const url = api('charts/list')
        const res = await fetch(url, headers);
        const {identifiedCountry, total, countries} = await res.json();
        const undefinedCountry = total - identifiedCountry;
        const mining = [
            { value: identifiedCountry,  name: 'Defined Country', color: '#00e676', percentage: (identifiedCountry/total * 100).toFixed(2) },
            { value: undefinedCountry,  name: 'Undefined Country', color: '#f50057',  percentage: (undefinedCountry/total * 100).toFixed(2) }
        ];
        this.setState({ 
            mining, 
            countries, 
            loading: false 
        });
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
                    flexWrap="wrap"
                    p={1}
                >
                    <Card style={{ margin: '5px', minHeight: '510px' }}>
                        <CardContent>
                            <MiningChart data={this.state.mining}/>
                        </CardContent>
                    </Card>
                    <Card style={{ margin: '5px', minHeight: '510px' }}>
                        <CardContent>
                            <MiningCountries data={this.state.countries} isLoading={this.state.isLoading} />
                        </CardContent>
                    </Card>
                </Box>
            </React.Fragment>
        )
    }
}