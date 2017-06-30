var BaseCache = require('./BaseCache');
var Class = require('../utils/Class');

//  Phaser.Cache.GlobalCache

var GlobalCache = new Class({

    initialize:

    function GlobalCache (game)
    {
        this.game = game;

        this.sound = new BaseCache();
        this.video = new BaseCache();
        this.text = new BaseCache();
        this.json = new BaseCache();
        this.xml = new BaseCache();
        this.physics = new BaseCache();
        this.tilemap = new BaseCache();
        this.binary = new BaseCache();
        this.bitmapFont = new BaseCache();
        this.shader = new BaseCache();

        this.custom = {};
    },

    //  Add your own custom Cache entry, available under Cache.custom.key
    addCustom: function (key)
    {
        if (!this.custom.hasOwnProperty(key))
        {
            this.custom[key] = new BaseCache();

            return this.custom[key];
        }
    }

});

module.exports = GlobalCache;
