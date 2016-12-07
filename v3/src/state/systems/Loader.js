var BaseLoader = require('../../loader/BaseLoader');
var ImageLoader = require('../../loader/filetypes/ImageFile');

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

module.exports = Loader;
