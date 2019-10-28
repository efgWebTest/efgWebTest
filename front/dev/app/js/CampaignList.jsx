import React from 'react';
import Campaign from './Campaign.jsx';
import CampaignAddOne from './CampaignAddOne.jsx';
import {getCampaignList} from './campaignService.js';
import Loader from 'react-loader';
import {PageHeader, Accordion, Col, Row, Button, Grid, Table} from 'react-bootstrap';

var REFRESH_TEMPO = 10000;

export default class CampaignList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			campaigni: [],
			loaded: false,
			intervalId: null,
			loadedAtLeastOnce: false
		};
	}

	updateCampaigni() {
		//console.log('updateCampaigni and logged');
		this.setState({
			loaded: false,
		});

		getCampaignList()
			.then(fetchedCampaigni => {
				//console.log('fetched');
				this.setState({
					campaigni: fetchedCampaigni,
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
		let interval = setInterval(() => this.updateCampaigni(), REFRESH_TEMPO);

		this.setState({
			loadedAtLeastOnce: true,
			intervalId: interval
		});

		this.updateCampaigni();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}


	render() {
		let campaigni;

		if (this.state.campaigni.length) {

			campaigni = this.state.campaigni.map((campaign, i) =>				
			    <Campaign indice={i + 1} campaign={campaign} key={campaign._id} />			    			         
		    );			
		    
		} else {
			campaigni = (
				<div>
					No campaign found.
				</div>
			);
		}

		return (
			<div>
				<Row>
					<Col xs={12} md={8} >
						<PageHeader>Your campaign</PageHeader>
					</Col>

					<Col xs={12} md={4} >
						<a href="/campaignAddOne">
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
					      {/*<th>Creator</th>*/}
					      {/*<th>Duration</th>*/}
					      <th>Status</th>
					      {/*<th>Entropy</th>*/}
					      <th>Detail</th>
					      {/* <th>Join</th> */}
					    </tr>
					</thead>
					<tbody>
						{campaigni}
					</tbody>
				</Table>
				
			</div>
		);
	}

}
