/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var FactoryContainer = require('../../gameobjects/FactoryContainer');

/**
* The GameObject Factory is a quick way to create many common game objects. The Factory is owned by the State.
*
* @class Phaser.GameObject.Factory
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
var GameObjectFactory = function (state)
{
    this.state = state;

    this.children = state.sys.children;

    FactoryContainer.load(this, true);
};

GameObjectFactory.prototype.constructor = GameObjectFactory;

GameObjectFactory.prototype = {

    existing: function (child)
    {
        return this.children.add(child);
    },

    destroy: function ()
    {
        this.state = undefined;
    }

};

module.exports = GameObjectFactory;
