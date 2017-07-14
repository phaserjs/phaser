var Group = require('./Group');

var GroupCreator = function (scene, config)
{
    return new Group(scene, null, config);
};

module.exports = GroupCreator;
