/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.WebGLFilterManager
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.FilterManager = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;
};

Phaser.Renderer.WebGL.FilterManager.prototype.constructor = Phaser.Renderer.WebGL.FilterManager;

Phaser.Renderer.WebGL.FilterManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

    }

};
