var RESERVED = require('../tween/ReservedProps');

var GetProps = function (config)
{
    var key;
    var keys = [];

    //  First see if we have a props object

    if (config.hasOwnProperty('props'))
    {
        for (key in config.props)
        {
            //  Skip any property that starts with an underscore
            if (key.substr(0, 1) !== '_')
            {
                keys.push({ key: key, value: config.props[key] });
            }
        }
    }
    else
    {
        for (key in config)
        {
            //  Skip any property that is in the ReservedProps list or that starts with an underscore
            if (RESERVED.indexOf(key) === -1 && key.substr(0, 1) !== '_')
            {
                keys.push({ key: key, value: config[key] });
            }
        }
    }

    return keys;
};

module.exports = GetProps;
