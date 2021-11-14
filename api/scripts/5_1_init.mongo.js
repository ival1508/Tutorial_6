db.customers.remove({}) //cleaning the 'customers' collection in the waitlist db

const customersDB = [
    {
        queue_number: 1, name: 'Val', contact_number: 90072169, timestamp: new Date('1991-15-08')
    },
    {
        queue_number: 2, name: 'Glasha', contact_number: 90721467, timestamp: new Date('2017-28-01')
    }
];

db.customers.insertMany(customersDB); //inserting our 2 documents to the database
const count = db.customers.count();
print('Inserted', count, 'customers')

db.counters.remove({ _id: 'customers' })
db.counters.insert({ _id: 'customers', current: count})

db.customers.createIndex({ queue_number: 1 }); //{ unique: true });
db.customers.createIndex({ name: 1 });
db.customers.createIndex({ contact_number: 1 });
db.customers.createIndex({ timestamp: 1});

/*
### Schema Initialization
```
mongo waitlist scripts/5_1_init.mongo.js
```
*/