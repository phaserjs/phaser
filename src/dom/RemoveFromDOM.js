/**
 * Attempts to remove the element from its parentNode in the DOM.
 *
 * @function Phaser.Dom.RemoveFromDOM
 * @since 3.0.0
 *
 * @param {any} element - The DOM element to remove from its parent node.
 */
var RemoveFromDOM = function (element)
{
    if (element.parentNode)
    {
        element.parentNode.removeChild(element);
    }
};

module.exports = RemoveFromDOM;
