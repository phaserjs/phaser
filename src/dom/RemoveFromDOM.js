/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
