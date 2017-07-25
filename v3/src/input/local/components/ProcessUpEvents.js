var InputEvent = require('../events');

var ProcessUpEvents = function (pointer)
{
    var currentlyOver = this._temp;

    this.events.dispatch(new InputEvent.POINTER_UP(pointer, currentlyOver));

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        this.events.dispatch(new InputEvent.GAME_OBJECT_UP(pointer, gameObject));

        gameObject.input.onUp(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);

        if (this.topOnly)
        {
            break;
        }
    }

    /*

    //  If the pointer is released we need to reset all 'isDown' IOs, regardless if pointer is still over them or not
    //  Also concat in the currentlyOver, so we can dispatch an UP event for an IO that has the pointer over it.
    //  For example if you click down outside a sprite, hold down, move over the sprite, then release, the sprite will
    //  still fire an UP event, even though it never previously received a DOWN event.
    var previouslyDown = this.children.down[pointer.id].concat(currentlyOver);

    var i;
    var interactiveObject;

    if (previouslyDown.length === 0)
    {
        //  Dispatch UP event, even though nothing was down previously
        this.events.dispatch(new InputEvent.UP(pointer));
    }
    else
    {
        //  Go through all objects the pointer was previously down on and set to up
        for (i = 0; i < previouslyDown.length; i++)
        {
            interactiveObject = previouslyDown[i];

            if (!this.topOnly || (this.topOnly && i === 0))
            {
                this.events.dispatch(new InputEvent.UP(pointer, interactiveObject.gameObject, previouslyDown));
            }

            this.childOnUp(i, pointer, interactiveObject);
        }
    }

    //  Reset the down array
    this.children.down[pointer.id].length = 0;

    //  Now check the list of Draggable Items for this pointer


    for (i = 0; i < this.children.draggable.length; i++)
    {
        interactiveObject = this.children.draggable[pointer.id];

        if (!interactiveObject.enabled)
        {
            continue;
        }

        if (pointer.justUp && interactiveObject.isDragged)
        {
            //  Drag End
            this.childOnDragEnd(pointer, interactiveObject, currentlyOver);
        }
        else if (interactiveObject.isDragged)
        {
            //  Drag
            this.childOnDrag(pointer, interactiveObject, currentlyOver);
        }
    }
    */

};

module.exports = ProcessUpEvents;
