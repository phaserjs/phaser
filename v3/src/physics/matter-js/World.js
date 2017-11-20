//  Phaser.Physics.Arcade.World

var Body = require('./Body');
var Class = require('../../utils/Class');
// var CONST = require('./const');
var GetValue = require('../../utils/object/GetValue');
// var Rectangle = require('../../geom/rectangle/Rectangle');
// var RTree = require('../../structs/RTree');
var Set = require('../../structs/Set');
// var ProcessQueue = require('../../structs/ProcessQueue');
// var StaticBody = require('./StaticBody');
var Vector2 = require('../../math/Vector2');

var World = new Class({

    initialize:

    function World (scene, config)
    {
        var defaults = {
            fps: 60,
            correction: 1,
            deltaSampleSize: 60,
            counterTimestamp: 0,
            frameCounter: 0,
            deltaHistory: [],
            timePrev: null,
            timeScalePrev: 1,
            frameRequestId: null,
            isFixed: false,
            enabled: true
        };

        this.scene = scene;

        this.events = scene.sys.events;

        // this.engine = Phaser.Physics.MatterJS.Engine;
        // this.world = Phaser.Physics.MatterJS.World;
    },

    update: function (time, delta)
    {
        // this.engine.update(this.engine, delta, correction);
    },

    shutdown: function ()
    {

    },

    destroy: function ()
    {

    }

});

module.exports = World;
