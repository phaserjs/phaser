/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var OS: any;
/**
 * @callback ContentLoadedCallback
 */
/**
 * Inspects the readyState of the document. If the document is already complete then it invokes the given callback.
 * If not complete it sets up several event listeners such as `deviceready`, and once those fire, it invokes the callback.
 * Called automatically by the Phaser.Game instance. Should not usually be accessed directly.
 *
 * @function Phaser.DOM.DOMContentLoaded
 * @since 3.0.0
 *
 * @param {ContentLoadedCallback} callback - The callback to be invoked when the device is ready and the DOM content is loaded.
 */
declare var DOMContentLoaded: any;
