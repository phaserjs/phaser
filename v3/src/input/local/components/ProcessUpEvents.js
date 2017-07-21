var InputEvent = require('../events');

var ProcessUpEvents = function (pointer, currentlyOver)
{
    //  If the pointer is released we need to reset all 'isDown' IOs, regardless if pointer is still over them or not
    //  Also concat in the currentlyOver, so we can dispatch an UP event for an IO that has the pointer over it.
    //  For example if you click down outside a sprite, hold down, move over the sprite, then release, the sprite will
    //  still fire an UP event, even though it never previously received a DOWN event.
    var previouslyDown = this.children.down[pointer.id].concat(currentlyOver);

    if (previouslyDown.length === 0)
    {
        //  Dispatch UP event, even though nothing was down previously
        this.events.dispatch(new InputEvent.UP(pointer));
    }
    else
    {
        //  Go through all objects the pointer was previously down on and set to up
        for (var i = 0; i < previouslyDown.length; i++)
        {
            var interactiveObject = previouslyDown[i];

            if (!this.topOnly || (this.topOnly && i === 0))
            {
                this.events.dispatch(new InputEvent.UP(pointer, interactiveObject.gameObject, previouslyDown));
            }

            this.childOnUp(i, pointer, interactiveObject);
        }
    }

    //  Reset the down array
    this.children.down[pointer.id].length = 0;
};

module.exports = ProcessUpEvents;
