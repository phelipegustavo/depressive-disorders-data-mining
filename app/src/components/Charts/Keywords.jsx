import React, { Component } from 'react';
import { Trans } from 'react-i18next';

import { api, headers } from '../../constants';
import { 
    Card ,
    List,
    ListItem,
    ListItemText,
    Box,
} from '@material-ui/core';

import CountryList from '../Common/Country/CountryList';

export default class Keywords extends Component {

    state = {
        keywords: [],
        countries: [],
        loading: false,
        search: '',
        page: 1,
        perPage: 10,
        debounce: null,
    }

    componentDidMount() {
        this.getData();
    }

    async onScroll(e) {
        if(this.state.loading) return;
        const top = e.target.scrollTop;
        const height = e.target.scrollHeight;
        const bottom = height - top;
        if(e.target.clientHeight/bottom * 100 >= 40) {
            const page = this.state.page + 1;
            this.setState({ page });
            await this.getData();
        }
    }

    async getData() {
        this.setState({loading: true})
        const url = api('keywords', {
            page: this.state.page,
            perPage: this.state.perPage,
            search: this.state.search,
        })
        const res = await fetch(url, headers);
        let items = await res.json();
        let keywords = this.state.keywords;
        keywords = keywords.concat(items)
        this.setState({ keywords });
        this.setState({ loading: false })
    }

    async getCountry(_id) {
        const url = api(`keywords/${_id}/countries`)
        const res = await fetch(url, headers);
        let countries = await res.json();
        countries = JSON.parse(countries.countries);
        this.setState({ countries });
    }

    render() {
        return (
            <Box 
                display="flex"
                alignItems="start"
                justifyContent="space-around" 
                m={2}
                style={{maxHeight: "320px"}}
            >
                <List component="ul" style={{width: '300px', overflowY: 'auto', maxHeight: 'inherit'}} onScroll={this.onScroll.bind(this)} >
                    { this.state.keywords.map((item, i) => (
                        <ListItem key={i} button style={{ padding: 0 }} onClick={() => this.getCountry(item._id)}>
                            <ListItemText primary={item.name} secondary={item.count} />
                        </ListItem>
                    )) }
                </List>
                <CountryList countries={this.state.countries} secondary={(c) => `${c.total} rel.: (${c.relative})% abs.: (${c.percentage}%)`}/>
            </Box>
        )
    }
}
