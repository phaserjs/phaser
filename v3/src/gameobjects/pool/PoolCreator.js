var Pool = require('./Pool');

var PoolCreator = function (state, config)
{
    return new Pool(state, null, config);
};

module.exports = PoolCreator;
