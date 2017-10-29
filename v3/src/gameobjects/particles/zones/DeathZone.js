var Class = require('../../../utils/Class');

var DeathZone = new Class({

    initialize:

    function DeathZone (source, killOnEnter)
    {
        this.source = source;

        this.killOnEnter = killOnEnter;
    },

    //  must return true if the particle will be killed, otherwise false
    willKill: function (particle)
    {
        var withinZone = this.source.contains(particle.x, particle.y);

        return (withinZone && this.killOnEnter || !withinZone && !this.killOnEnter);
    }

});

module.exports = DeathZone;
