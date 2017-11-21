//  Phaser.Physics.Matter.Body

var Class = require('../../utils/Class');
// var CONST = require('./const');
// var PhysicsEvent = require('./events');
var Rectangle = require('../../geom/rectangle/Rectangle');
// var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

var Body = new Class({

    initialize:

    function Body (world, gameObject)
    {
        this.world = world;

        this.gameObject = gameObject;

    }

});

module.exports = Body;
