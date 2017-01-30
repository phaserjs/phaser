var BaseCache = require('./BaseCache');

var Cache = function ()
{
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
};

Cache.prototype.constructor = Cache;

Cache.prototype = {

    //  Add your own custom Cache entry, available under Cache.custom.key
    addCustom: function (key)
    {
        if (!this.custom.hasOwnProperty(key))
        {
            this.custom[key] = new BaseCache();

            return this.custom[key];
        }
    }

};

module.exports = Cache;
