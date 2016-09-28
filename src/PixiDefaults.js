/* global Phaser:true */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

//  Pixi expects these globals to exist

if (PIXI.blendModes === undefined)
{
    PIXI.blendModes = Phaser.blendModes;
}

if (PIXI.scaleModes === undefined)
{
    PIXI.scaleModes = Phaser.scaleModes;
}

if (PIXI.Texture.emptyTexture === undefined)
{
    PIXI.Texture.emptyTexture = new PIXI.Texture(new PIXI.BaseTexture());
}

if (PIXI.DisplayObject._tempMatrix === undefined)
{
    PIXI.DisplayObject._tempMatrix = new PIXI.Matrix();
}

PIXI.TextureSilentFail = true;
