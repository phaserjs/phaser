var ArcadeImage = require('./ArcadeImage');
var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var PhysicsGroup = require('./PhysicsGroup');
var StaticPhysicsGroup = require('./StaticPhysicsGroup');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

var Factory = new Class({

    initialize:

    function Factory (world)
    {
        this.world = world;

        this.scene = world.scene;

        this.sys = world.scene.sys;

        // this.displayList = this.sys.
        // this.displayList = sys.displayList;
        // this.updateList = sys.updateList;
    },

    collider: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        return this.world.addCollider(object1, object2, collideCallback, processCallback, callbackContext);
    },

    overlap: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        return this.world.addOverlap(object1, object2, collideCallback, processCallback, callbackContext);
    },

    existing: function (gameObject, isStatic)
    {
        var type = (isStatic) ? CONST.STATIC_BODY : CONST.DYNAMIC_BODY;

        this.world.enableBody(gameObject, type);

        return gameObject;
    },

    staticImage: function (x, y, key, frame)
    {
        var image = new ArcadeImage(this.scene, x, y, key, frame);

        this.sys.displayList.add(image);

        this.world.enableBody(image, CONST.STATIC_BODY);

        return image;
    },

    image: function (x, y, key, frame)
    {
        var image = new ArcadeImage(this.scene, x, y, key, frame);

        this.sys.displayList.add(image);

        this.world.enableBody(image, CONST.DYNAMIC_BODY);

        return image;
    },

    staticSprite: function (x, y, key, frame)
    {
        var sprite = new ArcadeSprite(this.scene, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        this.world.enableBody(sprite, CONST.STATIC_BODY);

        return sprite;
    },

    sprite: function (x, y, key, frame)
    {
        var sprite = new ArcadeSprite(this.scene, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        this.world.enableBody(sprite, CONST.DYNAMIC_BODY);

        return sprite;
    },

    staticGroup: function (children, config)
    {
        return this.sys.updateList.add(new StaticPhysicsGroup(this.world, this.world.scene, children, config));
    },

    group: function (children, config)
    {
        return this.sys.updateList.add(new PhysicsGroup(this.world, this.world.scene, children, config));
    }

});

module.exports = Factory;
