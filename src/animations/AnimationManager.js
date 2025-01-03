/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Animation = require('./Animation');
var Class = require('../utils/Class');
var CustomMap = require('../structs/Map');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GameEvents = require('../core/events');
var GetFastValue = require('../utils/object/GetFastValue');
var GetValue = require('../utils/object/GetValue');
var MATH_CONST = require('../math/const');
var NumberArray = require('../utils/array/NumberArray');
var Pad = require('../utils/string/Pad');

/**
 * @classdesc
 * The Animation Manager.
 *
 * Animations are managed by the global Animation Manager. This is a singleton class that is
 * responsible for creating and delivering animations and their corresponding data to all Game Objects.
 * Unlike plugins it is owned by the Game instance, not the Scene.
 *
 * Sprites and other Game Objects get the data they need from the AnimationManager.
 *
 * @class AnimationManager
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 */
var AnimationManager = new Class({

    Extends: EventEmitter,

    initialize:

    function AnimationManager (game)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.Animations.AnimationManager#game
         * @type {Phaser.Game}
         * @protected
         * @since 3.0.0
         */
        this.game = game;

        /**
         * A reference to the Texture Manager.
         *
         * @name Phaser.Animations.AnimationManager#textureManager
         * @type {Phaser.Textures.TextureManager}
         * @protected
         * @since 3.0.0
         */
        this.textureManager = null;

        /**
         * The global time scale of the Animation Manager.
         *
         * This scales the time delta between two frames, thus influencing the speed of time for the Animation Manager.
         *
         * @name Phaser.Animations.AnimationManager#globalTimeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.globalTimeScale = 1;

        /**
         * The Animations registered in the Animation Manager.
         *
         * This map should be modified with the {@link #add} and {@link #create} methods of the Animation Manager.
         *
         * @name Phaser.Animations.AnimationManager#anims
         * @type {Phaser.Structs.Map.<string, Phaser.Animations.Animation>}
         * @protected
         * @since 3.0.0
         */
        this.anims = new CustomMap();

        /**
         * A list of animation mix times.
         *
         * See the {@link #setMix} method for more details.
         *
         * @name Phaser.Animations.AnimationManager#mixes
         * @type {Phaser.Structs.Map.<string, Phaser.Animations.Animation>}
         * @since 3.50.0
         */
        this.mixes = new CustomMap();

        /**
         * Whether the Animation Manager is paused along with all of its Animations.
         *
         * @name Phaser.Animations.AnimationManager#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * The name of this Animation Manager.
         *
         * @name Phaser.Animations.AnimationManager#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = 'AnimationManager';

        game.events.once(GameEvents.BOOT, this.boot, this);
    },

    /**
     * Registers event listeners after the Game boots.
     *
     * @method Phaser.Animations.AnimationManager#boot
     * @listens Phaser.Core.Events#DESTROY
     * @since 3.0.0
     */
    boot: function ()
    {
        this.textureManager = this.game.textures;

        this.game.events.once(GameEvents.DESTROY, this.destroy, this);
    },

    /**
     * Adds a mix between two animations.
     *
     * Mixing allows you to specify a unique delay between a pairing of animations.
     *
     * When playing Animation A on a Game Object, if you then play Animation B, and a
     * mix exists, it will wait for the specified delay to be over before playing Animation B.
     *
     * This allows you to customise smoothing between different types of animation, such
     * as blending between an idle and a walk state, or a running and a firing state.
     *
     * Note that mixing is only applied if you use the `Sprite.play` method. If you opt to use
     * `playAfterRepeat` or `playAfterDelay` instead, those will take priority and the mix
     * delay will not be used.
     *
     * To update an existing mix, just call this method with the new delay.
     *
     * To remove a mix pairing, see the `removeMix` method.
     *
     * @method Phaser.Animations.AnimationManager#addMix
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation)} animA - The string-based key, or instance of, Animation A.
     * @param {(string|Phaser.Animations.Animation)} animB - The string-based key, or instance of, Animation B.
     * @param {number} delay - The delay, in milliseconds, to wait when transitioning from Animation A to B.
     *
     * @return {this} This Animation Manager.
     */
    addMix: function (animA, animB, delay)
    {
        var anims = this.anims;
        var mixes = this.mixes;

        var keyA = (typeof(animA) === 'string') ? animA : animA.key;
        var keyB = (typeof(animB) === 'string') ? animB : animB.key;

        if (anims.has(keyA) && anims.has(keyB))
        {
            var mixObj = mixes.get(keyA);

            if (!mixObj)
            {
                mixObj = {};
            }

            mixObj[keyB] = delay;

            mixes.set(keyA, mixObj);
        }

        return this;
    },

    /**
     * Removes a mix between two animations.
     *
     * Mixing allows you to specify a unique delay between a pairing of animations.
     *
     * Calling this method lets you remove those pairings. You can either remove
     * it between `animA` and `animB`, or if you do not provide the `animB` parameter,
     * it will remove all `animA` mixes.
     *
     * If you wish to update an existing mix instead, call the `addMix` method with the
     * new delay.
     *
     * @method Phaser.Animations.AnimationManager#removeMix
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation)} animA - The string-based key, or instance of, Animation A.
     * @param {(string|Phaser.Animations.Animation)} [animB] - The string-based key, or instance of, Animation B. If not given, all mixes for Animation A will be removed.
     *
     * @return {this} This Animation Manager.
     */
    removeMix: function (animA, animB)
    {
        var mixes = this.mixes;

        var keyA = (typeof(animA) === 'string') ? animA : animA.key;

        var mixObj = mixes.get(keyA);

        if (mixObj)
        {
            if (animB)
            {
                var keyB = (typeof(animB) === 'string') ? animB : animB.key;

                if (mixObj.hasOwnProperty(keyB))
                {
                    //  Remove just this pairing
                    delete mixObj[keyB];
                }
            }
            else if (!animB)
            {
                //  Remove everything for animA
                mixes.delete(keyA);
            }
        }

        return this;
    },

    /**
     * Returns the mix delay between two animations.
     *
     * If no mix has been set-up, this method will return zero.
     *
     * If you wish to create, or update, a new mix, call the `addMix` method.
     * If you wish to remove a mix, call the `removeMix` method.
     *
     * @method Phaser.Animations.AnimationManager#getMix
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation)} animA - The string-based key, or instance of, Animation A.
     * @param {(string|Phaser.Animations.Animation)} animB - The string-based key, or instance of, Animation B.
     *
     * @return {number} The mix duration, or zero if no mix exists.
     */
    getMix: function (animA, animB)
    {
        var mixes = this.mixes;

        var keyA = (typeof(animA) === 'string') ? animA : animA.key;
        var keyB = (typeof(animB) === 'string') ? animB : animB.key;

        var mixObj = mixes.get(keyA);

        if (mixObj && mixObj.hasOwnProperty(keyB))
        {
            return mixObj[keyB];
        }
        else
        {
            return 0;
        }
    },

    /**
     * Adds an existing Animation to the Animation Manager.
     *
     * @method Phaser.Animations.AnimationManager#add
     * @fires Phaser.Animations.Events#ADD_ANIMATION
     * @since 3.0.0
     *
     * @param {string} key - The key under which the Animation should be added. The Animation will be updated with it. Must be unique.
     * @param {Phaser.Animations.Animation} animation - The Animation which should be added to the Animation Manager.
     *
     * @return {this} This Animation Manager.
     */
    add: function (key, animation)
    {
        if (this.anims.has(key))
        {
            console.warn('Animation key exists: ' + key);

            return this;
        }

        animation.key = key;

        this.anims.set(key, animation);

        this.emit(Events.ADD_ANIMATION, key, animation);

        return this;
    },

    /**
     * Checks to see if the given key is already in use within the Animation Manager or not.
     *
     * Animations are global. Keys created in one scene can be used from any other Scene in your game. They are not Scene specific.
     *
     * @method Phaser.Animations.AnimationManager#exists
     * @since 3.16.0
     *
     * @param {string} key - The key of the Animation to check.
     *
     * @return {boolean} `true` if the Animation already exists in the Animation Manager, or `false` if the key is available.
     */
    exists: function (key)
    {
        return this.anims.has(key);
    },

    /**
     * Create one, or more animations from a loaded Aseprite JSON file.
     *
     * Aseprite is a powerful animated sprite editor and pixel art tool.
     *
     * You can find more details at https://www.aseprite.org/
     *
     * To export a compatible JSON file in Aseprite, please do the following:
     *
     * 1. Go to "File - Export Sprite Sheet"
     *
     * 2. On the **Layout** tab:
     * 2a. Set the "Sheet type" to "Packed"
     * 2b. Set the "Constraints" to "None"
     * 2c. Check the "Merge Duplicates" checkbox
     *
     * 3. On the **Sprite** tab:
     * 3a. Set "Layers" to "Visible layers"
     * 3b. Set "Frames" to "All frames", unless you only wish to export a sub-set of tags
     *
     * 4. On the **Borders** tab:
     * 4a. Check the "Trim Sprite" and "Trim Cells" options
     * 4b. Ensure "Border Padding", "Spacing" and "Inner Padding" are all > 0 (1 is usually enough)
     *
     * 5. On the **Output** tab:
     * 5a. Check "Output File", give your image a name and make sure you choose "png files" as the file type
     * 5b. Check "JSON Data" and give your json file a name
     * 5c. The JSON Data type can be either a Hash or Array, Phaser doesn't mind.
     * 5d. Make sure "Tags" is checked in the Meta options
     * 5e. In the "Item Filename" input box, make sure it says just "{frame}" and nothing more.
     *
     * 6. Click export
     *
     * This was tested with Aseprite 1.2.25.
     *
     * This will export a png and json file which you can load using the Aseprite Loader, i.e.:
     *
     * ```javascript
     * function preload ()
     * {
     *     this.load.path = 'assets/animations/aseprite/';
     *     this.load.aseprite('paladin', 'paladin.png', 'paladin.json');
     * }
     * ```
     *
     * Once loaded, you can call this method from within a Scene with the 'atlas' key:
     *
     * ```javascript
     * this.anims.createFromAseprite('paladin');
     * ```
     *
     * Any animations defined in the JSON will now be available to use in Phaser and you play them
     * via their Tag name. For example, if you have an animation called 'War Cry' on your Aseprite timeline,
     * you can play it in Phaser using that Tag name:
     *
     * ```javascript
     * this.add.sprite(400, 300).play('War Cry');
     * ```
     *
     * When calling this method you can optionally provide an array of tag names, and only those animations
     * will be created. For example:
     *
     * ```javascript
     * this.anims.createFromAseprite('paladin', [ 'step', 'War Cry', 'Magnum Break' ]);
     * ```
     *
     * This will only create the 3 animations defined. Note that the tag names are case-sensitive.
     *
     * @method Phaser.Animations.AnimationManager#createFromAseprite
     * @since 3.50.0
     *
     * @param {string} key - The key of the loaded Aseprite atlas. It must have been loaded prior to calling this method.
     * @param {string[]} [tags] - An array of Tag names. If provided, only animations found in this array will be created.
     * @param {(Phaser.Animations.AnimationManager|Phaser.GameObjects.GameObject)} [target] - Create the animations on this target Sprite. If not given, they will be created globally in this Animation Manager.
     *
     * @return {Phaser.Animations.Animation[]} An array of Animation instances that were successfully created.
     */
    createFromAseprite: function (key, tags, target)
    {
        var output = [];

        var data = this.game.cache.json.get(key);

        if (!data)
        {
            console.warn('No Aseprite data found for: ' + key);

            return output;
        }

        var _this = this;

        var meta = GetValue(data, 'meta', null);
        var frames = GetValue(data, 'frames', null);

        if (meta && frames)
        {
            var frameTags = GetValue(meta, 'frameTags', []);

            frameTags.forEach(function (tag)
            {
                var animFrames = [];

                var name = GetFastValue(tag, 'name', null);
                var from = GetFastValue(tag, 'from', 0);
                var to = GetFastValue(tag, 'to', 0);
                var direction = GetFastValue(tag, 'direction', 'forward');

                if (!name)
                {
                    //  Skip if no name
                    return;
                }

                if (!tags || (tags && tags.indexOf(name) > -1))
                {
                    //  Get all the frames for this tag and calculate the total duration in milliseconds.
                    var totalDuration = 0;
                    for (var i = from; i <= to; i++)
                    {
                        var frameKey = i.toString();
                        var frame = frames[frameKey];

                        if (frame)
                        {
                            var frameDuration = GetFastValue(frame, 'duration', MATH_CONST.MAX_SAFE_INTEGER);
                            animFrames.push({ key: key, frame: frameKey, duration: frameDuration });
                            totalDuration += frameDuration;
                        }
                    }

                    if (direction === 'reverse')
                    {
                        animFrames = animFrames.reverse();
                    }

                    //  Create the animation
                    var createConfig = {
                        key: name,
                        frames: animFrames,
                        duration: totalDuration,
                        yoyo: (direction === 'pingpong')
                    };

                    var result;

                    if (target)
                    {
                        if (target.anims)
                        {
                            result = target.anims.create(createConfig);
                        }
                    }
                    else
                    {
                        result = _this.create(createConfig);
                    }

                    if (result)
                    {
                        output.push(result);
                    }
                }
            });
        }

        return output;
    },

    /**
     * Creates a new Animation and adds it to the Animation Manager.
     *
     * Animations are global. Once created, you can use them in any Scene in your game. They are not Scene specific.
     *
     * If an invalid key is given this method will return `false`.
     *
     * If you pass the key of an animation that already exists in the Animation Manager, that animation will be returned.
     *
     * A brand new animation is only created if the key is valid and not already in use.
     *
     * If you wish to re-use an existing key, call `AnimationManager.remove` first, then this method.
     *
     * @method Phaser.Animations.AnimationManager#create
     * @fires Phaser.Animations.Events#ADD_ANIMATION
     * @since 3.0.0
     *
     * @param {Phaser.Types.Animations.Animation} config - The configuration settings for the Animation.
     *
     * @return {(Phaser.Animations.Animation|false)} The Animation that was created, or `false` if the key is already in use.
     */
    create: function (config)
    {
        var key = config.key;

        var anim = false;

        if (key)
        {
            anim = this.get(key);

            if (!anim)
            {
                anim = new Animation(this, key, config);

                this.anims.set(key, anim);

                this.emit(Events.ADD_ANIMATION, key, anim);
            }
            else
            {
                console.warn('AnimationManager key already exists: ' + key);
            }
        }

        return anim;
    },

    /**
     * Loads this Animation Manager's Animations and settings from a JSON object.
     *
     * @method Phaser.Animations.AnimationManager#fromJSON
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.JSONAnimations|Phaser.Types.Animations.JSONAnimation)} data - The JSON object to parse.
     * @param {boolean} [clearCurrentAnimations=false] - If set to `true`, the current animations will be removed (`anims.clear()`). If set to `false` (default), the animations in `data` will be added.
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
     * Generate an array of {@link Phaser.Types.Animations.AnimationFrame} objects from a texture key and configuration object.
     *
     * Generates objects with string based frame names, as configured by the given {@link Phaser.Types.Animations.GenerateFrameNames}.
     *
     * It's a helper method, designed to make it easier for you to extract all of the frame names from texture atlases.
     *
     * If you're working with a sprite sheet, see the `generateFrameNumbers` method instead.
     *
     * Example:
     *
     * If you have a texture atlases loaded called `gems` and it contains 6 frames called `ruby_0001`, `ruby_0002`, and so on,
     * then you can call this method using: `this.anims.generateFrameNames('gems', { prefix: 'ruby_', start: 1, end: 6, zeroPad: 4 })`.
     *
     * The `end` value tells it to select frames 1 through 6, incrementally numbered, all starting with the prefix `ruby_`. The `zeroPad`
     * value tells it how many zeroes pad out the numbers. To create an animation using this method, you can do:
     *
     * ```javascript
     * this.anims.create({
     *   key: 'ruby',
     *   repeat: -1,
     *   frames: this.anims.generateFrameNames('gems', {
     *     prefix: 'ruby_',
     *     end: 6,
     *     zeroPad: 4
     *   })
     * });
     * ```
     *
     * Please see the animation examples for further details.
     *
     * @method Phaser.Animations.AnimationManager#generateFrameNames
     * @since 3.0.0
     *
     * @param {string} key - The key for the texture containing the animation frames.
     * @param {Phaser.Types.Animations.GenerateFrameNames} [config] - The configuration object for the animation frame names.
     *
     * @return {Phaser.Types.Animations.AnimationFrame[]} The array of {@link Phaser.Types.Animations.AnimationFrame} objects.
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

        if (!this.textureManager.exists(key))
        {
            console.warn('Texture "%s" not found', key);

            return out;
        }

        var texture = this.textureManager.get(key);

        if (!texture)
        {
            return out;
        }

        var i;

        if (!config)
        {
            //  Use every frame in the atlas
            frames = texture.getFrameNames();

            for (i = 0; i < frames.length; i++)
            {
                out.push({ key: key, frame: frames[i] });
            }
        }
        else
        {
            if (!frames)
            {
                frames = NumberArray(start, end);
            }

            for (i = 0; i < frames.length; i++)
            {
                var frame = prefix + Pad(frames[i], zeroPad, '0', 1) + suffix;

                if (texture.has(frame))
                {
                    out.push({ key: key, frame: frame });
                }
                else
                {
                    console.warn('Frame "%s" not found in texture "%s"', frame, key);
                }
            }
        }

        return out;
    },

    /**
     * Generate an array of {@link Phaser.Types.Animations.AnimationFrame} objects from a texture key and configuration object.
     *
     * Generates objects with numbered frame names, as configured by the given {@link Phaser.Types.Animations.GenerateFrameNumbers}.
     *
     * If you're working with a texture atlas, see the `generateFrameNames` method instead.
     *
     * It's a helper method, designed to make it easier for you to extract frames from sprite sheets.
     *
     * Example:
     *
     * If you have a sprite sheet loaded called `explosion` and it contains 12 frames, then you can call this method using:
     *
     * `this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 })`.
     *
     * The `end` value of 11 tells it to stop after the 12th frame has been added, because it started at zero.
     *
     * To create an animation using this method, you can do:
     *
     * ```javascript
     * this.anims.create({
     *   key: 'boom',
     *   frames: this.anims.generateFrameNumbers('explosion', {
     *     start: 0,
     *     end: 11
     *   })
     * });
     * ```
     *
     * Note that `start` is optional and you don't need to include it if the animation starts from frame 0.
     *
     * To specify an animation in reverse, swap the `start` and `end` values.
     *
     * If the frames are not sequential, you may pass an array of frame numbers instead, for example:
     *
     * `this.anims.generateFrameNumbers('explosion', { frames: [ 0, 1, 2, 1, 2, 3, 4, 0, 1, 2 ] })`
     *
     * Please see the animation examples and `GenerateFrameNumbers` config docs for further details.
     *
     * @method Phaser.Animations.AnimationManager#generateFrameNumbers
     * @since 3.0.0
     *
     * @param {string} key - The key for the texture containing the animation frames.
     * @param {Phaser.Types.Animations.GenerateFrameNumbers} [config] - The configuration object for the animation frames.
     *
     * @return {Phaser.Types.Animations.AnimationFrame[]} The array of {@link Phaser.Types.Animations.AnimationFrame} objects.
     */
    generateFrameNumbers: function (key, config)
    {
        var start = GetValue(config, 'start', 0);
        var end = GetValue(config, 'end', -1);
        var first = GetValue(config, 'first', false);
        var out = GetValue(config, 'outputArray', []);
        var frames = GetValue(config, 'frames', false);

        if (!this.textureManager.exists(key))
        {
            console.warn('Texture "%s" not found', key);

            return out;
        }

        var texture = this.textureManager.get(key);

        if (!texture)
        {
            return out;
        }

        if (first && texture.has(first))
        {
            out.push({ key: key, frame: first });
        }

        //  No 'frames' array? Then generate one automatically
        if (!frames)
        {
            if (end === -1)
            {
                //  -1 because of __BASE, which we don't want in our results
                //  and -1 because frames are zero based
                end = texture.frameTotal - 2;
            }

            frames = NumberArray(start, end);
        }

        for (var i = 0; i < frames.length; i++)
        {
            var frameName = frames[i];

            if (texture.has(frameName))
            {
                out.push({ key: key, frame: frameName });
            }
            else
            {
                console.warn('Frame "%s" not found in texture "%s"', frameName, key);
            }
        }

        return out;
    },

    /**
     * Get an Animation.
     *
     * @method Phaser.Animations.AnimationManager#get
     * @since 3.0.0
     *
     * @param {string} key - The key of the Animation to retrieve.
     *
     * @return {Phaser.Animations.Animation} The Animation.
     */
    get: function (key)
    {
        return this.anims.get(key);
    },

    /**
     * Returns an array of all Animation keys that are using the given
     * Texture. Only Animations that have at least one AnimationFrame
     * entry using this texture will be included in the result.
     *
     * @method Phaser.Animations.AnimationManager#getAnimsFromTexture
     * @since 3.60.0
     *
     * @param {(string|Phaser.Textures.Texture|Phaser.Textures.Frame)} key - The unique string-based key of the Texture, or a Texture, or Frame instance.
     *
     * @return {string[]} An array of Animation keys that feature the given Texture.
     */
    getAnimsFromTexture: function (key)
    {
        var texture = this.textureManager.get(key);

        var match = texture.key;
        var anims = this.anims.getArray();

        var out = [];

        for (var i = 0; i < anims.length; i++)
        {
            var anim = anims[i];
            var frames = anim.frames;

            for (var c = 0; c < frames.length; c++)
            {
                if (frames[c].textureKey === match)
                {
                    out.push(anim.key);

                    break;
                }
            }
        }

        return out;
    },

    /**
     * Pause all animations.
     *
     * @method Phaser.Animations.AnimationManager#pauseAll
     * @fires Phaser.Animations.Events#PAUSE_ALL
     * @since 3.0.0
     *
     * @return {this} This Animation Manager.
     */
    pauseAll: function ()
    {
        if (!this.paused)
        {
            this.paused = true;

            this.emit(Events.PAUSE_ALL);
        }

        return this;
    },

    /**
     * Play an animation on the given Game Objects that have an Animation Component.
     *
     * @method Phaser.Animations.AnimationManager#play
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} children - An array of Game Objects to play the animation on. They must have an Animation Component.
     *
     * @return {this} This Animation Manager.
     */
    play: function (key, children)
    {
        if (!Array.isArray(children))
        {
            children = [ children ];
        }

        for (var i = 0; i < children.length; i++)
        {
            children[i].anims.play(key);
        }

        return this;
    },

    /**
     * Takes an array of Game Objects that have an Animation Component and then
     * starts the given animation playing on them. The start time of each Game Object
     * is offset, incrementally, by the `stagger` amount.
     *
     * For example, if you pass an array with 4 children and a stagger time of 1000,
     * the delays will be:
     *
     * child 1: 1000ms delay
     * child 2: 2000ms delay
     * child 3: 3000ms delay
     * child 4: 4000ms delay
     *
     * If you set the `staggerFirst` parameter to `false` they would be:
     *
     * child 1: 0ms delay
     * child 2: 1000ms delay
     * child 3: 2000ms delay
     * child 4: 3000ms delay
     *
     * You can also set `stagger` to be a negative value. If it was -1000, the above would be:
     *
     * child 1: 3000ms delay
     * child 2: 2000ms delay
     * child 3: 1000ms delay
     * child 4: 0ms delay
     *
     * @method Phaser.Animations.AnimationManager#staggerPlay
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} children - An array of Game Objects to play the animation on. They must have an Animation Component.
     * @param {number} stagger - The amount of time, in milliseconds, to offset each play time by. If a negative value is given, it's applied to the children in reverse order.
     * @param {boolean} [staggerFirst=true] -Should the first child be staggered as well?
     *
     * @return {this} This Animation Manager.
     */
    staggerPlay: function (key, children, stagger, staggerFirst)
    {
        if (stagger === undefined) { stagger = 0; }
        if (staggerFirst === undefined) { staggerFirst = true; }

        if (!Array.isArray(children))
        {
            children = [ children ];
        }

        var len = children.length;

        if (!staggerFirst)
        {
            len--;
        }

        for (var i = 0; i < children.length; i++)
        {
            var time = (stagger < 0) ? Math.abs(stagger) * (len - i) : stagger * i;

            children[i].anims.playAfterDelay(key, time);
        }

        return this;
    },

    /**
     * Removes an Animation from this Animation Manager, based on the given key.
     *
     * This is a global action. Once an Animation has been removed, no Game Objects
     * can carry on using it.
     *
     * @method Phaser.Animations.AnimationManager#remove
     * @fires Phaser.Animations.Events#REMOVE_ANIMATION
     * @since 3.0.0
     *
     * @param {string} key - The key of the animation to remove.
     *
     * @return {Phaser.Animations.Animation} The Animation instance that was removed from the Animation Manager.
     */
    remove: function (key)
    {
        var anim = this.get(key);

        if (anim)
        {
            this.emit(Events.REMOVE_ANIMATION, key, anim);

            this.anims.delete(key);

            this.removeMix(key);
        }

        return anim;
    },

    /**
     * Resume all paused animations.
     *
     * @method Phaser.Animations.AnimationManager#resumeAll
     * @fires Phaser.Animations.Events#RESUME_ALL
     * @since 3.0.0
     *
     * @return {this} This Animation Manager.
     */
    resumeAll: function ()
    {
        if (this.paused)
        {
            this.paused = false;

            this.emit(Events.RESUME_ALL);
        }

        return this;
    },

    /**
     * Returns the Animation data as JavaScript object based on the given key.
     * Or, if not key is defined, it will return the data of all animations as array of objects.
     *
     * @method Phaser.Animations.AnimationManager#toJSON
     * @since 3.0.0
     *
     * @param {string} [key] - The animation to get the JSONAnimation data from. If not provided, all animations are returned as an array.
     *
     * @return {Phaser.Types.Animations.JSONAnimations} The resulting JSONAnimations formatted object.
     */
    toJSON: function (key)
    {
        var output = {
            anims: [],
            globalTimeScale: this.globalTimeScale
        };

        if (key !== undefined && key !== '')
        {
            output.anims.push(this.anims.get(key).toJSON());
        }
        else
        {
            this.anims.each(function (animationKey, animation)
            {
                output.anims.push(animation.toJSON());
            });
        }

        return output;
    },

    /**
     * Destroy this Animation Manager and clean up animation definitions and references to other objects.
     * This method should not be called directly. It will be called automatically as a response to a `destroy` event from the Phaser.Game instance.
     *
     * @method Phaser.Animations.AnimationManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.anims.clear();
        this.mixes.clear();

        this.textureManager = null;

        this.game = null;
    }

});

module.exports = AnimationManager;
