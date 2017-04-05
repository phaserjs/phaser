/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Animation = require('./frame/Animation');
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

    this.textureManager = null;

    this.anims = new Map();
};

AnimationManager.prototype.constructor = AnimationManager;

AnimationManager.prototype = {

    boot: function (textureManager)
    {
        this.textureManager = textureManager;
    },

    //  config format:
    //  {
    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //      ],
    //      framerate: integer,
    //      duration: float (seconds, optional, ignored if framerate is set),
    //      skipMissedFrames: boolean,
    //      delay: integer
    //      repeat: -1 = forever, otherwise integer
    //      repeatDelay: integer
    //      yoyo: boolean
    //      hideOnComplete: boolean
    //      onStart: function
    //      onRepeat: function
    //      onComplete: function,
    //      transitions: [
    //          {
    //              key: string <- key of the animation to blend with,
    //              frames: [] <- play these frames before starting key
    //          }
    //      ]
    //  }

    create: function (key, config)
    {
        if (this.anims.has(key))
        {
            console.error('Animation with key', key, 'already exists');
            return;
        }

        var anim = new Animation(this, key, config);

        this.anims.set(key, anim);

        return anim;
    },

    get: function (key)
    {
        return this.anims.get(key);
    },

    //  Load an Animation into a Game Objects Animation Component
    load: function (child, key, startFrame)
    {
        var anim = this.get(key);

        if (anim)
        {
            anim.load(child, startFrame);
        }

        return child;
    },

    buildSpriteSheetFrames: function (key, startFrame, endFrame)
    {
        var out = [];

        for (var i = startFrame; i <= endFrame; i++)
        {
            out.push({ key: key, frame: i });
        }

        return out;
    }

};

module.exports = AnimationManager;
