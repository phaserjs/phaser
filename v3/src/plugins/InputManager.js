var Class = require('../utils/Class');
var SceneInputManager = require('../input/local/SceneInputManager');

var InputManager = new Class({

    Extends: SceneInputManager,

    initialize:

    function InputManager (scene, game)
    {
        SceneInputManager.call(this, scene, game);
    }

    /*
    processOverOutEvents: function (pointer, results)
    {
        var gameObject;

        //  Go through the results
        for (var i = 0; i < results.length; i++)
        {
            gameObject = results[i];

            //  Was this GO previously in an 'over' state?



        //   Loop through the tested array and work out which game objects were 'over' previously and which are 'just over' (brand new)
        for (i = 0; i < results.length; i++)
        {
            gameObject = results[i];

            if (previouslyOver.indexOf(gameObject) === -1)
            {
                justOver.push(gameObject);
            }
            else
            {
                stillOver.push(gameObject);
            }
        }

    },
    */

    /*
    hitTestPointer: function (pointer)
    {
        var i;
        var tested = [];
        var justOut = [];
        var justOver = [];
        var stillOver = [];
        var previouslyOver = this._over;
        var gameObject;

        //  Get a list of all objects that can be seen by all the cameras in the scene and store in 'tested' array.
        //  All objects in this array are input enabled, as checked by the hitTest function, so we don't need to check later on as well.
        for (i = 0; i < this.cameras.length; i++)
        {
            var camera = this.cameras[i];

            if (camera.inputEnabled)
            {
                tested = tested.concat(this.manager.hitTest(this._list, pointer.x, pointer.y, camera));
            }
        }



        //   Loop through the tested array and work out which game objects were 'over' previously and which are 'just over' (brand new)
        for (i = 0; i < tested.length; i++)
        {
            gameObject = tested[i];

            if (previouslyOver.indexOf(gameObject) === -1)
            {
                justOver.push(gameObject);
            }
            else
            {
                stillOver.push(gameObject);
            }
        }

        //  Loop through the list of 'previously over' objects (from the last update) and any missing from it are now 'just out'
        for (i = 0; i < previouslyOver.length; i++)
        {
            gameObject = previouslyOver[i];

            if (tested.indexOf(gameObject) === -1)
            {
                justOut.push(gameObject);
            }
        }

        //  Now we can process what has happened.

        //  Fire a global onOut event that contains all objects that have moved to 'out' status this update

        if (justOut.length > 0)
        {
            this.sortInteractiveObjects(justOut);

            //  Call onOut for everything in the justOut array
            for (i = 0; i < justOut.length; i++)
            {
                gameObject = justOut[i];

                this.events.dispatch(new InputEvent.OUT(pointer, gameObject, justOut));

                this.gameObjectOnOut(pointer, gameObject);

                if (this.topOnly)
                {
                    break;
                }
            }
        }

        //  Fire a global onOut event that contains all objects that have moved to 'over' status this update

        if (justOver.length > 0)
        {
            this.sortInteractiveObjects(justOver);

            //  Call onOver for everything in the justOver array
            for (i = 0; i < justOver.length; i++)
            {
                gameObject = justOver[i];

                this.events.dispatch(new InputEvent.OVER(pointer, gameObject, justOver));

                this.gameObjectOnOver(pointer, gameObject);

                if (this.topOnly)
                {
                    break;
                }
            }
        }

        //  Add the contents of justOver to the persistent 'over' array
        this._over = stillOver.concat(justOver);

        //  Then sort it into display list order
        this._over = this.sortInteractiveObjects(this._over);
    },
    */

    /*

    //  Given an array of Game Objects, sort the array and return it,
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
