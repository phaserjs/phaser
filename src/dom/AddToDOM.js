/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Adds the given element to the DOM. If a parent is provided the element is added as a child of the parent, providing it was able to access it.
 * If no parent was given it falls back to using `document.body`.
 *
 * @function Phaser.DOM.AddToDOM
 * @since 3.0.0
 *
 * @param {HTMLElement} element - The element to be added to the DOM. Usually a Canvas object.
 * @param {(string|HTMLElement)} [parent] - The parent in which to add the element. Can be a string which is passed to `getElementById` or an actual DOM object.
 *
 * @return {HTMLElement} The element that was added to the DOM.
 */
var AddToDOM = function (element, parent)
{
    var target;

    if (parent)
    {
        if (typeof parent === 'string')
        {
            //  Hopefully an element ID
            target = document.getElementById(parent);
        }
        else if (typeof parent === 'object' && parent.nodeType === 1)
        {
            //  Quick test for a HTMLElement
            target = parent;
        }
    }
    else if (element.parentElement)
    {
        return element;
    }

    //  Fallback, covers an invalid ID and a non HTMLElement object
    if (!target)
    {
        target = document.body;
    }

    target.appendChild(element);

    return element;
};

module.exports = AddToDOM;
