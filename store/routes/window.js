const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');
const CollectionName = 'window';

module.exports.init = (dbUrl, webServer) => {
	// const dbUrl = `mongodb://${mongoServerName}:27017/webefg_storage`;
	
	webServer
	.get('/window', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, {strict:true}, (err, windowCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					windowCollection.find().toArray()
					.then(windowsArray => {
						res.send(windowsArray).status(200).end();
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
	.post('/findOneWindow', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, (err, windowCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					var windowItem = req.body;
					windowCollection.findOne({"url":windowItem.url})
					.then(FoundWindow => {
						res.send(FoundWindow).status(200).end();
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
	.post('/saveWindow', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, (err, windowCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var windowItem = req.body;
					windowItem._id = ObjectID();			

					windowCollection.save(windowItem)
					.then(savedwindow => {
						res.status(200).send(savedwindow).end();
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

};