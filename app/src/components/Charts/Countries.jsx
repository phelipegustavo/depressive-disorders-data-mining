import React, { Component } from 'react';
import { Trans } from 'react-i18next';

import {
    PieChart, 
    Pie, 
    Tooltip, 
    Cell,
} from 'recharts';

import {
    Box,
    Typography,
} from '@material-ui/core';

import CountryList from '../Common/Country/CountryList';

const randColor = (colors) => {
    let color = '';
    
    do {
        color = "#"+((1<<24)*Math.random()|0).toString(16);
    } while(colors.includes(color));
        
    return color;
}

export default class Countries extends Component {

    state = {
        data: [],
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            let colors = [];
            return {
                data: props.data,
                colors: props.data.map(() => {
                    const color = randColor(colors);
                    colors.push(color)
                    return color;
                })
            };
        }
        return null;
    }

    render() {
        return (
            <React.Fragment>
                <Typography gutterBottom variant="h5" component="h2">
                    <Trans i18nKey="Publications by country" />
                </Typography>
                <Box 
                    display="flex"
                    alignItems="center"
                    justifyContent="space-around" 
                    p={0}
                    m={0}
                >
                    <PieChart width={500} height={400}>
                        <Pie
                            data={this.state.data}
                            cx={250}
                            cy={200}
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {this.state.data.map((country, index) => 
                                <Cell key={country._id} fill={this.state.colors[index]} />)}
                        </Pie>
                        <Tooltip formatter={(value, name, {payload}) => `${name} : ${value} (${payload.percentage})%` }/>
                    </PieChart>
                    <CountryList countries={this.state.data} />
                </Box>
            </React.Fragment>
        );
    }
}
