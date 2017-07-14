var Group = require('./Group');

var GroupFactory = function (scene, children, config)
{
    return new Group(scene, children, config);
};

module.exports = GroupFactory;
