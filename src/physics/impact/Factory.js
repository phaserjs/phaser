var Class = require('../../utils/Class');
var ImpactBody = require('./ImpactBody');
var ImpactImage = require('./ImpactImage');
var ImpactSprite = require('./ImpactSprite');

var Factory = new Class({

    initialize:

    function Factory (world)
    {
        this.world = world;

        this.sys = world.scene.sys;
    },

    body: function (x, y, width, height)
    {
        return new ImpactBody(this.world, x, y, width, height);
    },

    existing: function (gameObject)
    {
        var x = gameObject.x - gameObject.frame.centerX;
        var y = gameObject.y - gameObject.frame.centerY;
        var w = gameObject.width;
        var h = gameObject.height;

        gameObject.body = this.world.create(x, y, w, h);

        gameObject.body.parent = gameObject;
        gameObject.body.gameObject = gameObject;

        return gameObject;
    },

    image: function (x, y, key, frame)
    {
        var image = new ImpactImage(this.world, x, y, key, frame);

        this.sys.displayList.add(image);

        return image;
    },

    sprite: function (x, y, key, frame)
    {
        var sprite = new ImpactSprite(this.world, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    }

});

module.exports = Factory;
