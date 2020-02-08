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
    ListItemAvatar,
} from '@material-ui/core';

import FlagIcon from '../Common/Flag/FlagIcon';

import InfiniteScroll from '../Common/List/InfiniteScroll';

const randColor = (colors) => {
    let color = '';
    
    do {
        color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);;
    } while(colors.includes(color));
        
    return color;
}

export default class MiningCountries extends Component {

    state = {
        search: '',
        data: [],
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
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

    onSearch(e) {
        const search = e.target.value;
        this.setState({ search });
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
                    flexWrap="wrap"
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
                        <Tooltip formatter={(value, name, {payload}) => `${value} (${payload.percentage})%` }/>
                    </PieChart>
                    <InfiniteScroll 
                        items={this.state.data.filter(({name}) => (
                            new RegExp(`.*${this.state.search}.*`, 'gi')).test(name)
                        )}
                        isLoading={this.props.isLoading}
                        primary={(c, i) => `${c.index+1}º ${c.name}`} 
                        secondary={(c) => `${c.count} (${c.percentage}%)`}
                        onSearch={this.onSearch.bind(this)}
                        avatar={(item) => (
                            <ListItemAvatar>
                                <FlagIcon code={item.code} size="2x"/>
                            </ListItemAvatar>
                        )}
                    />
                </Box>
            </React.Fragment>
        );
    }
}
