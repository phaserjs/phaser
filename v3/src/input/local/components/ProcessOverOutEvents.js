var InputEvent = require('../events');

var ProcessOverOutEvents = function (pointer, currentlyOver)
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
    }

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
};

module.exports = ProcessOverOutEvents;
