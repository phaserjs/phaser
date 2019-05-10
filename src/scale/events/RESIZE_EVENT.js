/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scale Manager Resize Event.
 * 
 * This event is dispatched whenever the Scale Manager detects a resize event from the browser.
 * It sends three parameters to the callback, each of them being Size components. You can read
 * the `width`, `height`, `aspectRatio` and other properties of these components to help with
 * scaling your own game content.
 *
 * @event Phaser.Scale.Events#RESIZE
 * @since 3.16.1
 * 
 * @param {Phaser.Structs.Size} gameSize - A reference to the Game Size component. This is the un-scaled size of your game canvas.
 * @param {Phaser.Structs.Size} baseSize - A reference to the Base Size component. This is the game size multiplied by resolution.
 * @param {Phaser.Structs.Size} displaySize - A reference to the Display Size component. This is the scaled canvas size, after applying zoom and scale mode.
 */
module.exports = 'resize';
