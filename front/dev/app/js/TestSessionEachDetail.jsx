import React from 'react';
import { Jumbotron, Row, Col, Label, PageHeader, Button } from 'react-bootstrap';
import {getOneTestSession} from './testSessionService.js';

export default class TestSessionEachDetail extends React.Component {
    constructor(props) {
		super(props);
		let testSessionId = this.props.match.params.testSessionId;
		this.state = {
			testSessionId : testSessionId,
		};
	}

	componentDidMount() {
		console.log(this.props.match.params.testSessionId);
		console.log(this.props);
		getOneTestSession(this.state.testSessionId)
			.then( testSessionArray => {
				console.log(testSessionArray);
				this.setState({
					testSession: testSessionArray[0]
				});
			})
			.catch ( (err) => {
				console.log(err);
				this.setState({
					error: err
				});
			});
	}

	render() {
		if(this.state.testSession){
			var testSessionName = this.state.testSession ? this.state.testSession.name : '... featching TestSession';
			console.log(testSessionName);
			const name = `${this.state.testSession.name}`;
			const owner = this.state.testSession.ownerId;
			const url = this.state.testSession.url;
			const duration = this.state.testSession.duration;
			const status = this.state.testSession.status;
			//const startingTime = this.state.testSession.startingTime;
			const entropy = this.state.testSession.entropy;

			var testSessionDetails = 
			    <Row>
					<Col sm={12} md={6}>
						<h2> {testSessionName} </h2>
						<p> URL : {url} </p>
						<p> Owner : {owner} </p>
						<p> Duration : {duration} </p>
						<p> Status : {status} </p>
						<p> Entropy : {entropy} </p>
					</Col>
					
					<Col sm={12} md={6}>
						<h2>Do you join this Test Session ?</h2>
						<Button bsStyle="primary" bsSize="large">Join it</Button>
					</Col>					

				</Row>;

		} else {
			testSessionDetails = '... featching TestSession';
		}
		

		
		return (
			<div>
				<Row>
					<Col xs={12} md={8} >
						<PageHeader>One testSession Detail : {testSessionName} </PageHeader>
					</Col>
				</Row>

				{testSessionDetails}

			</div>
		);
	}

}
