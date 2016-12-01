// var FILE_CONST = require('../const');
var File = require('../File');

//  Different images based on device-pixel ratio
//  And maybe on screen resolution breakpoints

//  2 options - can either return the File object, so they can listen to it specifically
//  Or can return the Loader, so they can chain calls?

var ImageFile = function (key, url, path)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        console.warn('Loader: You tried to load an Image, but no key was given');

        return false;
    }

    if (!url)
    {
        url = path + key + '.png';
    }
    else
    {
        url = path.concat(url);
    }

    var file = new File('image', key, url, 'arraybuffer');

    return file;
};

module.exports = ImageFile;
