var DistanceBetween = require('../../../math/distance/DistanceBetween');
var InputEvent = require('../events');

var ProcessDragEvents = function (pointer, time)
{
    if (this._draggable.length === 0)
    {
        //  There are no draggable items, so let's not even bother going further
        return;
    }

    var i;
    var gameObject;
    var list;
    var input;
    var currentlyOver = this._temp;

    //  0 = Not dragging anything
    //  1 = Primary button down and objects below, so collect a draglist
    //  2 = Pointer being checked if meets drag criteria
    //  3 = Pointer meets criteria, notify the draglist
    //  4 = Pointer actively dragging the draglist and has moved
    //  5 = Pointer actively dragging but has been released, notify draglist

    if (pointer.dragState === 0 && pointer.primaryDown && pointer.justDown && currentlyOver.length > 0)
    {
        pointer.dragState = 1;
    }
    else if (pointer.dragState > 0 && !pointer.primaryDown && pointer.justUp)
    {
        pointer.dragState = 5;
    }

    //  Process the various drag states

    //  1 = Primary button down and objects below, so collect a draglist
    if (pointer.dragState === 1)
    {
        //  Get draggable objects, sort them, pick the top (or all) and store them somewhere
        var draglist = [];

        for (i = 0; i < currentlyOver.length; i++)
        {
            gameObject = currentlyOver[i];

            if (gameObject.input.draggable)
            {
                draglist.push(gameObject);
            }
        }

        if (draglist.length === 0)
        {
            pointer.dragState = 0;

            return;
        }
        else if (draglist.length > 1)
        {
            this.sortGameObjects(draglist);

            if (this.topOnly)
            {
                draglist.splice(1);
            }
        }

        //  draglist now contains all potential candidates for dragging
        this._drag[pointer.id] = draglist;

        if (this.dragDistanceThreshold === 0 && this.dragTimeThreshold === 0)
        {
            //  No drag criteria, so snap immediately to mode 3
            pointer.dragState = 3;
        }
        else
        {
            //  Check the distance / time
            pointer.dragState = 2;
        }
    }

    //  2 = Pointer being checked if meets drag criteria
    if (pointer.dragState === 2)
    {
        //  Has it moved far enough to be considered a drag?
        if (this.dragDistanceThreshold > 0 && DistanceBetween(pointer.x, pointer.y, pointer.downX, pointer.downY) >= this.dragDistanceThreshold)
        {
            //  Alrighty, we've got a drag going on ...
            pointer.dragState = 3;
        }

        //  Held down long enough to be considered a drag?
        if (this.dragTimeThreshold > 0 && (time >= pointer.downTime + this.dragTimeThreshold))
        {
            //  Alrighty, we've got a drag going on ...
            pointer.dragState = 3;
        }
    }

    //  3 = Pointer meets criteria and is freshly down, notify the draglist
    if (pointer.dragState === 3)
    {
        list = this._drag[pointer.id];

        for (i = 0; i < list.length; i++)
        {
            gameObject = list[i];

            input = gameObject.input;

            input.dragState = 2;
            input.dragX = input.localX - gameObject.displayOriginX;
            input.dragY = input.localY - gameObject.displayOriginY;

            this.events.dispatch(new InputEvent.DRAG_START(pointer, gameObject));

            input.onDragStart(gameObject, pointer, input.dragX, input.dragY);
        }

        pointer.dragState = 4;

        return;
    }

    //  4 = Pointer actively dragging the draglist and has moved
    if (pointer.dragState === 4 && pointer.justMoved)
    {
        list = this._drag[pointer.id];

        for (i = 0; i < list.length; i++)
        {
            gameObject = list[i];

            input = gameObject.input;

            // input.dragX = pointer.x - (input.localX - gameObject.displayOriginX);
            // input.dragY = pointer.y - (input.localY - gameObject.displayOriginY);

            // input.dragX = pointer.x - input.localX;
            // input.dragY = pointer.y - input.localY;

            this.events.dispatch(new InputEvent.DRAG(pointer, gameObject));

            input.onDrag(gameObject, pointer);
        }

        //  Check drop zones
    }

    //  5 = Pointer actively dragging but has been released, notify draglist
    if (pointer.dragState === 5)
    {
        list = this._drag[pointer.id];

        for (i = 0; i < list.length; i++)
        {
            gameObject = list[i];

            input = gameObject.input;

            input.dragState = 0;
            input.dragX = input.localX - gameObject.displayOriginX;
            input.dragY = input.localY - gameObject.displayOriginY;

            //  Any drop zones here?
            for (var c = 0; c < currentlyOver.length; c++)
            {
                var overGameObject = currentlyOver[c];

                if (overGameObject.input.dropZone)
                {
                    this.events.dispatch(new InputEvent.DROP(pointer, gameObject, overGameObject));
                }
            }

            //  And finally the dragend event

            this.events.dispatch(new InputEvent.DRAG_END(pointer, gameObject));

            input.onDragEnd(gameObject, pointer, input.dragX, input.dragY);
        }

        pointer.dragState = 0;
    }
};

module.exports = ProcessDragEvents;
