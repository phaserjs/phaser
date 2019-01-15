/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Game Boot Texture Manager is Ready Event.
 * 
 * When a Phaser Game instance is booting for the first time, the Texture Manager has to wait on a couple of non-blocking
 * async events before it's fully ready to carry on. When those complete the Texture Manager emits this event via the Game
 * instance, which tells the Game to carry on booting.
 *
 * @event Phaser.Core.Events#TEXTURES_READY
 */
module.exports = 'texturesready';
