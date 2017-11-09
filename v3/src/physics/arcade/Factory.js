var ArcadeImage = require('./ArcadeImage');
var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var PhysicsGroup = require('./PhysicsGroup');
var CONST = require('./const');

var Factory = new Class({

    initialize:

    function Factory (world)
    {
        this.world = world;

        this.scene = world.scene;

        this.sys = world.scene.sys;
    },

    staticImage: function (x, y, key, frame)
    {
        var image = new ArcadeImage(this.scene, CONST.STATIC_BODY, x, y, key, frame);

        this.sys.displayList.add(image);

        return image;
    },

    image: function (x, y, key, frame)
    {
        var image = new ArcadeImage(this.scene, CONST.DYNAMIC_BODY, x, y, key, frame);

        this.sys.displayList.add(image);

        return image;
    },

    staticSprite: function (x, y, key, frame)
    {
        var sprite = new ArcadeSprite(this.scene, CONST.STATIC_BODY, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    },

    sprite: function (x, y, key, frame)
    {
        var sprite = new ArcadeSprite(this.scene, CONST.DYNAMIC_BODY, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    },

    group: function (children, config)
    {
        return new PhysicsGroup(this.world, this.world.scene, children, config);
    }

});

module.exports = Factory;
