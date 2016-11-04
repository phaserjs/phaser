/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Base State Class.
*
* Think about how to handle a State that only exists as a Preloader state for example.
* Without needing all the 'loadUpdate' etc functions.
*
* Objective: To avoid the State ever changing shape (unless the dev wants it to)
*
* @class Phaser.State
* @constructor
*/
Phaser.State = function (config)
{
    this.game = null;

    this.settings = new Phaser.State.Settings(this, config);

    //  Could be a StateSystems class (to add protection + jsdocs)
    this._sys = {
        add: null,
        data: null,
        input: null,
        tweens: null,
        load: null,
        transform: null,
        children: null,
        color: null,
        time: null,
        fbo: null
    };
};

Phaser.State.prototype.constructor = Phaser.State;

Phaser.State.prototype = {

    preUpdate: function ()
    {
    },

    update: function ()
    {
    },

    postUpdate: function ()
    {
    },

    render: function ()
    {
    }

};

Object.defineProperties(Phaser.State.prototype, {

    add: {

        enumerable: true,

        get: function ()
        {
            return this._sys.add;
        },

        set: function ()
        {
            throw Error('Cannot re-assign protected property: add');
        }

    },

    load: {

        enumerable: true,

        get: function ()
        {
            return this._sys.load;
        },

        set: function ()
        {
            throw Error('Cannot re-assign protected property: load');
        }

    },


    data: {

        enumerable: true,

        get: function ()
        {
            return this._sys.data;
        },

        set: function ()
        {
            throw Error('Cannot re-assign protected property: data');
        }

    },

    children: {

        enumerable: true,

        get: function ()
        {
            return this._sys.children;
        },

        set: function ()
        {
            throw Error('Cannot re-assign protected property: children');
        }

    },

    color: {

        enumerable: true,

        get: function ()
        {
            return this._sys.color;
        },

        set: function ()
        {
            throw Error('Cannot re-assign protected property: color');
        }

    },

    transform: {

        enumerable: true,

        get: function ()
        {
            return this._sys.transform;
        },

        set: function ()
        {
            throw Error('Cannot re-assign protected property: transform');
        }

    }

});
