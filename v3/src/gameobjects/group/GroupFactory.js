var Group = require('./Group');
var FactoryContainer = require('../FactoryContainer');

var GroupFactory = {

    KEY: 'group',

    add: function (children)
    {
        return new Group(this.state, children);
    },

    make: function (config)
    {
        var group = new Group(this.state);

        group.createFromConfig(config);

        return group;
    }

};

module.exports = FactoryContainer.register(GroupFactory);
