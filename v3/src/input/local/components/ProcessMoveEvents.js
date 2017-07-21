var InputEvent = require('../events');

var ProcessMoveEvents = function (pointer, currentlyOver)
{
    if (currentlyOver.length === 0)
    {
        //  Dispatch MOVE event, even though pointer isn't over anything
        this.events.dispatch(new InputEvent.MOVE(pointer));
    }
    else
    {
        //  Go through all objects the pointer is over and dispatch them
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var interactiveObject = currentlyOver[i];

            this.events.dispatch(new InputEvent.MOVE(pointer, interactiveObject.gameObject, currentlyOver));

            this.childOnMove(pointer, interactiveObject);

            if (this.topOnly)
            {
                break;
            }
        }
    }

    //  Check the list of Draggable Items
    /*
    for (var i = 0; i < this.children.draggable.length; i++)
    {
        var interactiveObject = this.children.draggable[i];

        if (!interactiveObject.enabled)
        {
            continue;
        }

        if (pointer.justUp && interactiveObject.isDragged)
        {
            //  Drag End
            this.childOnDragEnd(i, pointer, interactiveObject);
        }
        else if (interactiveObject.isDragged)
        {
            //  Drag
            this.childOnDrag(i, pointer, interactiveObject);
        }
    }
    */

};

module.exports = ProcessMoveEvents;
