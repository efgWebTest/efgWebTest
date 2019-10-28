import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, browserHistory} from 'react-router-dom';
import Home from './Home.jsx';
import RunList from './RunList.jsx';
import ScenarioList from './ScenarioList.jsx';
import TestSessionList from './TestSessionList.jsx';
import TestSessionAddOne from './TestSessionAddOne.jsx';
import TestSessionEachDetail from './TestSessionEachDetail.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Logout from './Logout.jsx';
import About from './About.jsx';
import GitHub from './GitHub.jsx';
import {isLoggedIn, addListenerOnLogin} from './authenticationService.js';

import {Nav, Navbar, NavItem, Grid} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import '../style/main.less';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			logged: isLoggedIn()
		};

		addListenerOnLogin((loginState) => {
			this.setState({
				logged: loginState
			});
		});
	}

	render() {
		let navBarItems;

		if (this.state.logged) {
			navBarItems = (
				<div>
					<Nav>
						<LinkContainer to="/scenario" >
							<NavItem eventKey={5}>Scenario</NavItem>
						</LinkContainer>
					</Nav>
					<Nav>
						<LinkContainer to="/test_session" >
							<NavItem eventKey={5}>TestSession</NavItem>
						</LinkContainer>
					</Nav>
					<Nav>
						<LinkContainer to="/about" >
							<NavItem eventKey={7}>About</NavItem>
						</LinkContainer>
					</Nav>
					<Nav pullRight>
						<LinkContainer to="/logout" >
							<NavItem eventKey={4}>Logout</NavItem>
						</LinkContainer>
					</Nav>
				</div>
			);
		} else {
			navBarItems = (
				<div>
					<Nav pullRight>
						<LinkContainer to="/signup" >
							<NavItem eventKey={2}>Sign Up</NavItem>
						</LinkContainer>
						<LinkContainer to="/login" >
							<NavItem eventKey={3}>Login</NavItem>
						</LinkContainer>
					</Nav>
				</div>
			);
		}

		return (
			<Router history={browserHistory}>
				<div>
					<Navbar>
						<Navbar.Header>
							<Navbar.Brand>
								<LinkContainer to="/">
									<a href="#">Home</a>
								</LinkContainer>
							</Navbar.Brand>
						</Navbar.Header>
						{navBarItems}
					</Navbar>

					<Grid>
						<Route exact path="/" component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/signup" component={Signup} />
						<Route path="/logout" component={Logout} />
						<Route path="/scenario" component={ScenarioList} />
						<Route path="/test_session" component={TestSessionList} />
						<Route path="/testSessionAddone" component={TestSessionAddOne} />
						<Route path="/testSessionEachDetail/:testSessionId" component={TestSessionEachDetail} />
						
						<Route path="/about" component={About} />
						<Route path="/github" component={GitHub} />
					</Grid>
				</div>
			</Router>
		);
	}
}

render(<App />, document.getElementById('app'));
