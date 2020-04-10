/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Attempts to get the target DOM element based on the given value, which can be either
 * a string, in which case it will be looked-up by ID, or an element node. If nothing
 * can be found it will return a reference to the document.body.
 *
 * @function Phaser.DOM.GetTarget
 * @since 3.16.0
 *
 * @param {HTMLElement} element - The DOM element to look-up.
 */
var GetTarget = function (element)
{
    var target;

    if (element !== '')
    {
        if (typeof element === 'string')
        {
            //  Hopefully an element ID
            target = document.getElementById(element);
        }
        else if (element && element.nodeType === 1)
        {
            //  Quick test for a HTMLElement
            target = element;
        }
    }

    //  Fallback to the document body. Covers an invalid ID and a non HTMLElement object.
    if (!target)
    {
        //  Use the full window
        target = document.body;
    }

    return target;
};

module.exports = GetTarget;
