/**
 * [description]
 *
 * @function Phaser.Dom.RemoveFromDOM
 * @since 3.0.0
 *
 * @param {any} element - [description]
 */
var RemoveFromDOM = function (element)
{
    if (element.parentNode)
    {
        element.parentNode.removeChild(element);
    }
};

module.exports = RemoveFromDOM;
