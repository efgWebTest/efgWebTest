import React from 'react';
import { Jumbotron, Row, Col, Label, PageHeader, Button } from 'react-bootstrap';
import {getOneCampaign, joinCampaign, isCampaignMember} from './campaignService.js';
import {getLoggedInUserName} from './authenticationService.js';

var REFRESH_TEMPO = 10000;

export default class CampaignEachDetail extends React.Component {
    constructor(props) {
		super(props);
		let campaignId = this.props.match.params.campaignId;
		this.state = {
			campaignId : campaignId,
			isJoined : false,
			intervalId : null
		};
		this.onClickJoinCampaign = this.onClickJoinCampaign.bind(this);
	}

	updateCampaignDetails() {
		this.setState({
			loaded: false,
		});
		
		getOneCampaign(this.state.campaignId)
			.then( campaignArray => {
				//console.log(campaignArray);
				this.setState({
					campaign: campaignArray[0]
				});
			})
			.catch ( (err) => {
				console.log(err);
				this.setState({
					error: err
				});
			});
	}

	isTestMember(){
		var isTestMemberParameters = {
			campaignId : this.state.campaignId,
			userName : getLoggedInUserName()
		};

		isCampaignMember(isTestMemberParameters)
			.then( (response) => {
				console.log(`jsx isTestMember response: ${response}`);
				this.setState( () => {
					return {
						isJoined: response
					};
				});
			})
			.catch( (err) => {
				//console.log(`isTestMember error: ${err}`);
			});

	}

	componentDidMount() {
		console.log(this.props.match.params.campaignId);
		console.log(this.props);
		let interval = setInterval(() => {
			this.updateCampaignDetails();
			this.isTestMember();
		}, REFRESH_TEMPO);

		this.setState({
			intervalId: interval
		});

		this.updateCampaignDetails();
		this.isTestMember();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	onClickJoinCampaign(event) {
		event.preventDefault();
		var userName = getLoggedInUserName();

		var newCampaign = this.state.campaign;
		newCampaign.authorisedUsers.push(userName);

		joinCampaign(newCampaign)
			.then( (response) => {
				//console.log(`pushCampaign: ${response}`);
				this.setState( () => {
					return {
						campaign: newCampaign
					};
				});
			})
			.catch( (err) => {
				//console.log(`pushCampaign error: ${err}`);
			});
	}

	

	render() {
		if(this.state.campaign){
			var campaignName = this.state.campaign.name;
			const creator = this.state.campaign.creator;
			var authorisedUsers = null;
			if (this.state.campaign.authorisedUsers.length){
				authorisedUsers = this.state.campaign.authorisedUsers.map((authorisedUser, i) => <li key={i}>{authorisedUser}</li> );			
			} else {
				authorisedUsers = `nobody`;
			}						
			const url = this.state.campaign.url;
			const duration = this.state.campaign.duration;
			const status = this.state.campaign.status;
			const startingTime = this.state.campaign.startingTime;
			const entropy = this.state.campaign.entropy;
            var joinStatus = null;
			if (this.state.campaign.authorisedUsers.includes(getLoggedInUserName())){
				joinStatus = 
					<Col sm={12} md={6}>
						<h2>You are one of test memebers in this Test Campaign</h2>
					</Col>;				
			} else {
				joinStatus = 
					<Col sm={12} md={6}>
						<h2>Do you join this Test Campaign ?</h2>
						<Button bsStyle="primary" bsSize="large" onClick={this.onClickJoinCampaign}>Join it</Button>
					</Col>;
			}			

			var campaignDetails = 
			    <Row>
					<Col sm={12} md={6}>
						<h2> {campaignName} </h2>
						<p> URL : {url} </p>
						<p> Creator : {creator} </p>
						<p> TestMembers : <ul>{authorisedUsers}</ul> </p>
						<p> Start Time : {startingTime} </p>
						<p> Duration : {duration} </p>
						<p> Status : {status} </p>
						<p> Entropy : {entropy} </p>
					</Col>

					{joinStatus}									

				</Row>;

		} else {
			campaignDetails = '... featching Campaign';
		}
		

		
		return (
			<div>
				<Row>
					<Col xs={12} md={8} >
						<PageHeader>One campaign Detail : {campaignName} </PageHeader>
					</Col>
				</Row>

				{campaignDetails}

			</div>
		);
	}

}
