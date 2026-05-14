/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Force a value within the boundaries by clamping it to the range `min`, `max`.
 *
 * @function Phaser.Math.Clamp
 * @since 3.0.0
 *
 * @param value - The value to be clamped.
 * @param min - The minimum bounds.
 * @param max - The maximum bounds.
 * @returns The clamped value.
 */
export function Clamp (value: number, min: number, max: number): number
{
    return Math.max(min, Math.min(max, value));
}

export default Clamp;
