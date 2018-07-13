/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Color: any;
/**
 * Converts a hex string into a Phaser Color object.
 *
 * The hex string can supplied as `'#0033ff'` or the short-hand format of `'#03f'`; it can begin with an optional "#" or "0x", or be unprefixed.
 *
 * An alpha channel is _not_ supported.
 *
 * @function Phaser.Display.Color.HexStringToColor
 * @since 3.0.0
 *
 * @param {string} hex - The hex color value to convert, such as `#0033ff` or the short-hand format: `#03f`.
 *
 * @return {Phaser.Display.Color} A Color object populated by the values of the given string.
 */
declare var HexStringToColor: (hex: any) => any;
