//  Scene that owns this manager is shutting down
var Shutdown = function ()
{
    this.killAll();

    this._add = [];
    this._pending = [];
    this._active = [];
    this._destroy = [];

    this._toProcess = 0;
};

module.exports = Shutdown;
