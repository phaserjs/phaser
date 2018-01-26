/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Timeline Component.
*
* @class
*/
Phaser.Component.Timeline = function (gameObject)
{
    this.gameObject = gameObject;

    this.game = gameObject.game;

    this._dirty = false;
};

Phaser.Component.Timeline.prototype.constructor = Phaser.Component.Timeline;

Phaser.Component.Timeline.prototype = {

};
