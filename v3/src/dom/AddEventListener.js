function AddEventListener (target, event, listener, useCapture)
{
    if (useCapture === undefined) { useCapture = false; }

    target.addEventListener(event, listener, useCapture);
}

module.exports = AddEventListener;
