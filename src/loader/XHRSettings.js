/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Creates an XHRSettings Object with default values.
 *
 * @function Phaser.Loader.XHRSettings
 * @since 3.0.0
 *
 * @param {string} [responseType] - The responseType, such as 'text'.
 * @param {boolean} [async=true] - Should the XHR request use async or not?
 * @param {string} [user] - Optional username for the XHR request.
 * @param {string} [password] - Optional password for the XHR request.
 * @param {integer} [timeout=0] - Optional XHR timeout value.
 *
 * @return {Phaser.Loader.XHRSettings} The XHRSettings object as used by the Loader.
 */
var XHRSettings = function (responseType, async, user, password, timeout)
{
    if (responseType === undefined) { responseType = ''; }
    if (async === undefined) { async = true; }
    if (user === undefined) { user = ''; }
    if (password === undefined) { password = ''; }
    if (timeout === undefined) { timeout = 0; }

    // Before sending a request, set the xhr.responseType to "text", 
    // "arraybuffer", "blob", or "document", depending on your data needs. 
    // Note, setting xhr.responseType = '' (or omitting) will default the response to "text".

    return {

        //  Ignored by the Loader, only used by File.
        responseType: responseType,

        async: async,

        //  credentials
        user: user,
        password: password,

        //  timeout in ms (0 = no timeout)
        timeout: timeout,

        //  setRequestHeader
        header: undefined,
        headerValue: undefined,

        //  overrideMimeType
        overrideMimeType: undefined

    };
};

module.exports = XHRSettings;
