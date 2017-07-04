var Group = require('./Group');

var GroupCreator = function (state, config)
{
    return new Group(state, null, config);
};

module.exports = GroupCreator;
