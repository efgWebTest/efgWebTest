const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');
const CollectionName = 'url';

module.exports.init = (dbUrl, webServer) => {
	// const dbUrl = `mongodb://${mongoServerName}:27017/webefg_storage`;
	
	webServer
	.get('/url', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, {strict:true}, (err, urlCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					urlCollection.find().toArray()
					.then(urlsArray => {
						res.send(urlsArray).status(200).end();
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
	.post('/findOneUrl', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, (err, urlCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					var urlItem = req.body;
					urlCollection.findOne({"preUrl": urlItem.preUrl, "url":urlItem.url})
					.then(FoundUrl => {
						res.send(FoundUrl).status(200).end();
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
	.post('/saveUrl', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection(CollectionName, (err, urlCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var urlItem = req.body;
					urlItem._id = ObjectID();				

					urlCollection.save(urlItem)
					.then(savedurl => {
						res.status(200).send(savedurl).end();
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

	// webServer
	// .post('/updateUrl', (req, res) => {
	// 	MongoClient.connect(dbUrl)
	// 	.then(db => {
	// 		db.collection(CollectionName, (err, urlCollection) => {
	// 			if (err) {
	// 				res.status(404).send(err).end();
	// 				db.close();
	// 			} else {

	// 				var urlItem = req.body;

	// 				urlCollection.findOneAndUpdate({"preUrl": urlItem.preUrl, "url":urlItem.url}, urlItem)
	// 				.then(savedurl => {
	// 					res.status(200).send(savedurl).end();
	// 					db.close();					
	// 				})
	// 				.catch(err => {
	// 					winston.error(err);
	// 					res.status(500).send(err).end();
	// 					db.close();
	// 				});					
					
	// 			}
	// 		});
	// 	}).catch(err => {
	// 		winston.error(err);
	// 		res.status(500).send(err).end;
	// 	});
	// });
};