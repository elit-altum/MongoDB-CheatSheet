// requires the native mongo driver
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

// 1. for connecting to mongodb
const connectionURL = 'mongodb://<insert url here>';
const databaseName = 'task-manager-app';

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {

    // if problems connecting
    if(error) {
        return console.log('Unable to connect to database!');
    }
           
    // if successfully connected
    console.log('Connected to databse successfully!');

    // connecting to specific database    
    const db = client.db(databaseName); // db now stores a reference to databaseName, used for manipulation


    /*IMPORTANT : 
        All the methods used on the collections return a promise i.e (then ...catch) if the callback
        function is not provided as an argument. Resolve and reject are returned accordingly.
    */

    /* IMPORTANT : 
        The promises/callbacks are only rejected/store an error, if there is a failure connecting
        to Mongo. Failure to find a collection with the specified name or a document while modifying
        a collection, resolve the promise and should be checked for otherwise.
    */

    // 2. adding a single document to a specific collection
        db.collection('users').insertOne({
            name: 'Jen',
            age: 21
        }, (error, result) => {
            // asynchronous callback

            if (error) {
                return console.log('Unable to add document');
            }

            // result stores success .insertedCount stores number of docs insterted
            // .ops displays an array of all documents stored
            console.log(result.ops);
        });

    // 3. adding multiple documents to a specific collection
        db.collection('tasks').insertMany([{
            description: 'Get vegetables',
            completed: false,
        }, {
            description: 'Water Plants',
            completed: false,
        }, {
            description: 'Meditate',
            completed: true,
        }], (error, result) => {
            if (error) {
                return console.log('Unable to add documents!');
            }

            console.log(result.insertedCount); // returns 3
        });
    
    // 4. finding/querying a document from a collection

        // 4.a. querying using field value matching i.e ({field: value})
        db.collection('users').findOne({ name: 'Manan'}, (error, user) => {
            if (error) {
                return console.log('Cannot connect to mongo');
            }

            if (!user) {
                // not finding a matching result isn't an error. If no results found, user stores value of 'null'
                console.log('User not found');
            } else {
                // if found, log result to console
                console.log(user);
            }
        })

        // 4.a. querying using id value matching i.e ({_id: value})
        db.collection('users').findOne({ _id: new ObjectID("5e1ad19c0108701064ed8c7a")}, (error, user) => {
        
            /*_id is stored as a binary therefore, we need to convert given string id
             to binary using ObjectID constructor provided by the mongo driver */
            if (error) {
                return console.log('Cannot connect to mongo');
            }
    
            if (!user) {
                console.log('User not found');
            } else {
                console.log(user);
            }
        })
    
    // 5. finding/querying multiple docs from collection

        // a pointer (called cursor) to all the matching documents is returned which is used further
        const foundCursor = db.collection('tasks').find({ completed : false });
        
            // 5.a for getting all documents as array of objects
            foundCursor.toArray( (error, tasks) => {

                // error stores connection errors only
                if (error) {
                    return console.log('Cannot connect to mongo');
                }

                // tasks store all the matching documents as an array
                if (tasks.length > 0) {
                    // if any tasks are found
                    console.log(tasks);

                } else {
                    console.log('No matching tasks found');
                }
            });

            // 5.b. for counting all the returned/matching documents
            foundCursor.count( (error, count) => {
                if (error) {
                    return console.log('Cannot connect to mongo')
                }
        
                // count stores number of matching documents. Stores 0 if none found.
                if(!count) {
                    console.log('No matching tasks found')
                } else {
                    console.log(count);
                }
            });

    // 6. updating a document in a collection
        db.collection('users').updateOne({ name: 'Sam'}, {
            $set: {
                // set is an update operator, only changes the provided value none else
                name: 'James'
            },
            $inc: {
                // inc is an update operator, only for number fields, it increments or
                // decrements(use negative number) the specified field by the provided number
                age: 1
            }
        }).then( (result) => {
            console.log(result);

        }).catch( (error) => {

            console.log(error);
        });

    // 7. updating multiple documents in a collection
        db.collection('tasks').updateMany({ completed: false}, {
            $set: {
                completed: true
            }
        }).then( (result) => {
            // returns number of documents modified/updated
            // if no documents are matched, modifiedCount = 0
            console.log(result.modifiedCount);
        }).catch( (error) => {
            console.log(error);
        });

    // 8. deleting a document from a collection
        db.collection('users').deleteOne({ name: 'Manan' }).then( (result) => {

            // if no matching user found result.deletedCount = 0 
            if(!result.deletedCount) {
                console.log('No user found');
            } else {
                console.log('User deleted');
            }

        }).catch( (error) => {
            console.log('Cannot connect to mongo');
        });
    
    // 9. deleting multiple documents from a collection
        db.collection('tasks').deleteMany({ completed: true }).then( (result) => {

            if(!result.deletedCount) {
                console.log('No documents found');
            } else {
                console.log(result.deletedCount + ' tasks deleted');
            }

        }).catch( (error) => {
            console.log('Cannot connect to Mongo', error);
        });

    
});




