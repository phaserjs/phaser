/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
* @class Phaser.TextureManager
* @constructor
* @param {Phaser.Game} game
*/
Phaser.TextureManager = function (game) {

    this.game = game;

    this.list = new Phaser.ArraySet();

};

Phaser.TextureManager.prototype.constructor = Phaser.TextureManager;

Phaser.TextureManager.prototype = {

    add: function (texture) {

        return this.list.add(texture);

    }

};
