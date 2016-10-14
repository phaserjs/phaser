/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
Phaser.GameObject.Container = function (game, parent, x, y)
{
    Phaser.Component.BaseTransform.call(this, x, y);

    this.game = game;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.CONTAINER;

    this.parent = parent;

    this.children = new Phaser.Component.Children(this);

    this.data = new Phaser.Component.Data(this);

    //  Temporary for now?
    this.visible = true;
    this.alpha = 1;
    this.worldAlpha = 1;
    this.blendMode = Phaser.blendModes.NORMAL;
    this.scaleMode = Phaser.scaleModes.DEFAULT;
    this.exists = true;

};

Phaser.GameObject.Container.prototype = Object.create(Phaser.Component.BaseTransform.prototype);
Phaser.GameObject.Container.prototype.constructor = Phaser.GameObject.Container;

Phaser.GameObject.Container.prototype.preUpdate = function ()
{
    if (this.parent)
    {
        this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }
};

Phaser.GameObject.Container.prototype.update = function ()
{
};

Phaser.GameObject.Container.prototype.postUpdate = function ()
{
};
