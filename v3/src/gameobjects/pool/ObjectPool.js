//  Phaser.GameObjects.ObjectPool

var Class = require('../../utils/Class');
var Sprite = require('../sprite/Sprite');

//  An Object Pool

var ObjectPool = new Class({

    initialize:

    function ObjectPool (config)
    {
        this.processing = false;

        this._live = [];
        this._pendingInsertion = [];
        this._pendingRemoval = [];
        this._dead = [];

        this.classType = Sprite;

        if (config)
        {
            this.createMultiple(config);
        }
    },

    //  Allow them to add a Group too
    add: function (child)
    {
        if (Array.isArray(child))
        {
            for (var i = 0; i < child.length; i++)
            {
                this.pendingInsertion.push(child[i]);
            }
        }
        else
        {
            this.pendingInsertion.push(child);
        }

        return this;
    },

    get: function ()
    {

    },

    // getByName: function ()
    // {

    // },

    getByName: function ()
    {

    },

    //  Moves from live to pendingRemoval
    //  is there a reason why it can't do direct to dead?
    kill: function ()
    {

    },

    killAndHide: function (gameObject)
    {
        gameObject.visible = false;
    },

    createMultiple: function ()
    {
    },

    update: function (time, delta)
    {
        this.processing = true;


        this.processing = false;
    },

    destroy: function ()
    {

    }

});

module.exports = ObjectPool;
