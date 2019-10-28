import axios from 'axios';

const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');

export function getCampaignList() {
	const url = `${BASE_URL}/api/campaign`;
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

export function addOneCampaign(credentials) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/campaign`;
		axios.post(url, credentials)
		.then(response => {
			switch (response.status) {
				case 200:
				resolve('Test Campaign created');
				break;
				case 409: 
				resolve('Test Campaign already created');
				break;
				default: 
				resolve('Error : Test Campaign cannot be created');
			}
		})
		.catch(err => {
			reject(err);
		});
	});
}

export function getOneCampaign(cId) {
	const url = `${BASE_URL}/api/campaign/${cId}`;
	return get(url);
}

export function joinCampaign(campaign) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/campaign`;
		axios.post(url, campaign, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`}})
		.then( response => {
			resolve(response.data);
		})
		.catch(err => {
			reject(err);
		});
	});
}

export function isCampaignMember(isTestMemberParameters) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/campaign/isTestMember`;
		axios.get(url, isTestMemberParameters, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`}})
		.then( response => {
			switch (response.status){
				case 200:
				resolve(true);
				break;
				default:
				resolve(false);
			}
		})
		.catch (err => {
			console.log(`Error to POST ${url} : ${err} `);
			reject(err);
		});
	});
}
