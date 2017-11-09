var Class = require('../../utils/Class');
var Components = require('./components');
var Image = require('../../gameobjects/image/Image');

var ArcadeImage = new Class({

    Extends: Image,

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

    //  x/y is the center of the Image / Body, just like other default Game Objects
    //  This needs a body adding to it, so create it via the AP Factory, or add it to an AP Group

    function ArcadeImage (scene, x, y, texture, frame)
    {
        Image.call(this, scene, x, y, texture, frame);
    }

});

module.exports = ArcadeImage;
