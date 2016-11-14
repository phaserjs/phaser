/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Blitter = function (state, parent)
{
    Phaser.GameObject.call(this, state, 0, 0, null, null, parent);

    this.type = Phaser.BLITTER;

    this.children = new Phaser.Component.Children(this);
};

Phaser.GameObject.Blitter.prototype = Object.create(Phaser.GameObject.prototype);
Phaser.GameObject.Blitter.prototype.constructor = Phaser.GameObject.Blitter;

Phaser.GameObject.Blitter.prototype.preUpdate = function ()
{
    if (this.parent)
    {
        this.color.worldAlpha = this.parent.color.worldAlpha;
    }
};

Phaser.GameObject.Blitter.prototype.create = function (frame, x, y, visible, index)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (visible === undefined) { visible = true; }
    if (index === undefined) { index = 0; }

    var bob = new Phaser.GameObject.Blitter.Bob(this, frame, x, y, visible);

    this.children.addAt(bob, index, true);

    return bob;
};

Phaser.GameObject.Blitter.prototype.createMultiple = function (quantity, frame, visible)
{
    if (visible === undefined) { visible = true; }

    if (!Array.isArray(frame))
    {
        frame = [ frame ];
    }

    var bobs = [];

    for (var f = 0; f < frame.length; f++)
    {
        for (var i = 0; i < quantity; i++)
        {
            bobs.push(this.create(frame[f], 0, 0, visible));
        }
    }

    return bobs;
};
