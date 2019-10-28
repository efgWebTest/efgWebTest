import axios from 'axios';

const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');

export function getTestSessionList() {
	const url = `${BASE_URL}/api/test_session`;
	return get(url);
}

export function getOwnerName(ownerId) {
	const url = `${BASE_URL}/api/user/name/${ownerId}`;
	return get(url);
}

function get(url) {
	return new Promise((resolve, reject) => {
		axios.get(url, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`}})
			.then( response => {
				console.log(`Response to GET ${url} : ${response.data}`);
				resolve(response.data);
			})
			.catch (err => {
				console.log(`Error to GET ${url} : ${err} `);
				reject(err);
			});
	});
}


export function addOneTestSession(credentials) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/test_session`;
		axios.post(url, credentials)
			.then(response => {
				switch (response.status) {
				case 200:
					resolve('Test Session created');
					break;
				case 409: 
					resolve('Test Session already created');
					break;
				default: 
					resolve('Error : Test Session cannot be created');
				}
			})
			.catch(err => {
				reject(err);
			});
	});
}

export function getOneTestSession(tsid) {
	console.log('getOneTestSession');
	const url = `${BASE_URL}/api/test_session/${tsid}`;
	return get(url);
}















export function getOneScenario(sid) {
	console.log('getOne');
	const url = `${BASE_URL}/api/scenario/${sid}`;
	return get(url);
}

export function removeScenario(sid) {
	const url = `${BASE_URL}/api/scenario/${sid}`;
	return new Promise((resolve, reject) => {
		axios.delete(url,{headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`}})
			.then( response => {
				//console.log(`Response to DELETE ${url} : ${response.data}`);
				resolve(response.data);
			})
			.catch (err => {
				//console.log(`Error to DELETE ${url} : ${err} `);
				reject(err);
			});
	});
}

export function removeRun(rid) {
	const url = `${BASE_URL}/api/run/${rid}`;
	return new Promise((resolve, reject) => {
		axios.delete(url, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`}})
			.then( response => {
				//console.log(`Response to DELETE ${url} : ${response.data}`);
				resolve(response.data);
			})
			.catch (err => {
				//console.log(`Error to DELETE ${url} : ${err} `);
				reject(err);
			});
	});
}

export function scheduleScenario(sid, isScheduled) {
	let url;
	if (isScheduled) {
		url = `${BASE_URL}/api/schedule/schedule/${sid}`;
	} else {
		url = `${BASE_URL}/api/schedule/unschedule/${sid}`;
	}
	return get(url);
}

export function playNowScenario(sid) {
	const url = `${BASE_URL}/api/schedule/playnow/${sid}`;
	return get(url);
}

export function getRunForScenario(sid) {
	const url = `${BASE_URL}/api/run/scenario/${sid}`;
	return get(url);
}

export function getRunForUser() {
	const url = `${BASE_URL}/api/run/user`;
	return get(url);
}



export function pushScenario(scenario) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/scenario`;
		axios.post(url, scenario, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`}})
			.then( response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
