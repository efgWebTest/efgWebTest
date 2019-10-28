import React from 'react';
import {getOneScenario, removeRun} from './scenarioService.js';
import {Col, Button} from 'react-bootstrap';
import dateFormat from 'dateformat';

export default class Run extends React.Component {
	constructor(props) {
		super(props);
		let run = this.props.run;
		this.state = {
			run : run,
		};
		this.onClickRemoveRun = this.onClickRemoveRun.bind(this);
	}
    
	componentDidMount() {
		console.log('will mount');
		getOneScenario(this.state.run.sid)
			.then( scenarioArray => {
				console.log(scenarioArray);
				this.setState({
					scenario: scenarioArray[0]
				});
			})
			.catch ( (err) => {
				console.log(err);
				this.setState({
					error: err
				});
			});
	}

	onClickRemoveRun(event) {
		event.preventDefault();
		//console.log('remove');
		removeRun(this.state.run._id)
			.then( msg => {
				//console.log(msg);
			})
			.catch( err => {
				//console.log(err);
			});
	}

	render() {
		var success = <img src="img/success.png"/>;
		var failure = <img src="img/failure.png"/>;
		var scenarioName = this.state.scenario ? this.state.scenario.name : '... featching scenario';
		var date = dateFormat(this.state.run.date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
		var screenPath = `img/screen/${this.state.run._id}.png`;

		let error;
		if (this.state.run.error) {
			if (this.state.run.error.message) {
				error = <ul>Error:
					<li>{this.state.run.error.message}</li>
					<li>{this.state.run.error.code}</li>
					<li>{this.state.run.error.details}</li>
				</ul>;
			} else {
				error = <div> {this.state.run.error.toString()}</div>;
			}
		} else {
			error = <div> An Error Occured Without Any Error Message </div>; 
		}

		if (this.state.run.isSuccess) {
			return (
				<div>
					<Col xs={12} md={8} >
						<div>{success}{scenarioName}</div>
						<div>{date}</div>
						<div><a href={screenPath}>Last screen shot</a></div>
					</Col>
					<Col xs={12} md={4} >
						<Button bsStyle="danger" bsSize="large" onClick={this.onClickRemoveRun}>delete</Button>
					</Col>
				</div>
			) ;
		} else {
			return (
				<div>
					<Col xs={12} md={8} >
						<div>{failure}{scenarioName}</div>
						<div>{date}</div>
						{error}
						<div><a href={screenPath}>Last screen shot</a></div>
					</Col>
					<Col xs={12} md={4} >
						<Button bsStyle="danger" bsSize="large" onClick={this.onClickRemoveRun}>delete</Button>
					</Col>
				</div>
			);
		}
		
	}

}
