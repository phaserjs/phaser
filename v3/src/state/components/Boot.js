/**
* The Boot handler is called by Phaser.Game when it first starts up.
* The renderer is available by now.
*
* @method Phaser.GlobalStateManager#boot
* @private
*/
var Boot = function ()
{
    var i;
    var entry;

    for (i = 0; i < this._pending.length; i++)
    {
        entry = this._pending[i];

        this.add(entry.key, entry.state, entry.autoStart);
    }

    for (i = 0; i < this._start.length; i++)
    {
        entry = this._start[i];

        this.start(entry);
    }

    //  Clear the pending lists
    this._start = [];
    this._pending = [];
};

module.exports = Boot;
