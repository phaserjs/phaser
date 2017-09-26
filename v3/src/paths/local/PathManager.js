var Class = require('../../utils/Class');

var PathManager = new Class({

    initialize:

    function PathManager (scene)
    {
        this.scene = scene;

        this.paths = [];
    },

    update: function (time, delta)
    {
        
    }

    //  var zigzag = this.add.path(config);
    //  zigzag.release(alien, t);


});

module.exports = PathManager;
