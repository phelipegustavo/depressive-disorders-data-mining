import React, { Component } from "react";

import { 
    Typography, 
    Box,
} from '@material-ui/core'

import { Trans } from 'react-i18next';

import KeywordList from './KeywordList';
import KeywordCountries from './KeywordCountries';

export default class Keywords extends Component {

    state = {
        selected: {}
    }

    render() {
        return (
            <React.Fragment>
                <Typography gutterBottom variant="h5" component="h5" style={{ padding: '30px'} }>
                    <Trans i18nKey="Keywords"/> 
                </Typography>
                <Box 
                    display="flex"
                    alignItems="start"
                    justifyContent="space-around" 
                    height="100%"
                    flexWrap="wrap"
                    p={1}
                >
                    <KeywordList selected={this.state.selected} onSelect={(e, selected) => this.setState({ selected })} />
                    <KeywordCountries keyword={this.state.selected}/>
                </Box>
            </React.Fragment>
        )
    }
}