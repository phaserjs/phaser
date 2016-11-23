/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
*
* TweenManager is based heavily on tween.js by http://soledadpenades.com.
* The difference being that tweens belong to a games instance of TweenManager, rather than to a global TWEEN object.
* It also has callbacks swapped for Signals and a few issues patched with regard to properties and completion errors.
* Please see https://github.com/sole/tween.js for a full list of contributors.
*
* @class Phaser.TweenManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.TweenManager = function (state)
{
    /**
    * @property {Phaser.State} game - Local reference to game.
    */
    this.state = state;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = state.game;

    /**
    * Are all newly created Tweens frame or time based? A frame based tween will use the physics elapsed timer when updating. This means
    * it will retain the same consistent frame rate, regardless of the speed of the device. The duration value given should
    * be given in frames.
    *
    * If the Tween uses a time based update (which is the default) then the duration is given in milliseconds.
    * In this situation a 2000ms tween will last exactly 2 seconds, regardless of the device and how many visual updates the tween
    * has actually been through. For very short tweens you may wish to experiment with a frame based update instead.
    * @property {boolean} frameBased
    * @default
    */
    this.frameBased = false;

    /**
    * @property {array<Phaser.Tween>} _tweens - All of the currently running tweens.
    * @private
    */
    this._tweens = [];

    /**
    * @property {array<Phaser.Tween>} _add - All of the tweens queued to be added in the next update.
    * @private
    */
    this._add = [];

    this.easeMap = {

        Power0: Phaser.Easing.Power0,
        Power1: Phaser.Easing.Power1,
        Power2: Phaser.Easing.Power2,
        Power3: Phaser.Easing.Power3,
        Power4: Phaser.Easing.Power4,

        Linear: Phaser.Easing.Linear.None,
        Quad: Phaser.Easing.Quadratic.Out,
        Cubic: Phaser.Easing.Cubic.Out,
        Quart: Phaser.Easing.Quartic.Out,
        Quint: Phaser.Easing.Quintic.Out,
        Sine: Phaser.Easing.Sinusoidal.Out,
        Expo: Phaser.Easing.Exponential.Out,
        Circ: Phaser.Easing.Circular.Out,
        Elastic: Phaser.Easing.Elastic.Out,
        Back: Phaser.Easing.Back.Out,
        Bounce: Phaser.Easing.Bounce.Out,

        'Quad.easeIn': Phaser.Easing.Quadratic.In,
        'Cubic.easeIn': Phaser.Easing.Cubic.In,
        'Quart.easeIn': Phaser.Easing.Quartic.In,
        'Quint.easeIn': Phaser.Easing.Quintic.In,
        'Sine.easeIn': Phaser.Easing.Sinusoidal.In,
        'Expo.easeIn': Phaser.Easing.Exponential.In,
        'Circ.easeIn': Phaser.Easing.Circular.In,
        'Elastic.easeIn': Phaser.Easing.Elastic.In,
        'Back.easeIn': Phaser.Easing.Back.In,
        'Bounce.easeIn': Phaser.Easing.Bounce.In,

        'Quad.easeOut': Phaser.Easing.Quadratic.Out,
        'Cubic.easeOut': Phaser.Easing.Cubic.Out,
        'Quart.easeOut': Phaser.Easing.Quartic.Out,
        'Quint.easeOut': Phaser.Easing.Quintic.Out,
        'Sine.easeOut': Phaser.Easing.Sinusoidal.Out,
        'Expo.easeOut': Phaser.Easing.Exponential.Out,
        'Circ.easeOut': Phaser.Easing.Circular.Out,
        'Elastic.easeOut': Phaser.Easing.Elastic.Out,
        'Back.easeOut': Phaser.Easing.Back.Out,
        'Bounce.easeOut': Phaser.Easing.Bounce.Out,

        'Quad.easeInOut': Phaser.Easing.Quadratic.InOut,
        'Cubic.easeInOut': Phaser.Easing.Cubic.InOut,
        'Quart.easeInOut': Phaser.Easing.Quartic.InOut,
        'Quint.easeInOut': Phaser.Easing.Quintic.InOut,
        'Sine.easeInOut': Phaser.Easing.Sinusoidal.InOut,
        'Expo.easeInOut': Phaser.Easing.Exponential.InOut,
        'Circ.easeInOut': Phaser.Easing.Circular.InOut,
        'Elastic.easeInOut': Phaser.Easing.Elastic.InOut,
        'Back.easeInOut': Phaser.Easing.Back.InOut,
        'Bounce.easeInOut': Phaser.Easing.Bounce.InOut

    };

    // this.game.onPause.add(this._pauseAll, this);
    // this.game.onResume.add(this._resumeAll, this);

};

Phaser.TweenManager.prototype.constructor = Phaser.TweenManager;

Phaser.TweenManager.prototype = {

    /**
    * Get all the tween objects in an array.
    * @method Phaser.TweenManager#getAll
    * @return {Phaser.Tween[]} Array with all tween objects.
    */
    getAll: function ()
    {
        return this._tweens;
    },

    /**
    * Remove all tweens running and in the queue. Doesn't call any of the tween onComplete events.
    * @method Phaser.TweenManager#removeAll
    */
    removeAll: function ()
    {
        for (var i = 0; i < this._tweens.length; i++)
        {
            this._tweens[i].pendingDelete = true;
        }

        this._add = [];
    },
    
    /**
    * Remove all tweens from a specific object, array of objects or Group.
    * 
    * @method Phaser.TweenManager#removeFrom
    * @param {object|object[]|Phaser.Group} obj - The object you want to remove the tweens from.
    * @param {boolean} [children=true] - If passing a group, setting this to true will remove the tweens from all of its children instead of the group itself.
    */
    removeFrom: function (obj, children)
    {
        if (children === undefined) { children = true; }

        var i;
        var len;

        if (Array.isArray(obj))
        {
            for (i = 0, len = obj.length; i < len; i++)
            {
                this.removeFrom(obj[i]);
            }
        }
        else if (obj.type === Phaser.GROUP && children)
        {
            for (i = 0, len = obj.children.length; i < len; i++)
            {
                this.removeFrom(obj.children[i]);
            }
        }
        else
        {
            for (i = 0, len = this._tweens.length; i < len; i++)
            {
                if (obj === this._tweens[i].target)
                {
                    this.remove(this._tweens[i]);
                }
            }

            for (i = 0, len = this._add.length; i < len; i++)
            {
                if (obj === this._add[i].target)
                {
                    this.remove(this._add[i]);
                }
            }
        }
        
    },

    /**
    * Add a new tween into the TweenManager.
    *
    * @method Phaser.TweenManager#add
    * @param {Phaser.Tween} tween - The tween object you want to add.
    * @return {Phaser.Tween} The tween object you added to the manager.
    */
    add: function (tween)
    {
        tween._manager = this;

        this._add.push(tween);
    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.TweenManager#create
    * @param {object} object - Object the tween will be run on.
    * @return {Phaser.Tween} The newly created tween object.
    */
    create: function (object)
    {
        return new Phaser.Tween(object, this);
    },

    /**
    * Remove a tween from this manager.
    *
    * @method Phaser.TweenManager#remove
    * @param {Phaser.Tween} tween - The tween object you want to remove.
    */
    remove: function (tween)
    {
        var i = this._tweens.indexOf(tween);

        if (i !== -1)
        {
            this._tweens[i].pendingDelete = true;
        }
        else
        {
            i = this._add.indexOf(tween);

            if (i !== -1)
            {
                this._add[i].pendingDelete = true;
            }
        }
    },

    /**
    * Update all the tween objects you added to this manager.
    *
    * @method Phaser.TweenManager#update
    * @return {boolean} Return false if there's no tween to update, otherwise return true.
    */
    update: function (frameDelta)
    {
        var addTweens = this._add.length;
        var numTweens = this._tweens.length;

        if (numTweens === 0 && addTweens === 0)
        {
            return false;
        }

        var i = 0;

        while (i < numTweens)
        {
            if (this._tweens[i].update(frameDelta))
            {
                i++;
            }
            else
            {
                this._tweens.splice(i, 1);

                numTweens--;
            }
        }

        //  If there are any new tweens to be added, do so now - otherwise they can be spliced out of the array before ever running
        if (addTweens > 0)
        {
            this._tweens = this._tweens.concat(this._add);
            this._add.length = 0;
        }

        return true;
    },

    /**
    * Checks to see if a particular Sprite is currently being tweened.
    *
    * @method Phaser.TweenManager#isTweening
    * @param {object} object - The object to check for tweens against.
    * @return {boolean} Returns true if the object is currently being tweened, false if not.
    */
    isTweening: function (object)
    {
        return this._tweens.some(function(tween) {
            return tween.target === object;
        });
    },

    /**
    * Private. Called by game focus loss. Pauses all currently running tweens.
    *
    * @method Phaser.TweenManager#_pauseAll
    * @private
    */
    _pauseAll: function ()
    {
        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i]._pause();
        }
    },

    /**
    * Private. Called by game focus loss. Resumes all currently paused tweens.
    *
    * @method Phaser.TweenManager#_resumeAll
    * @private
    */
    _resumeAll: function ()
    {
        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i]._resume();
        }
    },

    /**
    * Pauses all currently running tweens.
    *
    * @method Phaser.TweenManager#pauseAll
    */
    pauseAll: function ()
    {
        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i].pause();
        }
    },

    /**
    * Resumes all currently paused tweens.
    *
    * @method Phaser.TweenManager#resumeAll
    */
    resumeAll: function ()
    {
        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i].resume(true);
        }
    }

};
