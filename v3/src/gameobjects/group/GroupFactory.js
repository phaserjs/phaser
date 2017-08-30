var Group = require('./Group');

var GroupFactory = function (scene, children, config)
{
    if (typeof children === 'object' && config === undefined)
    {
        config = children;
        children = [];
    }

    return new Group(scene, children, config);
};

module.exports = GroupFactory;
