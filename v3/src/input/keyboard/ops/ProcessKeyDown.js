
var ProcessKeyDown = function (key, event)
{
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
