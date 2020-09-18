/**
 * @typedef {object} Phaser.Types.Loader.XHRSettingsObject
 * @since 3.0.0
 *
 * @property {XMLHttpRequestResponseType} responseType - The response type of the XHR request, i.e. `blob`, `text`, etc.
 * @property {boolean} [async=true] - Should the XHR request use async or not?
 * @property {string} [user=''] - Optional username for the XHR request.
 * @property {string} [password=''] - Optional password for the XHR request.
 * @property {integer} [timeout=0] - Optional XHR timeout value.
 * @property {(object|undefined)} [headers] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [header] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [headerValue] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [requestedWith] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [overrideMimeType] - Provide a custom mime-type to use instead of the default.
 * @property {boolean} [withCredentials=false] - The withCredentials property indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.
 */
