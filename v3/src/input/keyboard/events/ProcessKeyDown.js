// import Signal from 'system/Signal.js';

// export const onDown = new Signal();

//  list = anything that can be iterated, like a Set, Map, Array or custom object with
//  a Symbol.iterator

var ProcessKeyDown = function (event, list, prevent)
{
    if (prevent === undefined) { prevent = false; }

    if (list)
    {
        for (let key of list)
        {
            if (key.keyCode !== event.keyCode || !key.enabled)
            {
                continue;
            }

            if (key.preventDefault)
            {
                prevent = true;
            }

            key.altKey = event.altKey;
            key.ctrlKey = event.ctrlKey;
            key.shiftKey = event.shiftKey;

            if (key.isDown)
            {
                key.repeats++;
            }
            else
            {
                key.isDown = true;
                key.isUp = false;
                key.timeDown = event.timeStamp;
                key.duration = 0;
                key.repeats = 0;
                key._justDown = true;
                key._justUp = false;
            }

            console.log('down', key.name);
        }
    }

    if (prevent)
    {
        event.preventDefault();
    }

    // if (onDown.hasListeners)
    // {
    //     onDown.dispatch(event);
    // }

};

module.exports = ProcessKeyDown;
