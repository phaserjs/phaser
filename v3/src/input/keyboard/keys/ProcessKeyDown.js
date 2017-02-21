
var ProcessKeyDown = function (key, event)
{
    key.originalEvent = event;

    if (key.preventDefault)
    {
        event.preventDefault();
    }

    if (!key.enabled)
    {
        return;
    }

    key.altKey = event.altKey;
    key.ctrlKey = event.ctrlKey;
    key.shiftKey = event.shiftKey;
    key.location = event.location;

    key.isDown = true;
    key.isUp = false;
    key.timeDown = event.timeStamp;
    key.duration = 0;
    key.repeats++;

    key._justDown = true;
    key._justUp = false;

    return key;
};

module.exports = ProcessKeyDown;
