
var Class = require('../../utils/Class');
var TweenBuilder = require('../builder/TweenBuilder');

var TweenManager = new Class({

    initialize:

    function TweenManager (scene)
    {
        //  The Scene the Tween Manager belongs to (tweens are Scene specific, not Game global)
        this.scene = scene;

        this.timeScale = 1;

        this._add = [];
        this._pending = [];
        this._active = [];
        this._destroy = [];

        this._toProcess = 0;
    },

    //  Scene is starting up
    boot: function ()
    {
        this.timeScale = 1;
    },

    //  Create a Tween and return it, but do NOT add it to the active or pending Tween lists
    create: function (config)
    {
        return TweenBuilder(this, config);
    },

    //  Create a Tween and add it to the active Tween list
    add: function (config)
    {
        var tween = TweenBuilder(this, config);

        this._add.push(tween);

        this._toProcess++;

        return tween;
    },

    //  Add an existing tween into the active Tween list
    existing: function (tween)
    {
        this._add.push(tween);

        this._toProcess++;

        return this;
    },

    begin: function ()
    {
        if (this._toProcess === 0)
        {
            //  Quick bail
            return;
        }

        var list = this._destroy;
        var active = this._active;
        var i;
        var tween;

        //  Clear the 'destroy' list
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  Remove from the 'active' array
            var idx = active.indexOf(tween);

            if (idx !== -1)
            {
                active.splice(idx, 1);
            }
        }

        list.length = 0;

        //  Process the addition list
        //  This stops callbacks and out of sync events from populating the active array mid-way during the update

        list = this._add;

        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  Return true if the Tween should be started right away, otherwise false
            if (tween.init())
            {
                tween.play();

                this._active.push(tween);
            }
            else
            {
                this._pending.push(tween);
            }
        }

        list.length = 0;

        this._toProcess = 0;
    },

    update: function (timestamp, delta)
    {
        //  Process active tweens
        var list = this._active;
        var tween;

        //  Scale the delta
        delta *= this.timeScale;

        for (var i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  If Tween.update returns 'true' then it means it has completed,
            //  so move it to the destroy list
            if (tween.update(timestamp, delta))
            {
                this._destroy.push(tween);
                this._toProcess++;
            }
        }
    },

    makeActive: function (tween)
    {
        var idx = this._pending.indexOf(tween);

        if (idx !== -1)
        {
            this._pending.splice(idx, 1);
        }

        this._add.push(tween);

        this._toProcess++;
    },

    setGlobalTimeScale: require('./components/SetGlobalTimeScale'),
    getGlobalTimeScale: require('./components/GetGlobalTimeScale'),
    getAllTweens: require('./components/GetAllTweens'),
    getTweensOf: require('./components/GetTweensOf'),
    isTweening: require('./components/IsTweening'),
    killAll: require('./components/KillAll'),
    killTweensOf: require('./components/KillTweensOf'),
    pauseAll: require('./components/PauseAll'),
    resumeAll: require('./components/ResumeAll'),
    each: require('./components/Each'),
    shutdown: require('./components/Shutdown'),
    destroy: require('./components/Destroy')

    // TODO: kill: function (vars, target)
});

module.exports = TweenManager;
