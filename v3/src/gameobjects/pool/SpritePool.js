//  Phaser.GameObjects.SpritePool

var Class = require('../../utils/Class');
var Sprite = require('../sprite/Sprite');
var ObjectPool = require('./ObjectPool');

//  An Object Pool

var SpritePool = new Class({

    Extends: ObjectPool,

    initialize:

    function SpritePool (manager, maxSize, quantity, key, frame)
    {
        ObjectPool.call(this, manager, Sprite, maxSize, this.makeSprite, this);

        this.defaultKey = key;

        this.defaultFrame = frame;
    },

    makeSprite: function ()
    {
        var gameObject = new this.classType(this.scene, 0, 0, this.defaultKey, this.defaultFrame);

        this.displayList.add(gameObject);
        this.updateList.add(gameObject);

        gameObject.setActive(false);
        gameObject.setVisible(false);

        return gameObject;
    },

    get: function (x, y)
    {
        var gameObject = this.getFreeGameObject();

        gameObject.setPosition(x, y);

        return gameObject;
    }

});

module.exports = SpritePool;
