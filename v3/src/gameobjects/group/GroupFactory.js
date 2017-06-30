var Group = require('./Group');
var FactoryContainer = require('../FactoryContainer');

var GroupFactory = {

    KEY: 'group',

    add: function (children, config)
    {
        return new Group(this.state, children, config);
    },

    make: function (config)
    {
        return new Group(this.state, null, config);
    }

};

module.exports = FactoryContainer.register(GroupFactory);
