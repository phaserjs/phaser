/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Visible Event.
 *
 * This event is dispatched by the Game Visibility Handler when the document in which the Game instance is embedded
 * enters a visible state, previously having been hidden.
 *
 * Only browsers that support the Visibility API will cause this event to be emitted.
 *
 * @event Phaser.Core.Events#VISIBLE
 * @type {string}
 * @since 3.0.0
 */
module.exports = 'visible';
