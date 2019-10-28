import React from 'react';
import { Jumbotron, Row, Col, Label } from 'react-bootstrap';

export default class About extends React.Component {

	render() {
		return (
			<div>
				<Row>
					<Jumbotron fluid><h1>Join Exploratory Test</h1>
						<h2 className="page-subtitle">The Web APP Explorotory Monkey Test Environment !</h2>
						<Label className="label-danger-orange">Beta test edition</Label>
					</Jumbotron>
				</Row>
				<Row>
					<Col sm={12} md={12}>
						<h2>Help us to improve Exploratory Test?</h2>
						<p>Exploratory Test is composed of several <a href="https://github.com/labri-progress/ExploratoryTest">projects</a>.</p>
						<p>Feel free to add issues or to post bug reports</p>
						<p>Please create issues in the <a href="https://github.com/labri-progress/ExploratoryTest">ExploratoryTest docker-compose</a> project.</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12} md={12}>
						<h2>Who is behind Exploratory Test?</h2>
						<p>Labri software group is developping Exploratory Test for mokey testing , and is proud to provide it.</p>
						<p>If you want to deploy Exploratory Test in your organisation, don't hesitate to contact us.</p>
					</Col>
				</Row>
			</div>
		);
	}

}
