/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * This internal event signifies that the Texture Manager is now ready and the Game can continue booting.
 * 
 * When a Phaser Game instance is booting for the first time, the Texture Manager has to wait on a couple of non-blocking
 * async events before it's fully ready to carry on. When those complete the Texture Manager emits this event via the Game
 * instance, which tells the Game to carry on booting.
 *
 * @event Phaser.Textures.Events#READY
 * @since 3.16.1
 */
module.exports = 'ready';
