/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Attempts to remove the element from its parentNode in the DOM.
 *
 * @function Phaser.DOM.RemoveFromDOM
 * @since 3.0.0
 *
 * @param {HTMLElement} element - The DOM element to remove from its parent node.
 */
var RemoveFromDOM = function (element)
{
    if (element.parentNode)
    {
        element.parentNode.removeChild(element);
    }
};

module.exports = RemoveFromDOM;
