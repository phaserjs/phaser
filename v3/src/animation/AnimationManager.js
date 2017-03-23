/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Map = require('../structs/Map');

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

    this.anims = new Map();
};

AnimationManager.prototype.constructor = AnimationManager;

AnimationManager.prototype = {

    //  add frame name based animation
    //  add frame index based animation
    //  add bone based animation
    //  add animation from json data

    add: function (key, frames, loop)
    {
        if (this.anims.has(key))
        {
            console.error('Animation with key', key, 'already exists');
            return;
        }


    },

    get: function (key)
    {
        return this.anims.get(key);
    }

};

module.exports = AnimationManager;
