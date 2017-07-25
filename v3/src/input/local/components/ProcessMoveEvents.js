var InputEvent = require('../events');

var ProcessMoveEvents = function (pointer)
{
    var currentlyOver = this._temp;

    this.events.dispatch(new InputEvent.POINTER_MOVE(pointer, currentlyOver));

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        this.events.dispatch(new InputEvent.GAME_OBJECT_MOVE(pointer, gameObject));

        gameObject.input.onMove(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);

        if (this.topOnly)
        {
            break;
        }
    }

    /*
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
    */
};

module.exports = ProcessMoveEvents;
