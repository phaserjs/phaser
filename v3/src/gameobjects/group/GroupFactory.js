var Group = require('./Group');

var GroupFactory = function (state, children, config)
{
    return new Group(state, children, config);
};

module.exports = GroupFactory;
