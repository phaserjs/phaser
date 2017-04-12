/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Map = require('../../structs/Map');

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

    this.globalTimeScale = 1;

    this.anims = new Map();
};

AnimationManager.prototype.constructor = AnimationManager;

AnimationManager.prototype = {

    boot: function (textureManager)
    {
        this.textureManager = textureManager;
    },

    add: require('./AddAnimation'),
    create: require('./CreateFrameAnimation'),
    get: require('./GetAnimation'),
    remove: require('./RemoveAnimation'),
    load: require('./LoadAnimationToGameObject'),
    play: require('./PlayAnimation'),
    staggerPlay: require('./StaggerPlayAnimation'),
    generateFrameNumbers: require('./GenerateFrameNumbers'),
    generateFrameNames: require('./GenerateFrameNames'),
    toJSON: require('./ToJSON'),

    destroy: function ()
    {
        //  TODO
    }
};

module.exports = AnimationManager;
