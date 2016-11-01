/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Container.FACTORY_KEY = 'container';

Phaser.GameObject.Container.FACTORY_ADD = function (parent, x, y, name)
{
    return parent.children.add(new Phaser.GameObject.Container(this.game, null, x, y, name));
};

Phaser.GameObject.Container.FACTORY_MAKE = function (parent, x, y)
{
    return new Phaser.GameObject.Container(this.game, parent, x, y);
};
