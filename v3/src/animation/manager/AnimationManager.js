var Class = require('../../utils/Class');
var EventDispatcher = require('../../events/EventDispatcher');
var Map = require('../../structs/Map');

// Animations are managed by the global AnimationManager. This is a singleton class that is
// responsible for creating and delivering animations and their corresponding data to Game Objects.
// Sprites and other Game Objects get the data they need from the AnimationManager.
// Access it via `scene.anims`.

var AnimationManager = new Class({

    initialize:

    function AnimationManager (game)
    {
        this.game = game;

        this.textureManager = null;

        this.events = new EventDispatcher();

        this.globalTimeScale = 1;

        this.anims = new Map();

        this.paused = false;
    },

    boot: function (textureManager)
    {
        this.textureManager = textureManager;
    },

    add: require('./inc/AddAnimation'),
    create: require('./inc/CreateFrameAnimation'),
    fromJSON: require('./inc/FromJSON'),
    generateFrameNames: require('./inc/GenerateFrameNames'),
    generateFrameNumbers: require('./inc/GenerateFrameNumbers'),
    get: require('./inc/GetAnimation'),
    load: require('./inc/LoadAnimationToGameObject'),
    pauseAll: require('./inc/PauseAll'),
    play: require('./inc/PlayAnimation'),
    remove: require('./inc/RemoveAnimation'),
    resumeAll: require('./inc/ResumeAll'),
    staggerPlay: require('./inc/StaggerPlayAnimation'),
    toJSON: require('./inc/ToJSON'),

    destroy: function ()
    {
        //  TODO
    }

});

module.exports = AnimationManager;
