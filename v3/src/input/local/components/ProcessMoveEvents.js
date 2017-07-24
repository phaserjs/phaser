var InputEvent = require('../events');

var ProcessMoveEvents = function (pointer, currentlyOver)
{
    var i;
    var interactiveObject;

    if (currentlyOver.length === 0)
    {
        //  Dispatch MOVE event, even though pointer isn't over anything
        this.events.dispatch(new InputEvent.MOVE(pointer));
    }
    else
    {
        //  Go through all objects the pointer is over and dispatch them
        for (i = 0; i < currentlyOver.length; i++)
        {
            interactiveObject = currentlyOver[i];

            this.events.dispatch(new InputEvent.MOVE(pointer, interactiveObject.gameObject, currentlyOver));

            this.childOnMove(pointer, interactiveObject);

            if (this.topOnly)
            {
                break;
            }
        }
    }

    //  Check the list of Draggable Items
    for (i = 0; i < this.children.draggable.length; i++)
    {
        interactiveObject = this.children.draggable[i];

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
};

module.exports = ProcessMoveEvents;
