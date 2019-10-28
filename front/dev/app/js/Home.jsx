import React from 'react';
import { isLoggedIn } from './authenticationService.js';
import { Jumbotron, Alert, Row, Col, Image, Label } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Home extends React.Component {

	render() {
		//console.log('render home');
		let uRLoggedInMsg = null;
		if (isLoggedIn()) {
			uRLoggedInMsg = <Alert bsStyle="success">
				<strong>You are logged in !</strong>
			</Alert>;
		}
		return (
			<div>
				<Row>
					<h1>Exploratory Test</h1>					
				</Row>
				<Row>
					<Col sm={12} md={12}>
						<p>Create your end to end test Campaign and all test members join it.</p>
						<p>Record your end to end test exploration using our <a href="">Chrome Plugin.</a></p>
						<p>Get notified if your should continue to do end to end test.</p>
					</Col>

					
				</Row>

				
				<Row>
					<Col sm={12} md={12}>
						<h2>How to use Exporatory Test?</h2>
						<p>First you need to <LinkContainer to="/signin"><a>Sign in</a></LinkContainer> and then <LinkContainer to="/login"><a>Log in</a></LinkContainer>.</p>

						<p>Second you need to create a test Campaign and then all the test memners join it.</p>

						<p>Third you need to download our <a href="https://chrome.google.com/webstore/detail/wat-chrome-plugin/fopllklfdgccljiagdpeocpdnhlmlakc">Chrome Plugin</a> and use it to record your end to end tests.</p>

						<p>When you do monkey test and record the test, please check entropy value at the same time. If its value is too large, stop doing this test.</p>
					</Col>
				</Row>

				<Row>
					<Col sm={12} md={12}>
						<h2>Who is behind Exploratory Test?</h2>
						<p>Labri group is developping Exploratory Test for monkey testing , and is proud to provide it.</p>
						<p> If you like it and want more services, please star the <a href="">Exploratory Test GitHub projet</a> or add an issue to the list.</p>
						{uRLoggedInMsg}
					</Col>
				</Row>
			</div>
		);
	}

}
