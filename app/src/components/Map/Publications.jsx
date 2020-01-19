import React, { Component } from 'react';

import { api, headers } from '../../constants';

import {    
    Drawer,
    List,
    ListItemText,
    ListItem,
    IconButton,
    Toolbar,
} from '@material-ui/core';

import {
    Close as CloseIcon,
} from '@material-ui/icons';

const ListItemLink = (props) => (<ListItem button component="a" {...props} />);

export default class Publications extends Component {

    constructor(props) {   
        super(props);
        this.state = {
            loading: false,
            publications: [],
            page: 1,
            perPage: 10,
        }
    }

    componentWillReceiveProps(next) {
        if(next.open && next.country) {
            this.setState({ page: 1, perPage: 10, publications: [] }, async () => await this.getPublications())
        }
    }

    async getPublications() {
        this.setState({loading: true})
        const url = api(`publications/${this.props.country._id}`, {
            page: this.state.page,
            perPage: this.state.perPage
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
                        { this.props.country.name } ({ this.props.country.count })
                        <IconButton onClick={this.props.toggleMenu} edge="end" color="inherit" aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar> }
                <List component="ul" style={{width: '340px'}}>
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

