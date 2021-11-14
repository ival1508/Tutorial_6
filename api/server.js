const fs = require('fs'); //fs module to read GraphQL file into a strong for Apollo Server
const { ApolloServer } = require('apollo-server-express'); //constructing ApolloServer object defined in the apollo-server-express package
const express = require('express');
const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost/waitlist';

let db; //global database connection variable

async function connectToDb() {
  const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const customersDB = [
  {
      queue_number: 1, name: 'Val', contact_number: 90072169, timestamp: new Date()
  },
  {
      queue_number: 2, name: 'Glasha', contact_number: 90721467, timestamp: new Date()
  }
];

const resolvers = { //copy pasting resolvers structure from the text book, now need to define these 3 functions below
  Query: {
    customerList,
    customerRequest,
  },
  Mutation: {
    customerAdd,
    customerDelete,
  },
};

async function customerList() { //async is also only needed later once database is linked
  /*return customersDB;*/
  //will use the code for the future integration with the MongoDB
  const customers = await db.collection('customers').find({}).toArray(); //using await approach to access the db
  return customers;
}

async function customerRequest(_, {customer}) { //async is also only needed later once database is linked
  /*return customersDB;*/
  //will use the code for the future integration with the MongoDB
  console.log('Customer request input:', customer.name);
  const requested_customers = await db.collection('customers').findOne( { name: customer.name } ); //
  console.log('Result of the request:', requested_customers); //using await approach to access the db
  return requested_customers;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').updateOne(
    { _id: name },
    { $inc: { current: 1 } },
    //{ returnOriginal: false },
  );
  const updated_counter = await db.collection('counters').findOne({ _id: name });
  return updated_counter.current;
}

async function reduceSequenceByOne(name) {
  const counter = await db.collection('counters').findOne({ _id: name });
  if (counter.current == 0) {
    return counter.current
  } else {
  const result = await db.collection('counters').updateOne(
    { _id: name },
    { $inc: { current: -1 } },
    //{ returnOriginal: false },
  );
  const updated_counter = await db.collection('counters').findOne({ _id: name });
  return updated_counter.current;
  }
}

async function customerAdd(_, {customer} ) {
  customer.timestamp = new Date();
  customer.queue_number = await getNextSequence('customers')
  if (customer.queue_number > 25) { //returning ID of a customer without adding customer to the database
    const counter = await reduceSequenceByOne('customers');
    console.log('Customers counter:', counter);
    return customer;
  } else {
    const result = await db.collection('customers').insertOne(customer);
    const savedIssue = await db.collection('customers').findOne({ _id: result.insertedId });
    return savedIssue;
  }
}

async function customerDelete(_, {customer} ) {
  const result = await db.collection('customers').deleteOne({queue_number: customer.queue_number})
  await reduceSequenceByOne('customers'); //reduce counter by 1 after deletion of the item
  /*customersDB.splice(ID_to_delete,1);
  for (let i = 0, len = customersDB.length; i < len; i++) {customersDB[i].queue_number = i+1};*/
  /*return customersDB;*/
  
  var i=1

  db.collection('customers').find({}).forEach(function(doc){ 
    db.collection('customers').updateOne({ _id: doc._id }, { $set: { queue_number: i }})
    i++
  })

  const customers = await db.collection('customers').find({}).toArray(); //using await approach to access the db
  return customers;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema_tut5.graphql', 'utf-8'), //schema_tut5.graphql read into a string is used as typeDefs when creating the Apollo Server
  resolvers,
});

const app = express();

/*app.use(express.static('public'));*/ //remove loading of the static middleware

server.applyMiddleware({ app, path: '/graphql'}); //installing ApolloServer as a middleware in Express to configure the working API server

(async function() {
  try {
    await connectToDb(); //changing the setup of the server to first connect to the database and the start the Express application
    app.listen(3000, function () {
    console.log('API Server started on port 3000');
  });
  } catch (err) {
  console.log('ERROR:', err)
  }
})();