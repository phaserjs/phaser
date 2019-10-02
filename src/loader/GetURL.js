/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Given a File and a baseURL value this returns the URL the File will use to download from.
 *
 * @function Phaser.Loader.GetURL
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - The File object.
 * @param {string} baseURL - A default base URL.
 *
 * @return {string} The URL the File will use.
 */
var GetURL = function (file, baseURL)
{
    if (!file.url)
    {
        return false;
    }

    if (file.url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/))
    {
        return file.url;
    }
    else
    {
        return baseURL + file.url;
    }
};

module.exports = GetURL;
