/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#boot
 * @since 3.0.0
 */
var Boot = function ()
{
    var i;
    var entry;

    for (i = 0; i < this._pending.length; i++)
    {
        entry = this._pending[i];

        this.add(entry.key, entry.scene, entry.autoStart);
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
