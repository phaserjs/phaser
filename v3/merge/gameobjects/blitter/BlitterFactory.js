/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Blitter.FACTORY_KEY = 'blitter';

Phaser.GameObject.Blitter.FACTORY_ADD = function (parent)
{
    if (parent === undefined) { parent = this.state; }

    return parent.children.add(new Phaser.GameObject.Blitter(this.state, parent));
};

Phaser.GameObject.Blitter.FACTORY_MAKE = function (parent)
{
    return new Phaser.GameObject.Blitter(this.state, parent);
};
