import Signal from 'system/Signal.js';

export const onUp = new Signal();

//  list = anything that can be iterated, like a Set, Map, Array or custom object with
//  a Symbol.iterator

export default function ProcessKeyUp (event, list = null, prevent = false) {

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

            key.isDown = false;
            key.isUp = true;
            key.timeUp = event.timeStamp;
            key.duration = key.timeUp - key.timeDown;
            key._justDown = false;
            key._justUp = true;

            console.log('up', key.name);
        }
    }

    if (prevent)
    {
        event.preventDefault();
    }

    if (onUp.hasListeners)
    {
        onUp.dispatch(event);
    }

}
