import React, { Component } from 'react';

import { api, headers } from '../../constants';

import { 
    Box,
} from '@material-ui/core';

import { Trans } from 'react-i18next';

import InfiniteScroll from '../Common/List/InfiniteScroll';

import KeywordCountries from './KeywordCountries';

export default class Keywords extends Component {

    state = {
        keywords: [],
        selected: {},
        loading: false,
        search: '',
        page: 1,
        perPage: 10,
        debounce: null,
    }

    componentDidMount() {
        this.setState({ loading: 'NO_DATA' })
        this.getData();
    }

    async onScroll(e) {
        if(this.state.loading) return;
        const top = e.target.scrollTop;
        const height = e.target.scrollHeight;
        const bottom = height - top;
        if(e.target.clientHeight/bottom * 100 >= 40) {
            const page = this.state.page + 1;
            this.setState({ 
                page, 
                loading: 'MORE' 
            }, async () => await this.getData());
        }
    }

    async getData() {
        const url = api('keywords', {
            page: this.state.page,
            perPage: this.state.perPage,
            search: this.state.search,
        })
        const res = await fetch(url, headers);
        let items = await res.json();
        let keywords = this.state.keywords;
        keywords = keywords.concat(items)
        this.setState({ 
            keywords,
            loading: false
        });
    }

    onSearch(e) {
        const search = e.target.value
        clearTimeout(this.state.debounce);
        const debounce = setTimeout(() => {
            this.setState({ 
                search, 
                page: 1, 
                perPage: 10, 
                keywords: [] 
            }, async () => await this.getData());
        }, 300);
        this.setState({ debounce })
    }

    render() {
        return (
            <Box 
                display="flex"
                alignItems="start"
                justifyContent="space-around" 
                height="100%"
                p={1}
            >
                <InfiniteScroll 
                    items={this.state.keywords.filter(({name}) => (
                        new RegExp(`.*${this.state.search}.*`, 'gi')).test(name)
                    )}
                    onSearch={this.onSearch.bind(this)}
                    onScroll={this.onScroll.bind(this)}
                    primary={(item, i) => `(${i+1})ª ${item.name}`} 
                    secondary={(item) => item.count}
                    selected={(item) => item._id === this.state.selected._id}
                    onSelect={(e, selected) => this.setState({ selected })}
                    style={{minWidth: '300px'}}
                    isLoading={this.state.loading}
                />
                <Trans i18nKey="Countries" />
                <KeywordCountries keyword={this.state.selected} />
            </Box>
        )
    }
}
