/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Adds the given element to the DOM. If a parent is provided the element is added as a child of the parent, providing it was able to access it.
 * If no parent was given or falls back to using `document.body`.
 *
 * @function Phaser.DOM.AddToDOM
 * @since 3.0.0
 *
 * @param {HTMLElement} element - The element to be added to the DOM. Usually a Canvas object.
 * @param {(string|HTMLElement)} [parent] - The parent in which to add the element. Can be a string which is passed to `getElementById` or an actual DOM object.
 * @param {boolean} [overflowHidden=true] - Whether or not to hide overflowing content inside the parent.
 *
 * @return {HTMLElement} The element that was added to the DOM.
 */
var AddToDOM = function (element, parent, overflowHidden)
{
    if (overflowHidden === undefined) { overflowHidden = true; }

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
            //  Quick test for a HTMLelement
            target = parent;
        }
    }

    //  Fallback, covers an invalid ID and a non HTMLelement object
    if (!target)
    {
        target = document.body;
    }

    if (overflowHidden && target.style)
    {
        target.style.overflow = 'hidden';
    }

    target.appendChild(element);

    return element;
};

module.exports = AddToDOM;
