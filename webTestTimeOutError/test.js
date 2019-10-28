const puppeteer = require('puppeteer');
const wat_scenario = require('wat_scenario');
const request = require('request');
const perf = require('execution-time')();


// var rootUrl = "https://www.labri.fr";
// var noStateless = "labri";

// var rootUrl = "https://stackoverflow.com";
// var noStateless = "stackoverflow.com";


var rootUrl = "http://localhost:8888/Joomla_3_5_0/";
var noStateless = "http://localhost:8888/Joomla_3_5_0";

// beginRoot(rootUrl);


rootDeepFirstSearch(rootUrl);
async function rootDeepFirstSearch(rootUrl) {
	//1.   GUI = rootUrl;
	var windowExisted = await findOneWindow(rootUrl);
	if (windowExisted.length === 0) {
		await saveWindowToMongodb(rootUrl);
	}

	perf.start('dfsTime');// start the run time

	//2.Recursive
	await deepFirstSearchRecursive(rootUrl);
	const resultsDfsTime = perf.stop('dfsTime');
	console.log(resultsDfsTime.time); // in milliseconds
	console.log('testing the whole web app is finished!');

}

async function deepFirstSearchRecursive(url) {
	//1. goto this url and crawl to get all actions.
	// this.page = await createPage();
	var crawlActions = await crawlAllPossibleActions(url);
    var clickActions = crawlActions.clickActions;
    var typeActions = crawlActions.typeActions;
    console.log('clickActions length: ', clickActions.length);
    console.log('typeActions length: ', typeActions.length);
	console.log(clickActions);

    //save all the Type actions.
    for (var i = typeActions.length - 1; i >= 0; i--) {
        let typeActionExisted = await findOneAction(typeActions[i]);
        if (typeActionExisted.length === 0 ) {
            let actionToStore = typeActions[i];
            await saveActionToMongodb(actionToStore);
        }
    }
    


	//2. for each action do {
		//2.1  run the action
		//2.2  newUrl = get the new window or Url
		//2.3  GUI = GUI U newUrl
		//2.4  deepFirstSearchRecursive(newUrl)
	//}
	for (var i = clickActions.length - 1; i >= 0; i--) {

		//  Did the action be excuted yet? Has it been implemented?
		var actionExisted = await findOneAction(clickActions[i]);
		if (actionExisted.length === 0 ) {
			
			//2.0  run the action		
			// let runResult = await runOneAction(clickActions[i]);
			let runResult = await runClickAction(clickActions[i]);
			console.log(runResult.success);
			// 2.1 save the action to mongo
			let actionToStore = clickActions[i];
			actionToStore.success = runResult.success;
			await saveActionToMongodb(actionToStore);

			if (runResult.success) {
                console.log('run action result success');
				//2.2  newUrl = get the new window or Url
				let newUrl = runResult.newUrl;

				//2.21 save the relation of preUrl and newUrl
				let urlExisted = await findOneUrl(url, newUrl);				
				if (urlExisted.length === 0 ) {
					await saveUnionGUI(url, newUrl);
				}

				//the url is still in the web app, not goto other websites.
				if (newUrl.indexOf(noStateless) != -1) {

					//2.3  GUI = GUI U newUrl
					let windowExisted = await findOneWindow(newUrl);
					if (windowExisted.length === 0) {
						await saveWindowToMongodb(newUrl);
						//2.4  deepFirstSearchRecursive(newUrl)
						await deepFirstSearchRecursive(newUrl);
					}				

				}			

			}


		}		
	}
}



async function createPage() {
    let browser;
    let page;    
    // const browser = await puppeteer.launch();
    this.browser = await puppeteer.launch({headless: false, args:['--no-sandbox']});
    page = await this.browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 800
    });
    return page;
}

function scanAction() {
    //click actions include <a>  <button> 
    let actions = [];
    let computeCSSSelector = window['OptimalSelect'].select;
    let aElements = document.querySelectorAll('a');
    for (let i=0 ; i < aElements.length ; i++) {
        if (! isMailTo(aElements[i])) actions.push(computeCSSSelector(aElements[i]));
    }
    // let buttonElements = document.querySelectorAll('button');
    // for (let i=0 ; i < buttonElements.length ; i++) {
    //     if (! isMailTo(buttonElements[i])) actions.push(computeCSSSelector(buttonElements[i]));
    // }
    return actions;

    function isMailTo(element) {
        let href = element.href;
        return href && (href.toLowerCase().indexOf('mailto') > -1);        
    }
}

function scanTypeAction() {
    let typeActions = [];
    let computeCSSSelector = window['OptimalSelect'].select;   
    //inputs include 'input.text'  'input.password'
    let inputElements = document.querySelectorAll("input[type='text']");    
    for (let i=0 ; i < inputElements.length ; i++) {
        typeActions.push(computeCSSSelector(inputElements[i]));
    }
    let passwordElements = document.querySelectorAll("input[type='password']");    
    for (let i=0 ; i < passwordElements.length ; i++) {
        typeActions.push(computeCSSSelector(passwordElements[i]));
    }  

    return typeActions;
}

function saveActionToMongodb(action){
	var postUrl = 'http://localhost:8086/saveAction';
	var actionItem = {};
	var actionJSON = JSON.parse(JSON.stringify(action.action));
	actionItem.preUrl = action.preUrl;
    actionItem.success = action.success;    
    // actionItem.preAction = null;
    actionItem.action = actionJSON;
    request.post(postUrl, {form:actionItem});
}

function findOneAction(action) {
    var postUrl = 'http://localhost:8086/findOneAction';        
    var actionItem = {};
    var actionJSON = JSON.parse(JSON.stringify(action.action));
    actionItem.preUrl = action.preUrl;
    // actionItem.url = url;
    actionItem.action = actionJSON;
    return new Promise(function(resolve, reject) {
        request.post({url:postUrl, form:actionItem}, function(err,httpResponse,body){
            if (err) {
                console.log("findOneAction is err");
                reject(err);
            } else{
                resolve(body);
            }
        });
    });
}

function findOneUrl(preUrl, url) {
    var postUrl = 'http://localhost:8086/findOneUrl';    
    var urlItem = {};
    urlItem.preUrl = preUrl;
    urlItem.url = url;
    return new Promise(function(resolve, reject) {
        request.post({url:postUrl, form:urlItem}, function(err,httpResponse,body){
            if (err) {
                console.log("findOneUrl is err");
                reject(err);
            } else{
                resolve(body);
            }
        });
    });
    // return request.post(postUrl, {form:urlItem});
}

function saveUnionGUI(preUrl, url){
    var postUrl = 'http://localhost:8086/saveUrl';
    var urlItem = {};
    urlItem.preUrl = preUrl;
    urlItem.url = url;
    return request.post(postUrl, {form:urlItem});
}

function findOneWindow(url) {
    var postUrl = 'http://localhost:8086/findOneWindow'; 
    var windowItem = {};
    windowItem.url = url;
    return new Promise(function(resolve, reject) {
        request.post({url:postUrl, form:windowItem}, function(err,httpResponse,body){
            if (err) {
                console.log("findOneWindow is err");
                reject(err);
            } else{
                resolve(body);
            }
        });
    });
}

function saveWindowToMongodb(url){
    var postUrl = 'http://localhost:8086/saveWindow';
    var windowItem = {};
    windowItem.url = url;
    request.post(postUrl, {form:windowItem});
}

async function goBackToPreUrl(preUrl){
    let newGotoAction = new wat_scenario.GotoAction(preUrl);
    let scenario = new wat_scenario.Scenario();
    scenario.addAction(newGotoAction);
    let runGotoSecnarioResult = await scenario.run(this.page);
}

async function crawlAllPossibleActions(url){
	//input the url and return the crawled actions.
	var crawlActions = [];
	try {
		let page = await createPage();		
		let gotoAction = new wat_scenario.GotoAction(url);
		let scenario = new wat_scenario.Scenario();
		scenario.addAction(gotoAction);
		let runGotoSecnarioResult = await scenario.run(page);
		if (runGotoSecnarioResult.success) {
			await page.addScriptTag({path:'./optimal-select.js'});
            let clickSelectors = await page.evaluate(scanAction);
			let typeSelectors = await page.evaluate(scanTypeAction);
            // let selectors = await page.evaluate(scanAllAction);
            // let clickSelectors = selectors.clickActions;
            console.log(clickSelectors.length);
            console.log(typeSelectors.length);

            let clickActions = [];
            let typeActions = [];

            for (var i = clickSelectors.length - 1; i >= 0; i--) {
                await clickActions.push({
                   preUrl : url,
                   action : new wat_scenario.ClickAction(clickSelectors[i])                   
               });
            }

            for (var i = typeSelectors.length - 1; i >= 0; i--) {
                await typeActions.push({
                    preUrl : url,
                    action : new wat_scenario.TypeAction(typeSelectors[i], 'input example')                    
                });
            }

            crawlActions.clickActions = clickActions;
            crawlActions.typeActions = typeActions;
            console.log(crawlActions.typeActions);
		}
		await page.close();
		await this.browser.close();
		return crawlActions;
	} catch(err){
		console.log('Function crawlAllPossibleActions has error:',err);
		return crawlActions;
	}	
}

async function runOneAction(crawlAction) {
	// input the crawled action and run this action with page
	// return the run result.
	let url = crawlAction.preUrl;	
	let action = crawlAction.action;
	console.log('the url is :', url);
	console.log('the action is :', action);


	let gotoAction = new wat_scenario.GotoAction(url);
	let scenario = new wat_scenario.Scenario();
	scenario.addAction(gotoAction);
	scenario.addAction(action);

	let page = await createPage();
	let runSecnarioResult = await scenario.run(page);
	if (runSecnarioResult.success) {
		runSecnarioResult.newUrl = page.url();
	}

	await page.close();
	await this.browser.close();
	return runSecnarioResult;
}

async function runClickAction(crawlAction){

	let url = crawlAction.preUrl;
	let action = crawlAction.action;
    let runSecnarioResult = {};
    // let runSecnarioResult = null;
    let actionJSON = JSON.parse(JSON.stringify(action));
    let page = await createPage();

    let gotoAction = new wat_scenario.GotoAction(url);    

    try {
        console.log('goto this url: ', url);
    	await gotoAction.run(page);
        console.log('click the selector: ', actionJSON.selector);
    	await page.click(actionJSON.selector);
        await page.waitFor(1000);
    	await page.waitForSelector('body');
        // console.log('waitForSelector body is done.');
    	// page.waitFor(2000);
    	let newUrl = await page.url();
        console.log('after click action, the new Url is:', newUrl);

    	// page.on('newpage', async (new_page) => {
    	// 	let url = new_page.url();
    	// 	console.log('Browser opened new tab', url);
    	// 	page = await new_page.page();
    	// 	console.log('new page is open page url', page.url());
    	// });

    	await page.close();
    	await this.browser.close();	

    	return {
    		success : true,
    		newUrl : newUrl
    	}
    } catch(err) {
    	await page.close();
    	await this.browser.close();
    	return {
    		success : false,
    		error : err
    	}
    }

}


