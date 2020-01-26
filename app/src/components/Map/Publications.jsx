import React, { Component } from 'react';

import { api, headers } from '../../constants';

import { Trans, useTranslation } from 'react-i18next';

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
            country: props.country,
            countries: [],
            search: '',
            page: 1,
            perPage: 10,
            debounce: null,
        }
    }

    componentWillReceiveProps(props) {
        if(props.open && props.country && this.state.country._id !== props.country._id) {
            this.setState({ 
                search: '', 
                page: 1,
                perPage: 10, 
                publications: [],  
                country: props.country,
                countries: props.countries,
            }, async () => await this.getPublications());
        }
    }

    onSearch(e) {
        const search = e.target.value
        clearTimeout(this.state.debounce);
        const debounce = setTimeout(() => {
            this.setState({ 
                search, 
                page: 1, 
                perPage: 10, 
                publications: [] 
            }, async () => await this.getPublications());
        }, 300);
        this.setState({ debounce })
    }

    async getPublications() {
        this.setState({loading: true})
        const url = api(`publications/${this.props.country._id}`, {
            page: this.state.page,
            perPage: this.state.perPage,
            search: this.state.search,
        })
        const res = await fetch(url, headers)
        const items = await res.json();
        let publications = this.state.publications;
        publications = publications.concat(items)
        this.setState({ publications });
        this.setState({ loading: false })

    }
    
    async onScroll(e) {
        if(this.state.loading) return;
        const top = e.target.scrollTop;
        const height = e.target.scrollHeight;
        const bottom = height - top;
        if(e.target.clientHeight/bottom * 100 >= 40) {
            const page = this.state.page + 1;
            this.setState({ page });
            await this.getPublications();
        }
    }

    render() {
        return (
            <Drawer anchor="right" variant="persistent" open={this.props.open} onClose={this.props.toggleMenu} onScroll={this.onScroll.bind(this)}>
                { this.props.country && 
                    <Toolbar color="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Trans i18nKey="Publications Search" />
                        <IconButton onClick={this.props.toggleMenu} edge="end" color="inherit" aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar> 
                }
                <Box>
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
                    <TransField
                        style={classes.input}
                        onChange={this.onSearch.bind(this)}
                        label="Title"
                        variant="outlined"
                        placeholder="Search by title"
                    />
                </Box>
                <List component="ul" style={{width: '600px', overflowY: 'auto'}}>
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

