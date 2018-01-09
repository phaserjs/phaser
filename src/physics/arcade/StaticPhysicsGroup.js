//  Phaser.Physics.Arcade.StaticPhysicsGroup

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Group = require('../../gameobjects/group/Group');

var StaticPhysicsGroup = new Class({

    Extends: Group,

    initialize:

    function StaticPhysicsGroup (world, scene, children, config)
    {
        if (config === undefined && !Array.isArray(children) && typeof children === 'object')
        {
            config = children;
            children = null;
        }
        else if (config === undefined)
        {
            config = {};
        }

        this.world = world;

        config.createCallback = this.createCallback;
        config.removeCallback = this.removeCallback;
        config.createMultipleCallback = this.createMultipleCallback;

        config.classType = ArcadeSprite;

        this.physicsType = CONST.STATIC_BODY;

        Group.call(this, scene, children, config);
    },

    createCallback: function (child)
    {
        if (!child.body)
        {
            this.world.enableBody(child, CONST.STATIC_BODY);
        }
    },

    removeCallback: function (child)
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    },

    createMultipleCallback: function (entries)
    {
        this.refresh();
    },

    refresh: function ()
    {
        var children = this.children.entries;

        for (var i = 0; i < children.length; i++)
        {
            children[i].body.reset();
        }

        return this;
    }

});

module.exports = StaticPhysicsGroup;
