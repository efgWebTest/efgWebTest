const puppeteer = require('puppeteer');
const wat_scenario = require('wat_scenario');
const request = require('request');
const perf = require('execution-time')();


// var rootUrl = "https://www.labri.fr";
// var noStateless = "labri";

var rootUrl = "https://stackoverflow.com";
var noStateless = "stackoverflow.com";


// var rootUrl = "http://localhost:8888/Joomla_3_5_0/";
// var noStateless = "http://localhost:8888/Joomla_3_5_0";

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
	console.log(resultsDfsTime.time);
	console.log('testing the whole web app is finished!');

}

async function deepFirstSearchRecursive(url) {
	//1. goto this url and crawl to get all actions.
	// this.page = await createPage();
	var crawlActions = await crawlAllPossibleActions(url);
	// console.log(crawlActions);

	//2. for each action do {
		//2.1  run the action
		//2.2  newUrl = get the new window or Url
		//2.3  GUI = GUI U newUrl
		//2.4  deepFirstSearchRecursive(newUrl)
	//}
	for (var i = crawlActions.length - 1; i >= 0; i--) {

		//  Did the action be excuted yet? Has it been implemented?
		var actionExisted = await findOneAction(crawlActions[i]);
		if (actionExisted.length === 0 ) {
			
			//2.0  run the action		
			// let runResult = await runOneAction(crawlActions[i]);
			let runResult = await runClickAction(crawlActions[i]);
			console.log(runResult.success);
			// 2.1 save the action to mongo
			let actionToStore = crawlActions[i];
			actionToStore.success = runResult.success;
			await saveActionToMongodb(actionToStore);

			if (runResult.success) {
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





async function beginRoot(rootUrl){
    //initial a browser and create a page.
    this.page = await createPage();
    // let page = await createPage();

    // var rootGotoAction = new wat_scenario.GotoAction(rootUrl);
    // await saveActionToMongodb(rootGotoAction);
    var rootGotoAction = {
        preUrl : rootUrl,
        action : new wat_scenario.GotoAction(rootUrl)
    };

    console.log('rootGotoAction is ',rootGotoAction);


    // GUI = Root
    // var tree = rootUrl;    
    // await saveRootGUI(rootUrl);
    
    // await deepFirstSearch(page, rootGotoAction);    
    await deepFirstSearch(rootGotoAction);    
    // console.log("the url after goBack =" + page.url());
    // await page.close();
    // await browser.close();
}

// async function deepFirstSearch(page, action){   
async function deepFirstSearch(actionWindow){ 
    var action = actionWindow.action;  
    var preUrl = actionWindow.preUrl; //action is in the page of this URL
    console.log('the preUrl is:', preUrl);
    // var preUrl = page.url(); //action is in the page of this URL    
    // var preUrl = this.page.url(); //action is in the page of this URL
    // if (preUrl.indexOf('about:blank')!= -1) {
    //     preUrl = this.rootUrl;
    // }   
    
    var actionExisted = await findOneAction(actionWindow);
    // console.log(actionExisted);
    if (actionExisted.length === 0 ) {
        // console.log("can not find one action and save the new action to mongo");
        //excute the action
        console.log('action that will be excute:');
        console.log(action);
        var scenario = new wat_scenario.Scenario();
        var waitAction = new wat_scenario.WaitAction(2000);
        scenario.addAction(action);
        scenario.addAction(waitAction);
        // let runSecnarioResult = await scenario.run(page);

        let runSecnarioResult = await scenario.run(this.page);       

        // let runActionResult = await action.run(page);
        // var runActionResult = await runAction(page, action);        
        // console.log("excute the action result:");
        // console.log(runSecnarioResult);
        if (runSecnarioResult.success) {
            // console.log("the action is runned success! Now it will be save to mongo"); 
            await saveActionToMongodb(actionWindow);
            //get the new window (url)
            // var url = page.url();
            var url = this.page.url();
            //Union the GUI
            //GUI = GUI U url
            var urlExisted = await findOneUrl(preUrl, url);
            if (urlExisted.length === 0 ) {
                await saveUnionGUI(preUrl, url);
            }    

            var windowExisted = await findOneWindow(url);
            // if (windowExisted.length === 0)
            if ((url.indexOf(noStateless) != -1) && (windowExisted.length === 0)) {// no stateless// make sure it is inside of the web
                
                await saveWindowToMongodb(url);       

                //and crawl the children actions
                // await page.addScriptTag({path:'./optimal-select.js'});
                await this.page.addScriptTag({path:'./optimal-select.js'});
                // console.log("test");
                // let selectors = await page.evaluate(scanAction);
                let selectors = await this.page.evaluate(scanAction);

                //get all the actions.                
                var nextActions = [];
                // selectors.forEach(selector => {
                //     nextActions.push({
                //         action : new wat_scenario.ClickAction(selector)
                //     });
                // });
                for (var i = selectors.length - 1; i >= 0; i--) {
                    nextActions.push({
                        preUrl : url,
                        action : new wat_scenario.ClickAction(selectors[i])
                    });
                }

                for (var i = nextActions.length - 1; i >= 0; i--) {
                    // await deepFirstSearch(page, nextActions[i].action);
                    await deepFirstSearch(nextActions[i]);
                }

            }
            // page.goBack();
            // this.page.goBack();
            goBackToPreUrl(preUrl);

        } else if(runSecnarioResult.success === false){
            console.log("the action is runned false!");            
            await this.page.close();
            await this.browser.close();
            this.page = await createPage();

            let newGotoAction = new wat_scenario.GotoAction(preUrl);
            console.log('after action failed, go to the preUrl is: ', preUrl);
            let scenario = new wat_scenario.Scenario();
            scenario.addAction(newGotoAction);
            let runGotoSecnarioResult = await scenario.run(this.page);
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
    let actions = [];
    let computeCSSSelector = window['OptimalSelect'].select;
    let aElements = document.querySelectorAll('a');
    for (let i=0 ; i < aElements.length ; i++) {
        if (! isMailTo(aElements[i])) actions.push(computeCSSSelector(aElements[i]));
    }
    return actions;

    function isMailTo(element) {
        let href = element.href;
        return href && (href.toLowerCase().indexOf('mailto') > -1);        
    }
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
			let selectors = await page.evaluate(scanAction);
			for (var i = selectors.length - 1; i >= 0; i--) {
				await crawlActions.push({
					preUrl : url,
					action : new wat_scenario.ClickAction(selectors[i])
				});
			}
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
    console.log('goto this url: ', url);

    try {
    	await gotoAction.run(page);
    	await page.click(actionJSON.selector);
    	await page.waitForSelector('body');
    	// page.waitFor(2000);
    	let newUrl = page.url();

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


