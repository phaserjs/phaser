/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Visibility Handler hidden event.
 *
 * The document in which the Game is embedded has entered a hidden state.
 *
 * @event Phaser.Boot.VisibilityHandler#hidden
 */
/**
 * Visibility Handler visible event.
 *
 * The document in which the Game is embedded has entered a visible state.
 *
 * @event Phaser.Boot.VisibilityHandler#visible
 */
/**
 * Visibility Handler blur event.
 *
 * The window in which the Game is embedded has entered a blurred state.
 *
 * @event Phaser.Boot.VisibilityHandler#blur
 */
/**
 * Visibility Handler focus event.
 *
 * The window in which the Game is embedded has entered a focused state.
 *
 * @event Phaser.Boot.VisibilityHandler#focus
 */
/**
 * The Visibility Handler is responsible for listening out for document level visibility change events.
 * This includes `visibilitychange` if the browser supports it, and blur and focus events. It then uses
 * the provided Event Emitter and fires the related events.
 *
 * @function Phaser.Boot.VisibilityHandler
 * @fires Phaser.Boot.VisibilityHandler#hidden
 * @fires Phaser.Boot.VisibilityHandler#visible
 * @fires Phaser.Boot.VisibilityHandler#blur
 * @fires Phaser.Boot.VisibilityHandler#focus
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Game instance this Visibility Handler is working on.
 */
declare var VisibilityHandler: any;
