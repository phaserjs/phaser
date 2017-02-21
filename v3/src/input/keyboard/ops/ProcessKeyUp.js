
var ProcessKeyUp = function (key, event)
{
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
    key.repeats = 0;
    key.duration = key.timeUp - key.timeDown;
    key._justDown = false;
    key._justUp = true;

    return key;
};

module.exports = ProcessKeyUp;
