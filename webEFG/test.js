const puppeteer = require('puppeteer');
const wat_scenario = require('wat_scenario');
// const wat_scenario = require('test_scenario');
const request = require('request');


var rootUrl = "https://www.labri.fr";
beginRoot(rootUrl);


async function beginRoot(rootUrl){
    this.rootUrl = rootUrl;
    //initial a browser and create a page.
    this.page = await createPage();
    // let page = await createPage();

    var scenario = new wat_scenario.Scenario();
    // var rootGotoAction = new wat_scenario.GotoAction('https://www.labri.fr');
    var rootGotoAction = new wat_scenario.GotoAction(rootUrl);

    // await saveActionToMongodb(rootGotoAction);

    // GUI = Root    
    // await saveRootGUI(this.rootUrl);
    
    // await deepFirstSearch(page, rootGotoAction);    
    await deepFirstSearch(rootGotoAction);    
    // console.log("the url after goBack =" + page.url());
    // await page.close();
    // await browser.close();
}

// async function deepFirstSearch(page, action){   
async function deepFirstSearch(action){   
    // var preUrl = page.url(); //action is in the page of this URL   
    var preUrl = this.page.url(); //action is in the page of this URL
    // if (preUrl.indexOf('about:blank')!= -1) {
    //     preUrl = this.rootUrl;
    // }
    
    var actionExisted = await findOneAction(preUrl, action);
    // console.log(actionExisted);
    if (actionExisted.length === 0 ) {
        // console.log("can not find one action and save the new action to mongo");
        //excute the action
        console.log('action that will be excute:');
        console.log(action);        
        // var scenario = new wat_scenario.Scenario();
        // scenario.addAction(action);
        // let runSecnarioResult = await scenario.run(page);
        // let runSecnarioResult = await scenario.run(this.page);
        let runSecnarioResult = await runAction(action);
        // let runActionResult = await action.run(page);        
        console.log("excute the action result:", runSecnarioResult);
        // console.log(runSecnarioResult);
        if (runSecnarioResult.success) {
            await saveActionToMongodb(preUrl, action);
            //get the new window (url)
            // var url = page.url();
            var url = this.page.url();
            //Union the GUI
            //GUI = GUI U url
            var urlExisted = await findOneUrl(preUrl, url);
            // console.log(urlExisted);
            if (urlExisted.length === 0 ) {
                // console.log("can not find one url and save the new url to mongo");
                await saveUnionGUI(preUrl, url);
            }    

            var windowExisted = await findOneWindow(url);
            // if (windowExisted.length === 0)
            if ((url.indexOf(this.rootUrl) != -1) && (windowExisted.length === 0)) {// no stateless// make sure it is inside of the web
                
                await saveWindowToMongodb(url);       

                //and crawl the children actions
                // await page.addScriptTag({path:'./optimal-select.js'});
                await this.page.addScriptTag({path:'./optimal-select.js'});
                // console.log("test");
                // let selectors = await page.evaluate(scanAction);
                let selectors = await this.page.evaluate(scanAction);

                //get all the actions.
                var nextActions = [];
                selectors.forEach(selector => {
                    nextActions.push({
                        action : new wat_scenario.ClickAction(selector)
                    });
                });

                for (var i = nextActions.length - 1; i >= 0; i--) {
                    // await deepFirstSearch(page, nextActions[i].action);
                    await deepFirstSearch(nextActions[i].action);
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
            let scenario = new wat_scenario.Scenario();
            scenario.addAction(newGotoAction);
            let runGotoSecnarioResult = await scenario.run(this.page);

            // goBackToPreUrl(preUrl);

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

function saveActionToMongodb(preUrl, action){
    var postUrl = 'http://localhost:8086/saveAction';
    var actionJSON = JSON.parse(JSON.stringify(action));
    var actionItem = {};

    actionItem.preUrl = preUrl;
    // actionItem.url = url;    
    // actionItem.preAction = null;
    actionItem.action = actionJSON;
    request.post(postUrl, {form:actionItem});
}

function findOneAction(preUrl, action) {
    var postUrl = 'http://localhost:8086/findOneAction';
    var actionJSON = JSON.parse(JSON.stringify(action));    
    var actionItem = {};
    actionItem.preUrl = preUrl;
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

async function runAction(action){

    let runSecnarioResult = {};
    // let runSecnarioResult = null;
    let actionJSON = JSON.parse(JSON.stringify(action));
    // console.log(actionJSON);

    if (actionJSON.type ==='GotoAction') {
        // console.log('gotoAction actionJSON type is:', actionJSON.type);
        let scenario = new wat_scenario.Scenario();
        scenario.addAction(action);
        runSecnarioResult = await scenario.run(this.page);
    } else if (actionJSON.type === 'ClickAction') {
        // console.log('clickAction actionJSON selector is:', actionJSON.selector);
        this.page.click(actionJSON.selector);
        this.page.waitForSelector('body');
        this.page.waitFor(2000);
        runSecnarioResult.success = true;
        // runSecnarioResult.push(success : true);
    }

    this.page.on('newpage', async (new_page) => {
        let url = new_page.url();
        console.log('Browser opened new tab', url);
        this.page = await new_page.page();
        console.log('new page is open page url', this.page.url());    
                             
    });
    // console.log('this page url', this.page.url());

    return runSecnarioResult;

}

