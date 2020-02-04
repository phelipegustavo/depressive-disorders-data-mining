import React from 'react';

import { Link } from 'react-router-dom';
import { useTranslation  } from 'react-i18next';

import {    
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItem,
} from '@material-ui/core';

import {
    Place,
    PieChart,
    TrendingUp,
} from '@material-ui/icons';

const items = [
    {
        href: '/', 
        text: 'Map', 
        icon: <Place/> 
    },
    {
        href: '/charts', 
        text: 'Charts', 
        icon: <PieChart/> 
    },
    {
        href: '/keywords', 
        text: 'Keywords', 
        icon: <TrendingUp/> 
    }
];

export default function Menu(props) {

    const { t } = useTranslation();

    return (
        <Drawer anchor="left" open={props.open} onClose={props.toggleMenu}>
            <List component="nav" aria-label="main mailbox folders" style={{width: '340px'}}>
                { items.map((item, index) => (
                    <ListItem key={index} button component={Link} to={item.href} onClick={props.toggleMenu}>
                        <ListItemIcon>
                            { item.icon }
                        </ListItemIcon>
                    <ListItemText primary={t(item.text)} />
                    </ListItem>
                )) }
            </List>
        </Drawer>
    )
}

