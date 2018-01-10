//  Creates an XHRSettings Object with default values

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
