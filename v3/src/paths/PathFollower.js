var Class = require('../utils/Class');
var Vector2 = require('../math/Vector2');

var PathFollower = new Class({

    initialize:

    function PathFollower (path, gameObject, t)
    {
        if (t === undefined) { t = 0; }

        this.path = path;

        this.gameObject = gameObject;

        this.t = t;

        //  

        // this.useFrames = false;
    },

    update: function (time, delta)
    {

    }

});

module.exports = PathFollower;
