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
    var c;
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

            input.dragX = pointer.x - gameObject.x;
            input.dragY = pointer.y - gameObject.y;

            input.dragStartX = gameObject.x;
            input.dragStartY = gameObject.y;

            this.events.dispatch(new InputEvent.DRAG_START(pointer, gameObject));

            if (gameObject.input)
            {
                input.onDragStart(gameObject, pointer, input.dragX, input.dragY);
            }
        }

        pointer.dragState = 4;

        return;
    }

    //  4 = Pointer actively dragging the draglist and has moved
    if (pointer.dragState === 4 && pointer.justMoved)
    {
        //  Let's filter out currentlyOver for dropZones only
        var dropZones = [];

        for (c = 0; c < currentlyOver.length; c++)
        {
            if (currentlyOver[c].input.dropZone)
            {
                dropZones.push(currentlyOver[c]);
            }
        }

        list = this._drag[pointer.id];

        for (i = 0; i < list.length; i++)
        {
            gameObject = list[i];

            input = gameObject.input;

            //  If this GO has a target then let's check it
            if (input.target)
            {
                var index = dropZones.indexOf(input.target);

                //  Got a target, are we still over it?
                if (index === 0)
                {
                    //  We're still over it, and it's still the top of the display list, phew ...
                    this.events.dispatch(new InputEvent.DRAG_OVER(pointer, gameObject, input.target));
                }
                else if (index > 0)
                {
                    //  Still over it but it's no longer top of the display list (targets must always be at the top)
                    this.events.dispatch(new InputEvent.DRAG_LEAVE(pointer, gameObject, input.target));

                    if (gameObject.input)
                    {
                        input.target = dropZones[0];
                    }

                    this.events.dispatch(new InputEvent.DRAG_ENTER(pointer, gameObject, input.target));
                }
                else
                {
                    //  Nope, we've moved on (or the target has!), leave the old target
                    this.events.dispatch(new InputEvent.DRAG_LEAVE(pointer, gameObject, input.target));

                    //  Anything new to replace it?
                    //  Yup!
                    if (dropZones[0])
                    {
                        input.target = dropZones[0];

                        this.events.dispatch(new InputEvent.DRAG_ENTER(pointer, gameObject, input.target));
                    }
                    else
                    {
                        //  Nope
                        input.target = null;
                    }
                }
            }
            else if (!input.target && dropZones[0])
            {
                input.target = dropZones[0];

                this.events.dispatch(new InputEvent.DRAG_ENTER(pointer, gameObject, input.target));
            }

            var dragEvent = new InputEvent.DRAG(pointer, gameObject);

            this.events.dispatch(dragEvent);

            //  Maybe it would be better to send the event to the callback? So you can get all the other stuff from it?
            input.onDrag(gameObject, pointer, dragEvent.dragX, dragEvent.dragY);
        }
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

            var dropped = false;

            if (input.target)
            {
                this.events.dispatch(new InputEvent.DROP(pointer, gameObject, input.target));

                input.target = null;

                dropped = true;
            }

            //  And finally the dragend event

            this.events.dispatch(new InputEvent.DRAG_END(pointer, gameObject, dropped));

            if (gameObject.input)
            {
                input.onDragEnd(gameObject, pointer, input.dragX, input.dragY);
            }
        }

        pointer.dragState = 0;
    }
};

module.exports = ProcessDragEvents;
