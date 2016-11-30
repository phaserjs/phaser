// var File = require('../File');

var onLoad = function ()
{

};

var ImageFile = function (loader, key, url)
{
    if (!key)
    {
        console.warn('Loader: You tried to load an Image, but no key was given');
        return;
    }

    if (!url)
    {
        url = key + '.png';
    }

    var file = {
        type: 'image',
        key: key,
        url: url,
        onload: onLoad
    };

    loader.add(file);

};

module.exports = ImageFile;
