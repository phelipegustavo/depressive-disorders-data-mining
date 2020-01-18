import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from '@material-ui/core';

import {
    Menu as MenuIcon,
} from '@material-ui/icons';

import Map from '../Common/Map/Map';
import Menu from './Menu';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


const TopBar = (props) => {

    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton onClick={props.toggleMenu} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Depressive Data Mining
                </Typography>
                <Button color="inherit">Filtros</Button>
            </Toolbar>
        </AppBar>
    );
}

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: false
        }
    }

    toggleMenu() {
        const menu = !this.state.menu;
        this.setState({ menu })
    }
    
    render() {
        return (
            <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
                <TopBar toggleMenu={this.toggleMenu.bind(this)} />
                <Map />
                <Menu open={this.state.menu} toggleMenu={this.toggleMenu.bind(this)} />
            </div>
        )
    }
}