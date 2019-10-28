import React from 'react';
import {isLoggedIn, getLoggedInUserName} from './authenticationService.js';
import {addOneCampaign} from './campaignService.js';
import dateFormat from 'dateformat';


import { FormGroup, FormControl, ControlLabel, Button, Alert, Row, Image, Grid, Col} from 'react-bootstrap';

export default class CampaignAddOne extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			credential : {
			    creator : getLoggedInUserName(),
			    authorisedUsers : [],
				name : '',
				url : '',
				duration : '',
				startingTime : '',
				status: 'starting',
				entropy : 0
			},
			message : null
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		var eventID = event.target.id;
		var eventValue = event.target.value;   
		this.setState( (prevState) => {
			switch (eventID) {
			case 'name' : return { 
				credential: {
					creator: prevState.credential.creator,
					authorisedUsers: prevState.credential.authorisedUsers,
					name: eventValue, 
					url: prevState.credential.url, 
					duration: prevState.credential.duration, 
					startingTime: prevState.credential.startingTime, 
					status: prevState.credential.status, 
					entropy: prevState.credential.entropy
				},
				message: null};
			case 'url' : return { 
				credential: {
					creator: prevState.credential.creator,
					authorisedUsers: prevState.credential.authorisedUsers,
					name: prevState.credential.name,
					url: eventValue, 
					duration: prevState.credential.duration,
					startingTime: prevState.credential.startingTime,
					status: prevState.credential.status,
					entropy: prevState.credential.entropy
				},
				message: null};
			case 'startingTime' : return { 
				credential: {
					creator: prevState.credential.creator,
					authorisedUsers: prevState.credential.authorisedUsers,
					name: prevState.credential.name,
					url: prevState.credential.url, 
					duration: prevState.credential.duration,
					startingTime: eventValue, 
					status: prevState.credential.status,
					entropy: prevState.credential.entropy
				},
				message: null};
			case 'duration' : return {
				credential: {
					creator: prevState.credential.creator,
					authorisedUsers: prevState.credential.authorisedUsers,
					name: prevState.credential.name,
					url: prevState.credential.url, 
					duration: eventValue, 
					startingTime: prevState.credential.startingTime,
					status: prevState.credential.status,
					entropy: prevState.credential.entropy
				},
				message: null};
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		addOneCampaign(this.state.credential)
			.then((message) => {
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						message: message
					};
				});
			})
			.catch( (err) => {
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						message: 'ERROR'
					};
				});
			});
    
	}

	render() {
		if (isLoggedIn()) {
			let errorMessage;
			if (this.state.message) {
				errorMessage = <Alert bsStyle="warning">
					<strong>{this.state.message}</strong>
				</Alert>;
			}
			return (
				<Grid>
					<Row>
						<Col xs={12} md={8}>
							<form onSubmit={this.handleSubmit} className="centered-form">
							Create One Test Campaign
								<FormGroup>
									<ControlLabel>Testname</ControlLabel>
									<FormControl id="name" type="text" value={this.state.name} onChange={this.handleChange}/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>URL</ControlLabel>
									<FormControl id="url" type="text" value={this.state.url} onChange={this.handleChange}/>
								</FormGroup>

								<FormGroup>
									<ControlLabel>Start Time</ControlLabel>
									<input id="startingTime" type="time" value={this.state.startingTime} onChange={this.handleChange} xs={12} md={8}/>
								</FormGroup>

								<FormGroup>
									<ControlLabel>Duration</ControlLabel>
									<FormControl id="duration" type="text" value={this.state.duration} onChange={this.handleChange}/>
								</FormGroup>
								<Button type="submit">Submit</Button>
								{errorMessage}
							</form>
						</Col>
					</Row>
				</Grid>
			);
			
		} else {
			return (
				<Alert bsStyle="warning">
					<strong>You are not logged in !</strong>
				</Alert>
			);			
		}
	}
}
