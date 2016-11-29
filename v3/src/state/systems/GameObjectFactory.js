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

var GameObjectFactory = {

    /**
    * @property {Phaser.State} state - The State that owns this Factory
    * @protected
    */
    state: null

};

function init (state)
{
    console.log('Creating GameObjectFactory instance for State', state);

    GameObjectFactory.state = state;

    //   Load the factories into this Object

    FactoryContainer.load(GameObjectFactory);

    return GameObjectFactory;
}

module.exports = init;
