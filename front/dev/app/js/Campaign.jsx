import React from 'react';
import {getLoggedInUserName} from './authenticationService.js';
import { Panel, Col, Button, FormGroup, ControlLabel, FormControl, Modal, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const REFRESH_TEMPO = 15000;

export default class Campaign extends React.Component {
	constructor(props) {
		super(props);
		let campaign = this.props.campaign;
		if (! campaign.name) {
			campaign.name = 'MyCampaign';
		}
		this.state = {
			campaign : campaign
		};
		
	}

	render() {
		const indice = `${this.props.indice}`;
		const name = `${this.state.campaign.name}`;
		const creator = `${this.state.campaign.creator}`;
		const url = `${this.state.campaign.url}`;
		const duration = `${this.state.campaign.duration}`;
		const status = `${this.state.campaign.status}`;
		//const startingTime = `${this.state.campaign.startingTime}`;
		const entropy = `${this.state.campaign.entropy}`;

		const detailsHrefWithId = `/campaignEachDetail/${this.state.campaign._id}`;
		//const detailsHref = `/campaignEachDetail`;
		
		return (		
			
			<tr>
			    <td>{indice}</td>
			    <td>{name}</td>
			    <td>{url}</td>
			    {/*<td>{creator}</td>*/}
			    {/*<td>{duration}</td>*/}
			    <td>{status}</td>
			    {/*<td>{entropy}</td>*/}
			    <td><Link to={detailsHrefWithId}><Button bsStyle="primary" bsSize="small">View</Button></Link></td>
			    {/* <td><Link to={detailsHrefWithId}><Button bsStyle="info" bsSize="small">Join</Button></Link></td> */}		    
		    </tr>
		);
	}

}
