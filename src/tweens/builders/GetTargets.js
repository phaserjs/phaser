var GetValue = require('../../utils/object/GetValue');

var GetTargets = function (config)
{
    var targets = GetValue(config, 'targets', null);

    if (targets === null)
    {
        return targets;
    }

    if (typeof targets === 'function')
    {
        targets = targets.call();
    }

    if (!Array.isArray(targets))
    {
        targets = [ targets ];
    }

    return targets;
};

module.exports = GetTargets;
