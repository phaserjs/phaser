var Class = require('../utils/Class');
var InputEvent = require('../input/local/events');
var SceneInputManager = require('../input/local/SceneInputManager');

var InputManager = new Class({

    Extends: SceneInputManager,

    initialize:

    function InputManager (scene, game)
    {
        SceneInputManager.call(this, scene, game);
    },

    processUpEvents: function (pointer, currentlyOver)
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
    },

    processDownEvents: function (pointer, currentlyOver)
    {
        if (currentlyOver.length === 0)
        {
            //  Dispatch DOWN event, even though nothing was below the pointer
            this.events.dispatch(new InputEvent.DOWN(pointer));
        }
        else
        {
            //  Go through all objects the pointer was over and set them to down
            for (var i = 0; i < currentlyOver.length; i++)
            {
                var interactiveObject = currentlyOver[i];

                this.events.dispatch(new InputEvent.DOWN(pointer, interactiveObject.gameObject, currentlyOver));

                this.childOnDown(pointer, interactiveObject);

                if (this.topOnly)
                {
                    break;
                }
            }
        }
    },

    childOnUp: function (index, pointer, interactiveObject)
    {
        interactiveObject.isDown = false;

        //  If we are not processing topOnly items, or we are and this IS the topmost item, then hit it
        if (!this.topOnly || (this.topOnly && index === 0))
        {
            interactiveObject.onUp(interactiveObject.gameObject, pointer);
        }
    },

    childOnDown: function (pointer, interactiveObject)
    {
        interactiveObject.isDown = true;

        interactiveObject.onDown(interactiveObject.gameObject, pointer, interactiveObject.localX, interactiveObject.localY);

        this.children.down[pointer.id].push(interactiveObject);

        // if (input.draggable && !input.isDragged)
        // {
        //     this.gameObjectOnDragStart(pointer, gameObject);
        // }
    },

    /*
    processOverOutEvents: function (pointer, currentlyOver)
    {
        var justOut = [];
        var justOver = [];
        var stillOver = [];
        var previouslyOver = this.children.over[pointer.id];

        var i;
        var interactiveObject;

        //  Go through all objects the pointer was previously over, and see if it still is
        for (i = 0; i < previouslyOver.length; i++)
        {
            interactiveObject = previouslyOver[i];

            if (currentlyOver.indexOf(interactiveObject) === -1)
            {
                //  Not in the currentlyOver array
                justOut.push(interactiveObject);
            }
            else
            {
                //  In the currentlyOver array
                stillOver.push(interactiveObject);
            }
        };

        //  Go through the hit test results
        for (i = 0; i < currentlyOver.length; i++)
        {
            interactiveObject = currentlyOver[i];

            //  Is this newly over?

            if (previouslyOver.indexOf(interactiveObject) === -1)
            {
                justOver.push(interactiveObject);
            }
        }

        //  By this point the arrays are filled, so now we can process what happened...

        //  Process the Just Out objects
        var total = justOut.length;

        if (total > 0)
        {
            this.sortInteractiveObjects(justOut);

            //  Call onOut for everything in the justOut array
            for (i = 0; i < total; i++)
            {
                interactiveObject = justOut[i];

                if (!this.topOnly || (this.topOnly && i === 0))
                {
                    this.events.dispatch(new InputEvent.OUT(pointer, interactiveObject.gameObject, justOut));
                }

                this.childOnOut(i, pointer, interactiveObject);
            }
        }

        //  Process the Just Over objects
        total = justOver.length;

        if (total > 0)
        {
            this.sortInteractiveObjects(justOver);

            //  Call onOver for everything in the justOver array
            for (i = 0; i < total; i++)
            {
                interactiveObject = justOver[i];

                if (!this.topOnly || (this.topOnly && i === 0))
                {
                    this.events.dispatch(new InputEvent.OVER(pointer, interactiveObject.gameObject, justOver));
                }

                this.childOnOver(i, pointer, interactiveObject);
            }
        }

        //  Add the contents of justOver to the previously over array
        previouslyOver = stillOver.concat(justOver);

        //  Then sort it into display list order
        this.children.over[pointer.id] = this.sortInteractiveObjects(previouslyOver);
    },

    childOnOut: function (index, pointer, interactiveObject)
    {
        interactiveObject.isOver = false;

        //  If we are not processing topOnly items, or we are and this IS the topmost item, then hit it
        if (!this.topOnly || (this.topOnly && index === 0))
        {
            //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
            if (!interactiveObject.isDragged)
            {
                interactiveObject.onOut(interactiveObject.gameObject, pointer);
            }
        }
    },

    childOnOver: function (index, pointer, interactiveObject)
    {
        interactiveObject.isOver = true;

        //  If we are not processing topOnly items, or we are and this IS the topmost item, then hit it
        if (!this.topOnly || (this.topOnly && index === 0))
        {
            //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
            if (!interactiveObject.isDragged)
            {
                interactiveObject.onOver(interactiveObject.gameObject, pointer, interactiveObject.localX, interactiveObject.localY);
            }
        }
    },

    //  Given an array of Interactive Objects, sort the array and return it,
    //  so that the objects are in index order with the lowest at the bottom.
    sortInteractiveObjects: function (interactiveObjects)
    {
        this.scene.sys.depthSort();

        return interactiveObjects.sort(this.sortIndexHandler.bind(this));
    },

    //  Note that the given array is sorted in place, even though it isn't returned directly it will still be updated.
    getTopInteractiveObject: function (interactiveObjects)
    {
        this.sortInteractiveObjects(interactiveObjects);

        return interactiveObjects[0];
    },

    //  Return the child lowest down the display list (with the smallest index)
    sortIndexHandler: function (childA, childB)
    {
        //  The higher the index, the lower down the display list they are.
        //  So entry 0 will be the top-most item (visually)
        var indexA = this.displayList.getIndex(childA.gameObject);
        var indexB = this.displayList.getIndex(childB.gameObject);

        if (indexA < indexB)
        {
            return 1;
        }
        else if (indexA > indexB)
        {
            return -1;
        }

        //  Technically this shouldn't happen, but if the GO wasn't part of this display list then it'll
        //  have an index of -1, so in some cases it can
        return 0;
    },
    */




    /*
    //  Has it been pressed down or released in this update?
    processUpDownEvents: function (pointer)
    {
        //  _over is now in display list order, top to bottom, already sorted previously

        var i;
        var gameObject;
        var len = this._over.length;

        if (pointer.justDown)
        {
            if (len === 0)
            {
                //  Dispatch global DOWN event, even though nothing was clicked on
                this.events.dispatch(new InputEvent.DOWN(pointer));
            }
            else
            {
                for (i = 0; i < len; i++)
                {
                    gameObject = this._over[i];

                    this.events.dispatch(new InputEvent.DOWN(pointer, gameObject, this._over));

                    this.gameObjectOnDown(pointer, gameObject);

                    if (this.topOnly)
                    {
                        break;
                    }
                }

            }

        }
        else if (pointer.justUp)
        {
            if (len === 0)
            {
                //  Dispatch global UP event, even though nothing was under the pointer when released
                this.events.dispatch(new InputEvent.UP(pointer));
            }
            else
            {
                for (i = 0; i < len; i++)
                {
                    gameObject = this._over[i];

                    this.events.dispatch(new InputEvent.UP(pointer, gameObject, this._over));

                    this.gameObjectOnUp(pointer, gameObject);

                    if (this.topOnly)
                    {
                        break;
                    }
                }
            }
        }
    },

    //  Has the pointer moved in this update?
    processMovementEvents: function (pointer)
    {
        //  Check the list of Draggable Items
        for (var i = 0; i < this._draggable.length; i++)
        {
            var gameObject = this._draggable[i];
            var input = gameObject.input;

            if (!input.enabled)
            {
                continue;
            }

            if (pointer.justUp && input.isDragged)
            {
                //  Drag End
                this.gameObjectOnDragEnd(pointer, gameObject);
            }
            else if (input.isDragged)
            {
                //  Drag
                this.gameObjectOnDrag(pointer, gameObject);
            }
        }
    },

    gameObjectOnDragStart: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isDragged = true;

        input.dragX = input.localX - gameObject.displayOriginX;
        input.dragY = input.localY - gameObject.displayOriginY;

        this.events.dispatch(new InputEvent.DRAG_START(pointer, gameObject));

        gameObject.input.onDragStart(gameObject, pointer);
    },

    gameObjectOnDrag: function (pointer, gameObject)
    {
        this.events.dispatch(new InputEvent.DRAG(pointer, gameObject));

        gameObject.input.onDrag(gameObject, pointer);
    },

    gameObjectOnDragEnd: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isDragged = false;

        this.events.dispatch(new InputEvent.DRAG_END(pointer, gameObject));

        gameObject.input.onDragEnd(gameObject, pointer);
    },

    gameObjectOnDown: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isDown = true;

        input.onDown(gameObject, pointer, input.localX, input.localY);

        if (input.draggable && !input.isDragged)
        {
            //  Drag Start
            this.gameObjectOnDragStart(pointer, gameObject);
        }
    },

    gameObjectOnUp: function (pointer, gameObject)
    {
        gameObject.input.isDown = false;

        gameObject.input.onUp(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);
    },

    gameObjectOnOut: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isOver = false;

        //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
        if (!input.isDragged)
        {
            input.onOut(gameObject, pointer);
        }
    },

    gameObjectOnOver: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isOver = true;

        //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
        if (!input.isDragged)
        {
            input.onOver(gameObject, pointer, input.localX, input.localY);
        }
    },

    */

});

module.exports = InputManager;
