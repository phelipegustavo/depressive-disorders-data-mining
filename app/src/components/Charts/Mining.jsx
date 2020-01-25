import React, { Component } from 'react';
import { Trans } from 'react-i18next';

import { 
    PieChart, 
    Pie, 
    Sector, 
    Cell,
} from 'recharts';

import {
    Typography
} from '@material-ui/core';

import { api, headers } from '../../constants';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name} ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};


export default class Found extends Component {

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
                    <Trans i18nKey="Defined Country" />
                </Typography>
                <PieChart width={900} height={400}>
                    <Pie
                        activeIndex={this.state.activeIndex}
                        activeShape={renderActiveShape}
                        data={this.state.data}
                        cx={450}
                        cy={200}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                    >
                        { this.state.data.map(({color}, i) => <Cell key={i} fill={color} />) }
                    </Pie>
                </PieChart>
            </React.Fragment>
        );
    }
}
