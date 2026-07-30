/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates an XHRSettings Object with default values.
 *
 * The XHRSettings object is used by the Phaser Loader when making XMLHttpRequest calls
 * to fetch external assets such as images, audio, JSON, and other files. You can pass a
 * custom XHRSettings object to individual file load calls (e.g., `this.load.image`) to
 * override the default request configuration on a per-file basis, or set global defaults
 * via the Loader's `xhr` property. This is useful when loading from servers that require
 * authentication credentials, custom headers, a specific MIME type override, or a
 * non-default response type.
 *
 * @function Phaser.Loader.XHRSettings
 * @since 3.0.0
 *
 * @param {XMLHttpRequestResponseType} [responseType=''] - The responseType, such as 'text'.
 * @param {boolean} [async=true] - Should the XHR request use async or not?
 * @param {string} [user=''] - Optional username for the XHR request.
 * @param {string} [password=''] - Optional password for the XHR request.
 * @param {number} [timeout=0] - Optional XHR timeout value, in milliseconds. A value of 0 disables the timeout.
 * @param {boolean} [withCredentials=false] - Optional XHR withCredentials value.
 *
 * @return {Phaser.Types.Loader.XHRSettingsObject} The XHRSettings object as used by the Loader.
 */
var XHRSettings = function (responseType, async, user, password, timeout, withCredentials)
{
    if (responseType === undefined) { responseType = ''; }
    if (async === undefined) { async = true; }
    if (user === undefined) { user = ''; }
    if (password === undefined) { password = ''; }
    if (timeout === undefined) { timeout = 0; }
    if (withCredentials === undefined) { withCredentials = false; }

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
        headers: undefined,
        header: undefined,
        headerValue: undefined,
        requestedWith: false,

        //  overrideMimeType
        overrideMimeType: undefined,

        //  withCredentials
        withCredentials: withCredentials

    };
};

module.exports = XHRSettings;
