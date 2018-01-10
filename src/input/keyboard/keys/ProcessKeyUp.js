
var ProcessKeyUp = function (key, event)
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

    key.isDown = false;
    key.isUp = true;
    key.timeUp = event.timeStamp;
    key.duration = key.timeUp - key.timeDown;
    key.repeats = 0;

    key._justDown = false;
    key._justUp = true;

    return key;
};

module.exports = ProcessKeyUp;
