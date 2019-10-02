/**
 * @typedef {object} Phaser.Types.Tweens.StaggerConfig
 * @since 3.19.0
 *
 * @property {number} [start=0] - The value to start the stagger from. Can be used as a way to offset the stagger while still using a range for the value.
 * @property {(string|function)} [ease='Linear'] - An ease to apply across the staggered values. Can either be a string, such as 'sine.inout', or a function.
 * @property {(string|integer)} [from=0] - The index to start the stagger from. Can be the strings `first`, `last` or `center`, or an integer representing the stagger position.
 * @property {integer[]} [grid] - Set the stagger to run across a grid by providing an array where element 0 is the width of the grid and element 1 is the height. Combine with the 'from' property to control direction.
 *
 * @example
 * {
 *   grid: [ 20, 8 ],
 *   from: 'center',
 *   ease: 'Power0',
 *   start: 100
 * };
 */
