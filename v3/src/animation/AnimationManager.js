/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// var Parser = require('./parsers');
// var Texture = require('./Texture');
// var CanvasPool = require('../dom/CanvasPool');

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

    this.list = {};
};

AnimationManager.prototype.constructor = AnimationManager;

AnimationManager.prototype = {

    //  add frame name based animation
    //  add frame index based animation
    //  add bone based animation
    //  add animation from json data

    add: function (key, frames, loop)
    {

    },

    get: function (key)
    {
        if (this.list[key])
        {
            //
        }
    }

};

module.exports = AnimationManager;
