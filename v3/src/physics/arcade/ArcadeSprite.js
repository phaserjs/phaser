var Class = require('../../utils/Class');
var Components = require('./components');
var Sprite = require('../../gameobjects/sprite/Sprite');

var ArcadeSprite = new Class({

    Extends: Sprite,

    Mixins: [
        Components.Acceleration,
        Components.Angular,
        Components.Bounce,
        Components.Debug,
        Components.Drag,
        Components.Friction,
        Components.Gravity,
        Components.Immovable,
        Components.Mass,
        Components.Size,
        Components.Velocity
    ],

    initialize:

    //  x/y is the center of the Sprite / Body, just like other default Game Objects
    function ArcadeSprite (scene, bodyType, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);

        scene.sys.physicsManager.world.enableBody(this, bodyType);
    }

});

module.exports = ArcadeSprite;
