const {MongoClient} = require('mongodb') //importing the object MongoClient from the driver

const url = 'mongodb://localhost/waitlist' //URL that identifies a database to connect to, waitlist in our case

/*function testWithCallbacks(callback) {
    console.log('\n--- testWithCallbacks ---');
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true}); //client constructor with a setting to use new style parser (?) to avoid warning in Node.js driver (version 3.1)
    client.connect(function(err,client) {
        if (err) {
            callback(err);
            return;
        }
        console.log('Connected to MongoDB');

        const db = client.db() //connection to the database is obtained by calling the .db() method of the client object
        const collection = db.collection('customers') //introducing 'customers' collection, getting a handle to it through db (connection to the waitlist db)

        const customer = {queue_number: 1, name: 'Val', contact_number: 90072169 }; //a document to be used for a test
        collection.insertOne (customer, function(err, result) { //inserting this document from above
            if (err) { //on an error
                client.close(); //close the connection to the server
                callback(err); //call the callback
                return //return from the call so that no more operations are performed
            }
            console.log('Result of insert:\n', result.insertedId) //printing the new _id(system generated) that was create
            collection.find({_id: result.insertedId}).toArray(function(err,docs) { //reading back the document
                if(err) {
                    client.close();
                    callback(err);
                    return
                }
                console.log('Result of find:\n', docs);
                client.close(); //now that we're done inserting and reading back the document, we can close the connection to the server, otherwise Node.js program will not exit
                callback(err); //if there're any errors, they will be passed to this customary callback function added after all the operations are complete
            });
        });
    });
}*/

async function testWithAsync() { //implementing another function that uses async/await paradigm. To be used in the Issue tracker when interacting with the database in the future
    console.log('\n---testWithAsync---');
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true})//the same way to construct a MongoDB client
    try { //single try block can help to catch any error in one place (catch block below) rather than after each call
        await client.connect(); //waiting for the call to complete to run the result
        console.log('Connected to MongoDB')
        const db = client.db();
        const collection = db.collection('customers');

        collection.deleteMany({});

        const customer_1 = {queue_number: 1, name: 'Glasha', contact_number: 90721467, timestamp: new Date()};
        const result_1 = await collection.insertOne(customer_1); //result of the call can directly be assigned to a variable like a return value from the function call
        console.log('Result of insert:\n', result_1.insertedId);

        //inserting another customer
        const customer_2 = {queue_number: 2, name: 'Val', contact_number: 90072169, timestamp: new Date()};
        const result_2 = await collection.insertOne(customer_2); //result of the call can directly be assigned to a variable like a return value from the function call
        console.log('Result of insert:\n', result_2.insertedId);

        /*const docs = await collection.find({_id: result.insertedId}).toArray();
        console.log('Result of find:\n', docs);*/

        const read_all_custmomers = await collection.find().toArray();
        console.log('Result of reading all customers:\n', read_all_custmomers);

        collection.deleteOne({ queue_number: 1 });
        const read_new_all_custmomers = await collection.find().toArray();
        console.log('Result of reading all customers after deletion:\n', read_new_all_custmomers);

    } catch (err) {
        console.log(err);
    } finally {
        client.close()
    }
}

testWithAsync();

/*
testWithCallbacks(function(err) { //MAIN PART OF THE PROGRAM: A call to the testWithCallbacks() function from the main section, supplied with a callback to receive any error
    if (err) {
        console.log(err); //print an error if any received
    }
    testWithAsync(); //calling testWithAsync() within the callback that handles the return value from testWithCallbacks()
});
*/


