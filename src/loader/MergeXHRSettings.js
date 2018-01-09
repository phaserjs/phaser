var XHRSettings = require('./XHRSettings');

//  Takes two XHR Objects and creates a new object

//  The new object is based on global initially, but any setting in
//  local overrides the global value.

var MergeXHRSettings = function (global, local)
{
    var output = (global === undefined) ? XHRSettings() : Object.assign(global);

    if (local)
    {
        for (var setting in local)
        {
            if (local[setting] !== undefined)
            {
                output[setting] = local[setting];
            }
        }
    }

    return output;
};

module.exports = MergeXHRSettings;
