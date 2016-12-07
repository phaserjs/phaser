var BaseLoader = require('../../loader/BaseLoader');
var ImageLoader = require('../../loader/filetypes/ImageFile');
var AtlasJSONFile = require('../../loader/filetypes/AtlasJSONFile');

var Loader = function (state)
{
    BaseLoader.call(this);

    /**
    * @property {Phaser.State} state - The State that owns this Factory
    * @protected
    */
    this.state = state;
};

Loader.prototype = Object.create(BaseLoader.prototype);
Loader.prototype.constructor = Loader;

Loader.prototype.image = function (key, url)
{
    var file = new ImageLoader(key, url, this.path);

    this.addFile(file);

    return this;
};

Loader.prototype.atlas = function (key, textureURL, atlasURL)
{
    var file = new AtlasJSONFile(key, textureURL, atlasURL, this.path);

    this.addFile(file);

    return this;
};

Loader.prototype.processCallback = function ()
{
    //  All of the files have loaded. Now to put them into the Cache.

    if (this.storage.size > 0)
    {
        var textures = this.state.sys.textures;

        this.storage.each(function (file)
        {
            if (file.type === 'image')
            {
                textures.addImage(file.key, file.data);
            }
        });
    }

};

module.exports = Loader;
