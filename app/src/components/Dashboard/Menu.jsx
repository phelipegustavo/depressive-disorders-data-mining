import React from 'react';

import {    
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItem,
} from '@material-ui/core';

import {
    Place
} from '@material-ui/icons';

const items = [
    {
        href: () => '/mapa', 
        text: 'Mapa', 
        icon: <Place/> 
    }
];


export default function Menu(props) {

    return (
        <Drawer anchor="left" open={props.open} onClose={props.toggleMenu}>
            <List component="nav" aria-label="main mailbox folders" style={{width: '340px'}}>
                { items.map((item, index) => (
                    <ListItem key={index} button onClick={item.action}>
                        <ListItemIcon>
                            { item.icon }
                        </ListItemIcon>
                    <ListItemText primary={item.text} />
                    </ListItem>
                )) }
            </List>
        </Drawer>
    )
}

