import React, { Component } from 'react';

import { Trans } from 'react-i18next';

import { 
    PieChart, 
    Pie, 
    Cell,
    Tooltip,
} from 'recharts';

import {
    Typography,
    Box,
} from '@material-ui/core';

import {
    Stop
} from '@material-ui/icons';

export default class MiningChart extends Component {

    state = {
        activeIndex: 0,
        data: [],
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            return {
                data: props.data
            };
        }
        return null;
    }

    onPieEnter = (data, index) => {
        this.setState({ activeIndex: index });
    };  

    render() {
        return (
            <React.Fragment>
                <Typography gutterBottom variant="h5" component="h2">
                    <Trans i18nKey="Identified countries" />
                </Typography>
                <PieChart width={300} height={200} style={{ marginTop: '60px' }}>
                    <Pie
                        activeIndex={this.state.activeIndex}
                        data={this.state.data}
                        cx={150}
                        cy={130}
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={180}
                        endAngle={0}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                    >
                        { this.state.data.map(({color}, i) => <Cell key={i} fill={color} />) }
                    </Pie>
                    <Tooltip formatter={(value, name, {payload}) => `${value} (${payload.percentage}%)`}/>
                </PieChart>
                { this.state.data.map(mining => 
                    (<Box 
                        key={mining.color}
                        display="flex"
                        alignItems="center"
                        justifyContent="start" 
                        height="100%"
                        flexWrap="wrap"
                        p={1}
                    >
                        <Stop style={{ color: mining.color }}/>
                        <Trans i18nKey={mining.name} /> - {mining.value} ({mining.percentage}%)
                    </Box>) 
                )}
            </React.Fragment>
        );
    }
}
