/**
 * [description]
 *
 * @function Phaser.Dom.AddToDOM
 * @since 3.0.0
 *
 * @param {any} element - [description]
 * @param {any} parent - [description]
 * @param {boolean} [overflowHidden=true] - [description]
 *
 * @return {any} [description]
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
