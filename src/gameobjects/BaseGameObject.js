/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject = function (game)
{
    this.game = game;

    this.name = '';

    this.parent = null;

    this.children = null;

    this.transform = null;
};

Phaser.GameObject.prototype.constructor = Phaser.GameObject;

Phaser.GameObject.prototype = {

    preUpdate: function ()
    {
        //  NOOP
    },

    update: function ()
    {
        //  NOOP
    },

    postUpdate: function ()
    {
        //  NOOP
    },

    render: function ()
    {
        //  NOOP
    }

};
