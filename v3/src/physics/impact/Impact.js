var Class = require('../../utils/Class');
var Merge = require('../../utils/object/Merge');
var World = require('./World');
var Factory = require('./Factory');

var Impact = new Class({

    initialize:

    function Impact (physicsManager, config)
    {
        this.config = config;

        physicsManager.world = new World(physicsManager.scene, config);

        physicsManager.add = new Factory(physicsManager.world);
    }

});

module.exports = Impact;
