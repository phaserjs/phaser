/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
Phaser.GameObject.Container = function (state, parent, x, y, name)
{
    Phaser.GameObject.call(this, state, x, y, null, null, parent);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.CONTAINER;

    this.name = name;

    this.children = new Phaser.Component.Children(this);
};

Phaser.GameObject.Container.prototype = Object.create(Phaser.GameObject.prototype);
Phaser.GameObject.Container.prototype.constructor = Phaser.GameObject.Container;

Phaser.GameObject.Container.prototype.preUpdate = function ()
{
    if (this.parent)
    {
        this.color.worldAlpha = this.parent.color.worldAlpha;
    }

    this.children.preUpdate();
};
