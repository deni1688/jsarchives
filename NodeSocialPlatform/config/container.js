const dependable = require('dependable');
const path = require('path');

const container = dependable.container();
const commonAppDependencies = [
    ['lodash', 'lodash'],
    ['passport', 'passport'],
    ['formidable', 'formidable'],
    ['async', 'async'],
    ['Group', '../models/Group'],
    ['User', '../models/User'],
    ['Category', '../models/Category'],
    ['aws', '../helpers/AWS_Upload'],
];

commonAppDependencies.forEach(function(dep) {
    container.register(dep[0], function() {
        return require(dep[1]);
    });
});

container.load(path.join(__dirname, '../controllers'));
container.load(path.join(__dirname, '../helpers'));

container.register('container', function() {
    return container;
});

module.exports = container;