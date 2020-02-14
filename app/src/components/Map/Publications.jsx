import React, { Component } from 'react';

import { api, headers } from '../../constants';

import { Trans, useTranslation } from 'react-i18next';

import './style.css'
import {    
    Drawer,
    List,
    ListItemText,
    ListItem,
    IconButton,
    Toolbar,
    TextField,
    Box,
} from '@material-ui/core';

import {
    Autocomplete,
} from '@material-ui/lab';

import {
    Close as CloseIcon,
} from '@material-ui/icons';

import FlagIcon from '../Common/Flag/FlagIcon';

const classes = {
    input: {
        margin: '5px',
        width: '600px',
    }
}

const ListItemLink = (props) => (<ListItem button component="a" {...props} />);

const TransField = (props) => {
    const { t } = useTranslation();
    return (
        <TextField
            {...props}
            style={classes.input}
            label={t(props.label)}
            variant="outlined"
            placeholder={t(props.placeholder)}
        />
    );
}
export default class Publications extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            publications: [],
            country: props.country ? props.country : null,
            countries: [],
            search: '',
            page: 1,
            perPage: 10,
            debounce: null,
        }
    }

    componentWillReceiveProps(props) {
        if(props.search !== this.state.search || props.country !== this.state.country) {
            this.setState({ 
                search: props.search, 
                page: 1,
                perPage: 10, 
                publications: [],  
                country: props.country ? props.country : null,
                countries: props.countries,
            }, this.getPublications);
        }
    }

    async getPublications() {
        if(this.state.loading) return;
        this.setState({ loading: true })
        let params = {
            page: this.state.page,
            perPage: this.state.perPage,
            search: this.props.search,
        };
        if(this.props.country) {
            params.country = this.props.country._id;
        }
        const url = api(`publications`, params)
        const res = await fetch(url, headers)
        const items = await res.json();
        this.setState({ 
            publications: [
                ...this.state.publications,
                ...items
            ],
            loading: false, 
        });
        
    }
    
    async onScroll(e) {
        if(this.state.loading) return;
        const top = e.target.scrollTop;
        const height = e.target.scrollHeight;
        const bottom = height - top;
        if(e.target.clientHeight/bottom * 100 >= 40) {
            const page = this.state.page + 1;
            this.setState({ page }, async () => 
                await this.getPublications()
            );            
        }
    }

    render() {
        return (
            <Drawer anchor="right" variant="persistent" open={this.props.open} onClose={this.props.toggleMenu} onScroll={this.onScroll.bind(this)}>
                <Toolbar color="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Trans i18nKey="Publications Search" />
                    <IconButton onClick={this.props.toggleMenu} edge="end" color="inherit" aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar> 
                <Box>
                    <TransField
                        style={classes.input}
                        onChange={this.props.onSearch}
                        label="Title"
                        variant="outlined"
                        placeholder="Search by title"
                    />
                    <Autocomplete
                        id="country"
                        options={this.state.countries}
                        getOptionLabel={({name, count}) => `${name} (${count})`}
                        value={this.state.country}
                        onChange={this.props.selectCountry}
                        renderOption={(option, getTagProps) =>
                            <span>
                                <FlagIcon code={option.code}></FlagIcon>
                                {option.name}
                            </span>
                        }
                        renderInput={params => (
                            <TransField
                                {...params}
                                style={classes.input}
                                label="Country"
                                variant="outlined"
                                placeholder="Country"
                            />
                            )}
                    />
                </Box>
                <List component="ul" className="scroll" style={{width: '600px', overflowY: 'auto'}}>
                    { this.state.publications.map((item, index) => (
                        <ListItem key={index} button onClick={item.action} style={{ padding: 0 }}>
                            <ListItemLink href={`https://www.ncbi.nlm.nih.gov/pmc/${item.pmc}/`} target="_blank" >
                                <ListItemText primary={item.title} secondary={item.affiliations ? item.affiliations[0].name : ''}/>
                            </ListItemLink>
                        </ListItem>
                    )) }
                </List> 
            </Drawer>
        )
    }
}

