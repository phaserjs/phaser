var InputEvent = require('../events');

var ProcessDownEvents = function (pointer, currentlyOver)
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
};

module.exports = ProcessDownEvents;
