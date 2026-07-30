/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Given a File and a baseURL value, this returns the URL the File will use to download from.
 *
 * If the file has no URL, `false` is returned. If the file URL is already absolute (i.e. it
 * begins with `blob:`, `data:`, `capacitor://`, `file://`, `http://`, `https://`, or `//`),
 * it is returned as-is. Otherwise, the baseURL is prepended to the file URL to form a
 * complete URL.
 *
 * @function Phaser.Loader.GetURL
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - The File object whose URL will be resolved.
 * @param {string} baseURL - A default base URL to prepend when the file URL is relative.
 *
 * @return {string} The resolved URL the File will use to download from, or `false` if the file has no URL.
 */
var GetURL = function (file, baseURL)
{
    if (!file.url)
    {
        return false;
    }

    if (file.url.match(/^(?:blob:|data:|capacitor:\/\/|file:\/\/|http:\/\/|https:\/\/|\/\/)/))
    {
        return file.url;
    }
    else
    {
        return baseURL + file.url;
    }
};

module.exports = GetURL;
