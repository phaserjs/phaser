/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a stub for the Phaser ScaleManager.
* It allows you to exclude the default Scale Manager from your build, without making Game crash.
*/

Phaser.ScaleManager = function () {

    /**
    * The bounds of the scaled game. The x/y will match the offset of the canvas element and the width/height the scaled width and height.
    * @property {Phaser.Rectangle} bounds
    * @readonly
    */
    this.bounds = new Phaser.Rectangle();
    
};

Phaser.ScaleManager.prototype.boot = function () {};
Phaser.ScaleManager.prototype.preUpdate = function () {};
Phaser.ScaleManager.prototype.pauseUpdate = function () {};
Phaser.ScaleManager.prototype.destroy = function () {};

Phaser.ScaleManager.prototype.constructor = Phaser.ScaleManager;
