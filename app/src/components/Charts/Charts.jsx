import React, { Component } from 'react';

import { 
    Card,
    Typography, 
    CardContent,
} from '@material-ui/core';

import Mining from './Mining';
export default class Charts extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">Charts</Typography>
                    <Mining />
                </CardContent>
            </Card>
        )
    }
}