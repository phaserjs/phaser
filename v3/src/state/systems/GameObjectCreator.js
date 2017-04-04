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
var GameObjectCreator = function (state)
{
    this.state = state;

    this.children = state.sys.children;

    FactoryContainer.load(this, false);
};

GameObjectCreator.prototype.constructor = GameObjectCreator;

GameObjectCreator.prototype = {

    destroy: function ()
    {
        this.state = undefined;
    }

};

module.exports = GameObjectCreator;
