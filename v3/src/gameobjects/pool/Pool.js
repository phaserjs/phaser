
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Sprite = require('../sprite/Sprite');
var NOOP = require('../../utils/NOOP');

//  A Pool

var Pool = new Class({

    Extends: GameObject,

    initialize:

    function Pool (state, children, config)
    {
        GameObject.call(this, state, 'Pool');

        this.live = [];
        this.pendingInsertion = [];
        this.pendingRemoval = [];
        this.dead = [];

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

    createMultiple: function ()
    {
    },

    

    preUpdate: function (time, delta)
    {
        //  Because a Group child may mess with the length of the Group during its update
        // var temp = this.children.entries.slice();

        // for (var i = 0; i < temp.length; i++)
        // {
        //     if (temp[i].update(time, delta) === false)
        //     {
        //         break;
        //     }
        // }
    },

    renderCanvas: NOOP,
    renderWebGL: NOOP,

    destroy: function ()
    {

    }

});

module.exports = Pool;
