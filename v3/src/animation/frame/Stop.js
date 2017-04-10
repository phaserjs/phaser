var Stop = function (dispatchCallbacks)
{
    if (dispatchCallbacks === undefined) { dispatchCallbacks = false; }

    this.isPlaying = false;

    var anim = this.currentAnim;

    if (dispatchCallbacks && anim.onComplete)
    {
        anim.onComplete.apply(anim.callbackScope, this._callbackArgs.concat(anim.onCompleteParams));
    }

    return this;
};

module.exports = Stop;
