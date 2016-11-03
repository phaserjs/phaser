/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Base State Class.
*
* @class Phaser.State
* @constructor
*/
Phaser.State = function (game, key)
{
    this.game = game;

    this.key = key;

    this.worldWidth = 800;
    this.worldHeight = 600;

    this.displayWidth = 800;
    this.displayHeight = 600;

    this.add = new Phaser.GameObject.Factory(game, this);

    this.transform = new Phaser.Component.Transform(this);

    this.data = new Phaser.Component.Data(this);

    this.color = new Phaser.Component.Color(this);

    this.scaleMode = Phaser.scaleModes.DEFAULT;

    this.visible = true;

    this.children = new Phaser.Component.Children(this);


};

Phaser.State.prototype = {

    boot: function ()
    {

    },

    render: function (renderer)
    {
        if (!this.visible || this.alpha === 0 || this.children.list.length === 0)
        {
            return;
        }

        for (var i = 0; i < this.children.list.length; i++)
        {
            var child = this.children.list[i];

            child.render(renderer, child);
        }
    }

};

Phaser.State.prototype.constructor = Phaser.State;
