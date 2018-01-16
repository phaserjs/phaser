var Animation = require('../frame/Animation');
var Class = require('../../utils/Class');
var CustomMap = require('../../structs/Map');
var EventEmitter = require('eventemitter3');
var GetValue = require('../../utils/object/GetValue');
var Pad = require('../../utils/string/Pad');

// Animations are managed by the global AnimationManager. This is a singleton class that is
// responsible for creating and delivering animations and their corresponding data to all Game Objects.
// Sprites and other Game Objects get the data they need from the AnimationManager.
// Access it via `scene.anims`.

var AnimationManager = new Class({

    Extends: EventEmitter,

    initialize:

    /**
     * [description]
     *
     * @class AnimationManager
     * @memberOf Phaser.Animations
     * @constructor
     * @since 3.0.0
     * 
     * @param {Phaser.Game} game - [description]
     */
    function AnimationManager (game)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @property {Phaser.Game} game
         * @protected
         */
        this.game = game;

        /**
         * [description]
         *
         * @property {[type]} textureManager
         * @protected
         */
        this.textureManager = null;

        /**
         * [description]
         *
         * @property {number} [globalTimeScale=1]
         */
        this.globalTimeScale = 1;

        /**
         * [description]
         *
         * @property {Phaser.Structs.Map} anims
         * @protected
         */
        this.anims = new CustomMap();

        /**
         * [description]
         *
         * @property {boolean} [paused=false]
         */
        this.paused = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#boot
     * @since 3.0.0
     * 
     * @param {[type]} textureManager - [description]
     */
    boot: function (textureManager)
    {
        this.textureManager = textureManager;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#add
     * @fires AddAnimationEvent
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * @param {Phaser.Animations.Animation} animation - [description]
     * 
     * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
     */
    add: function (key, animation)
    {
        if (this.anims.has(key))
        {
            console.warn('Animation with key', key, 'already exists');
            return;
        }

        animation.key = key;

        this.anims.set(key, animation);

        this.emit('add', key, animation);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#create
     * @fires AddAnimationEvent
     * @since 3.0.0
     * 
     * @param {object} config - [description]
     * 
     * @return {Phaser.Animations.Animation} The Animation that was created.
     */
    create: function (config)
    {
        var key = config.key;

        if (!key || this.anims.has(key))
        {
            console.warn('Invalid Animation Key, or Key already in use: ' + key);
            return;
        }

        var anim = new Animation(this, key, config);

        this.anims.set(key, anim);

        this.emit('add', key, anim);

        return anim;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#fromJSON
     * @since 3.0.0
     * 
     * @param {string|object} data - [description]
     * @param {boolean} [clearCurrentAnimations=false] - [description]
     * 
     * @return {Phaser.Animations.Animation[]} An array containing all of the Animation objects that were created as a result of this call.
     */
    fromJSON: function (data, clearCurrentAnimations)
    {
        if (clearCurrentAnimations === undefined) { clearCurrentAnimations = false; }

        if (clearCurrentAnimations)
        {
            this.anims.clear();
        }

        //  Do we have a String (i.e. from JSON, or an Object?)
        if (typeof data === 'string')
        {
            data = JSON.parse(data);
        }

        var output = [];

        //  Array of animations, or a single animation?
        if (data.hasOwnProperty('anims') && Array.isArray(data.anims))
        {
            for (var i = 0; i < data.anims.length; i++)
            {
                output.push(this.create(data.anims[i]));
            }

            if (data.hasOwnProperty('globalTimeScale'))
            {
                this.globalTimeScale = data.globalTimeScale;
            }
        }
        else if (data.hasOwnProperty('key') && data.type === 'frame')
        {
            output.push(this.create(data));
        }

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#generateFrameNames
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * @param {object} config - [description]
     * @param {string} [config.prefix=''] - [description]
     * @param {integer} [config.start=0] - [description]
     * @param {integer} [config.end=0] - [description]
     * @param {string} [config.suffix=''] - [description]
     * @param {integer} [config.zeroPad=0] - [description]
     * @param {array} [config.outputArray=[]] - [description]
     * @param {boolean} [config.frames=false] - [description]
     * 
     * @return {object[]} [description]
     */
    generateFrameNames: function (key, config)
    {
        var prefix = GetValue(config, 'prefix', '');
        var start = GetValue(config, 'start', 0);
        var end = GetValue(config, 'end', 0);
        var suffix = GetValue(config, 'suffix', '');
        var zeroPad = GetValue(config, 'zeroPad', 0);
        var out = GetValue(config, 'outputArray', []);
        var frames = GetValue(config, 'frames', false);

        var texture = this.textureManager.get(key);

        if (!texture)
        {
            return out;
        }

        var diff = (start < end) ? 1 : -1;

        //  Adjust because we use i !== end in the for loop
        end += diff;

        var i;
        var frame;

        //  Have they provided their own custom frame sequence array?
        if (Array.isArray(frames))
        {
            for (i = 0; i < frames.length; i++)
            {
                frame = prefix + Pad(frames[i], zeroPad, '0', 1) + suffix;

                if (texture.has(frame))
                {
                    out.push({ key: key, frame: frame });
                }
            }
        }
        else
        {
            for (i = start; i !== end; i += diff)
            {
                frame = prefix + Pad(i, zeroPad, '0', 1) + suffix;

                if (texture.has(frame))
                {
                    out.push({ key: key, frame: frame });
                }
            }
        }

        return out;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#generateFrameNumbers
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * @param {object} config - [description]
     * @param {integer} [config.start=0] - [description]
     * @param {integer} [config.end=-1] - [description]
     * @param {boolean} [config.first=false] - [description]
     * @param {array} [config.outputArray=[]] - [description]
     * @param {boolean} [config.frames=false] - [description]
     * 
     * @return {object[]} [description]
     */
    generateFrameNumbers: function (key, config)
    {
        var startFrame = GetValue(config, 'start', 0);
        var endFrame = GetValue(config, 'end', -1);
        var firstFrame = GetValue(config, 'first', false);
        var out = GetValue(config, 'outputArray', []);
        var frames = GetValue(config, 'frames', false);

        var texture = this.textureManager.get(key);

        if (!texture)
        {
            return out;
        }

        if (firstFrame && texture.has(firstFrame))
        {
            out.push({ key: key, frame: firstFrame });
        }

        var i;

        //  Have they provided their own custom frame sequence array?
        if (Array.isArray(frames))
        {
            for (i = 0; i < frames.length; i++)
            {
                if (texture.has(frames[i]))
                {
                    out.push({ key: key, frame: frames[i] });
                }
            }
        }
        else
        {
            //  No endFrame then see if we can get it

            if (endFrame === -1)
            {
                endFrame = texture.frameTotal;
            }

            for (i = startFrame; i <= endFrame; i++)
            {
                if (texture.has(i))
                {
                    out.push({ key: key, frame: i });
                }
            }
        }

        return out;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#get
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * 
     * @return {Phaser.Animations.Animation} [description]
     */
    get: function (key)
    {
        return this.anims.get(key);
    },

    /**
     * Load an Animation into a Game Objects Animation Component.
     *
     * @method Phaser.Animations.AnimationManager#load
     * @since 3.0.0
     * 
     * @param {Phaser.GameObjects.GameObject} child - [description]
     * @param {string} key - [description]
     * @param {string|integer} [startFrame] - [description]
     * 
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    load: function (child, key, startFrame)
    {
        var anim = this.get(key);

        if (anim)
        {
            anim.load(child, startFrame);
        }

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#pauseAll
     * @fires PauseAllAnimationEvent
     * @since 3.0.0
     * 
     * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
     */
    pauseAll: function ()
    {
        if (!this.paused)
        {
            this.paused = true;

            this.emit('pauseall');
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#play
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * @param {Phaser.GameObjects.GameObject} child - [description]
     * 
     * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
     */
    play: function (key, child)
    {
        if (!Array.isArray(child))
        {
            child = [ child ];
        }

        var anim = this.get(key);

        if (!anim)
        {
            return;
        }

        for (var i = 0; i < child.length; i++)
        {
            child[i].anims.play(key);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#remove
     * @fires RemoveAnimationEvent
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * 
     * @return {Phaser.Animations.Animation} [description]
     */
    remove: function (key)
    {
        var anim = this.get(key);

        if (anim)
        {
            this.emit('remove', key, anim);

            this.anims.delete(key);
        }

        return anim;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#resumeAll
     * @fires ResumeAllAnimationEvent
     * @since 3.0.0
     * 
     * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
     */
    resumeAll: function ()
    {
        if (this.paused)
        {
            this.paused = false;

            this.emit('resumeall');
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#staggerPlay
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * @param {Phaser.GameObjects.GameObject} child - [description]
     * @param {number} [stagger=0] - [description]
     * 
     * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
     */
    staggerPlay: function (key, child, stagger)
    {
        if (stagger === undefined) { stagger = 0; }

        if (!Array.isArray(child))
        {
            child = [ child ];
        }

        var anim = this.get(key);

        if (!anim)
        {
            return;
        }

        for (var i = 0; i < child.length; i++)
        {
            child[i].anims.delayedPlay(stagger * i, key);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#toJSON
     * @since 3.0.0
     * 
     * @param {string} key - [description]
     * 
     * @return {object} [description]
     */
    toJSON: function (key)
    {
        if (key !== undefined && key !== '')
        {
            return this.anims.get(key).toJSON();
        }
        else
        {
            var output = {
                anims: [],
                globalTimeScale: this.globalTimeScale
            };

            this.anims.each(function (animationKey, animation)
            {
                output.anims.push(animation.toJSON());
            });

            return output;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.AnimationManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        //  TODO
    }

});

module.exports = AnimationManager;
