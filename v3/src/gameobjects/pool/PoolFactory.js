var Pool = require('./Pool');

var PoolFactory = function (state, children, config)
{
    return new Pool(state, children, config);
};

module.exports = PoolFactory;
