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
    //  This needs a body adding to it, so create it via the AP Factory, or add it to an AP Group

    function ArcadeSprite (scene, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);
    }

});

module.exports = ArcadeSprite;
