var Class = require('../../utils/Class');
var Factory = require('./Factory');
var World = require('./World');

var Arcade = new Class({

    initialize:

    function Arcade (physicsManager, config)
    {
        this.config = config;

        physicsManager.world = new World(physicsManager.scene, config);

        physicsManager.add = new Factory(physicsManager.world);
    }

});

module.exports = Arcade;
