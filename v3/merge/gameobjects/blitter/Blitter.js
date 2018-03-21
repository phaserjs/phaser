/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Blitter Game Object.
*
* The Blitter Game Object is a special type of Container, that contains Blitter.Bob objects.
* These objects can be thought of as just texture frames with a transform, and nothing more.
* Bobs don't have any update methods, or the ability to have children, or any kind of special effects.
* They are essentially just texture renderers, and the Blitter object creates and manages them.
*
* @class
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

Phaser.GameObject.Blitter.prototype.create = function (x, y, key, frame, visible, index)
{
    if (visible === undefined) { visible = true; }
    if (index === undefined) { index = 0; }

    var bob = new Phaser.GameObject.Blitter.Bob(this, x, y, key, frame, visible);

    this.children.addAt(bob, index, false);

    return bob;
};

Phaser.GameObject.Blitter.prototype.createFromCallback = function (callback, quantity, key, frame, visible)
{
    var bobs = this.createMultiple(quantity, key, frame, visible);

    for (var i = 0; i < bobs.length; i++)
    {
        var bob = bobs[i];

        callback.call(this, bob, i);
    }

    return bobs;
};

Phaser.GameObject.Blitter.prototype.createMultiple = function (quantity, key, frame, visible)
{
    if (frame === undefined) { frame = 0; }
    if (visible === undefined) { visible = true; }

    if (!Array.isArray(key))
    {
        key = [ key ];
    }

    if (!Array.isArray(frame))
    {
        frame = [ frame ];
    }

    var bobs = [];
    var _this = this;

    key.forEach(function (singleKey)
    {
        frame.forEach(function (singleFrame)
        {
            for (var i = 0; i < quantity; i++)
            {
                bobs.push(_this.create(0, 0, singleKey, singleFrame, visible));
            }
        });
    });

    return bobs;
};
