/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Blitter.Bob = function (parent, frame, x, y, visible)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (visible === undefined) { visible = true; }

    this.parent = parent;

    this.texture = frame.texture;

    this.frame = frame;

    this.type = 0;

    this.x = x;
    this.y = y;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.pivotX = 0;
    this.pivotY = 0;
    this.anchorX = 0;
    this.anchorY = 0;

    this.alpha = 1;

    this.scaleMode = Phaser.scaleModes.DEFAULT;

    this.visible = visible;
};

Phaser.GameObject.Blitter.Bob.prototype.constructor = Phaser.GameObject.Blitter.Bob;
