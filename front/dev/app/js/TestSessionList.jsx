import React from 'react';
import TestSession from './TestSession.jsx';
import TestSessionAddOne from './TestSessionAddOne.jsx';
import {getTestSessionList} from './testSessionService.js';
import Loader from 'react-loader';
import {PageHeader, Accordion, Col, Row, Button, Grid, Table} from 'react-bootstrap';

var REFRESH_TEMPO = 10000;

export default class TestSessionList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			testSessioni: [],
			loaded: false,
			intervalId: null,
			loadedAtLeastOnce: false
		};
	}

	updateTestSessioni() {
		//console.log('updateTestSessioni and logged');
		this.setState({
			loaded: false,
		});

		getTestSessionList()
			.then(fetchedTestSessioni => {
				//console.log('fetched');
				this.setState({
					testSessioni: fetchedTestSessioni,
					loaded: true,
					loadedAtLeastOnce: true
				});
			})
			.catch((err) => {
				//console.log(`error:${err}`);
				this.setState({
					loaded: true
				});
			});
	}

	componentWillMount() {
		let interval = setInterval(() => this.updateTestSessioni(), REFRESH_TEMPO);

		this.setState({
			loadedAtLeastOnce: true,
			intervalId: interval
		});

		this.updateTestSessioni();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}


	render() {
		let testSessioni;
		let testSessioniCopy;

		if (this.state.testSessioni.length) {

			testSessioni = this.state.testSessioni.map((test_session, i) =>				
			    <TestSession indice={i + 1} testSession={test_session} key={test_session._id} />			    			         
		    );			
		    
		} else {
			testSessioni = (
				<div>
					No testSession found. Upload a testSession thanks to our <a href="https://chrome.google.com/webstore/detail/wat-chrome-plugin/fopllklfdgccljiagdpeocpdnhlmlakc">Chrome Plugin</a>.
				</div>
			);
		}

		return (
			<div>
				<Row>
					<Col xs={12} md={8} >
						<PageHeader>Your testSession</PageHeader>
					</Col>

					<Col xs={12} md={4} >
						<a href="/testSessionAddOne">
							<Button bsStyle="warning" bsSize="large">
								Add Test ?												
							</Button>
						</a>
					</Col>
				</Row>

				<Row>
					<Col xs={12} md={12} >
						<Loader loaded={this.state.loadedAtLeastOnce}></Loader>
					</Col>					
				</Row>

				<Table striped bordered hover>
					<thead>
					    <tr>
					      <th>#</th>
					      <th>Name</th>
					      <th>URL</th>
					      <th>Owner</th>
					      <th>Duration</th>
					      <th>Status</th>
					      <th>Entropy</th>
					      <th>Detail</th>
					      <th>Join</th>
					    </tr>
					</thead>
					<tbody>
						{testSessioni}
					</tbody>
				</Table>
				
			</div>
		);
	}

}
