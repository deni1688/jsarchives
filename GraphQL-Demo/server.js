const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const schema = require('./schema.js');

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true // adding the ability to use the graphical UI from graphiql
}));

app.listen(4000, () => {
    console.log('Server running on port 4000');
});