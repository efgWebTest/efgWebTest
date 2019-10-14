const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');
const CollectionName = 'action';

module.exports.init = (dbUrl, webServer) => {
	// const dbUrl = `mongodb://${mongoServerName}:27017/webefg_storage`;
	
	webServer
	.get('/action', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, {strict:true}, (err, actionCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					actionCollection.find().toArray()
					.then(actionsArray => {
						res.send(actionsArray).status(200).end();
						db.close();
					})
					.catch(err => {
						res.status(500).send(err).end();
						db.close();
					});
				}
			});
		})
		.catch(err => {
			winston.info(err);
			res.status(500).send(err).end;
		});
	});

	webServer
	.post('/saveAction', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, (err, actionCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var actionItem = req.body;
					actionItem._id = ObjectID();
					winston.info(`get the req body : ${req.body})`);				

					actionCollection.save(actionItem)
					.then(savedAction => {
						res.status(200).send(savedAction).end();
						db.close();					
					})
					.catch(err => {
						winston.error(err);
						res.status(500).send(err).end();
						db.close();
					});					
					
				}
			});
		}).catch(err => {
			winston.error(err);
			res.status(500).send(err).end;
		});
	});

	webServer
	.post('/findOneAction', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, (err, actionCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					var actionItem = req.body;
					// actionCollection.findOne({"preUrl": actionItem.preUrl, "url":actionItem.url, "action":actionItem.action})
					actionCollection.findOne({"preUrl": actionItem.preUrl, "action":actionItem.action})
					.then(FoundAction => {
						res.send(FoundAction).status(200).end();
						db.close();
					})
					.catch(err => {
						res.status(500).send(err).end();
						db.close();
					});
				}
			});
		})
		.catch(err => {
			winston.info(err);
			res.status(500).send(err).end;
		});
	});

};