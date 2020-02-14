import React, { Component } from "react";

import { api, headers } from '../../constants';

import {
    ListItemAvatar,
} from '@material-ui/core';

import FlagIcon from '../Common/Flag/FlagIcon';

import InfiniteScroll from "../Common/List/InfiniteScroll";

export default class KeywordCountries extends Component {
    
    state = {
        countries: [],
        loading: false,
        search: '',
        debounce: null,
        keyword: {},
    }

    static getDerivedStateFromProps(props, state) {
        if(props.keyword._id !== state.keyword._id) {
            return {
                keyword: props.keyword
            }
        }
        return null;
    }

    async componentDidUpdate(props, state) {
        if(state.keyword._id !== this.state.keyword._id && this.state.keyword._id) {
            await this.getData(false, this.state.keyword)
        } 
    }

    async getData(e, keyword) {

        this.setState({ loading: true })
        const url = api(`keywords/${keyword._id}/countries`)
        const res = await fetch(url, headers);
        let countries = await res.json();
        countries = JSON.parse(countries.countries);

        this.setState({ 
            countries,
            loading: false
        });
    }

    onSearch(e) {
        const search = e.target.value;
        this.setState({ search });
    }

    render() {
        return (
            <InfiniteScroll 
                style={{flexGrow: 1}}
                items={this.state.countries.filter(({name}) => (
                    new RegExp(`.*${this.state.search}.*`, 'gi')).test(name)
                )}
                onSearch={this.onSearch.bind(this)}
                isLoading={this.state.loading}
                height="70vh"
                primary={({index, name}) => `${index+1}º ${name}`} 
                secondary={({total, percentage}) => `${total} (${percentage}%)`}
                avatar={({code}) => (
                    <ListItemAvatar>
                        <FlagIcon code={code} size="2x"/>
                    </ListItemAvatar>
                )}
            />
        )
    }
}