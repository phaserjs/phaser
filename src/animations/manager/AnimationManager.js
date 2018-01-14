var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var CustomMap = require('../../structs/Map');

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
     * @requires AddAnimation
     */
    add: require('./inc/AddAnimation'),

    /**
     * @requires CreateFrameAnimation
     */
    create: require('./inc/CreateFrameAnimation'),

    /**
     * @requires FromJSON
     */
    fromJSON: require('./inc/FromJSON'),

    /**
     * @requires GenerateFrameNames
     */
    generateFrameNames: require('./inc/GenerateFrameNames'),

    /**
     * @requires GenerateFrameNumbers
     */
    generateFrameNumbers: require('./inc/GenerateFrameNumbers'),

    /**
     * @requires GetAnimation
     */
    get: require('./inc/GetAnimation'),

    /**
     * @requires LoadAnimationToGameObject
     */
    load: require('./inc/LoadAnimationToGameObject'),

    /**
     * @requires PauseAll
     */
    pauseAll: require('./inc/PauseAll'),

    /**
     * @requires PlayAnimation
     */
    play: require('./inc/PlayAnimation'),

    /**
     * @requires RemoveAnimation
     */
    remove: require('./inc/RemoveAnimation'),

    /**
     * @requires ResumeAll
     */
    resumeAll: require('./inc/ResumeAll'),

    /**
     * @requires StaggerPlayAnimation
     */
    staggerPlay: require('./inc/StaggerPlayAnimation'),

    /**
     * @requires ToJSON
     */
    toJSON: require('./inc/ToJSON'),

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
