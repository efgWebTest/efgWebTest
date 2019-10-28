import React from 'react';
import {getLoggedInUserName} from './authenticationService.js';
import { Panel, Col, Button, FormGroup, ControlLabel, FormControl, Modal, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const REFRESH_TEMPO = 15000;

export default class TestSession extends React.Component {
	constructor(props) {
		super(props);
		let testSession = this.props.testSession;
		if (! testSession.name) {
			testSession.name = 'MytestSession';
		}
		this.state = {
			testSession : testSession,
			ownerName : getLoggedInUserName()
		};
		
	}

	render() {

		const divProps = Object.assign({}, this.props);
		//delete divProps.indice;
		//delete divProps.testSession;

		const head = `${this.props.indice} - ${this.state.testSession.name}`;
		const indice = `${this.props.indice}`;
		const name = `${this.state.testSession.name}`;
		const owner = `${this.state.testSession.ownerId}`;
		const url = `${this.state.testSession.url}`;
		const duration = `${this.state.testSession.duration}`;
		const status = `${this.state.testSession.status}`;
		//const startingTime = `${this.state.testSession.startingTime}`;
		const entropy = `${this.state.testSession.entropy}`;

		const detailsHrefId = `/TestSessionEachDetail/${this.state.testSession._id}`;
		const detailsHref = `/TestSessionEachDetail`;
		
		return (		
			
			<tr>
			    <td>{indice}</td>
			    <td>{name}</td>
			    <td>{url}</td>
			    <td>{owner}</td>
			    <td>{duration}</td>
			    <td>{status}</td>
			    <td>{entropy}</td>
			    <td><a href={detailsHref} ><Button bsStyle="primary" bsSize="small">View</Button></a></td>
			    <td><Link to={detailsHrefId}><Button bsStyle="info" bsSize="small">Join</Button></Link></td>		    
		    </tr>
		);
	}

}
