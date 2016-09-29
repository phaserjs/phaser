/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Textures are managed by the global TextureManager. This is a singleton class that is
* responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
*
* Sprites and other Game Objects get the texture data they need from the TextureManager.
*
* Access it via `state.textures`.
*
* @class Phaser.TextureManager
* @constructor
* @param {Phaser.Game} game
*/
Phaser.TextureManager = function (game)
{
    this.game = game;

    this.list = {
        //  Empty by default
    };

};

Phaser.TextureManager.prototype.constructor = Phaser.TextureManager;

Phaser.TextureManager.prototype = {

    create: function (key, source, scaleMode)
    {
        var texture = new Phaser.Texture(key, source, scaleMode);

        this.list[key] = texture;

        return texture;

    },

    get: function (key, frame)
    {
        if (this.list[key])
        {
            if (frame)
            {
                return this.list[key].get(frame);
            }
            else
            {
                return this.list[key];
            }
        }

    }

};

Phaser.TextureManager.Parsers = {

};
