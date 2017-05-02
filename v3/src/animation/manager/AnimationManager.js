/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Map = require('../../structs/Map');
var Components = require('./components/');
var EventDispatcher = require('../../events/EventDispatcher');
var Event = require('./events');

/**
* Animations are managed by the global AnimationManager. This is a singleton class that is
* responsible for creating and delivering animations and their corresponding data to Game Objects.
*
* Sprites and other Game Objects get the data they need from the AnimationManager.
*
* Access it via `state.anims`.
*
* @class Phaser.AnimationManager
* @constructor
*/
var AnimationManager = function (game)
{
    this.game = game;

    this.textureManager = null;

    this.events = new EventDispatcher();

    this.globalTimeScale = 1;

    this.anims = new Map();

    this.paused = false;
};

AnimationManager.prototype.constructor = AnimationManager;

AnimationManager.prototype = {

    boot: function (textureManager)
    {
        this.textureManager = textureManager;
    },

    add: Components.AddAnimation,
    create: Components.CreateFrameAnimation,
    fromJSON: Components.FromJSON,
    generateFrameNames: Components.GenerateFrameNames,
    generateFrameNumbers: Components.GenerateFrameNumbers,
    get: Components.GetAnimation,
    load: Components.LoadAnimationToGameObject,
    play: Components.PlayAnimation,
    pauseAll: Components.PauseAll,
    remove: Components.RemoveAnimation,
    resumeAll: Components.ResumeAll,
    staggerPlay: Components.StaggerPlayAnimation,
    toJSON: Components.ToJSON,

    destroy: function ()
    {
        //  TODO
    }
};

module.exports = AnimationManager;
