import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation  } from 'react-i18next';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
} from '@material-ui/core';

import {
    Menu as MenuIcon,
} from '@material-ui/icons';


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

export default function TopBar(props) {

    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton onClick={props.toggleMenu} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {t('Depression-related articles')}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}