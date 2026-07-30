/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var OS = require('./OS');
var Browser = require('./Browser');
var CanvasPool = require('../display/canvas/CanvasPool');

/**
 * Determines the features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.features` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Features
 * @since 3.0.0
 *
 * @property {boolean} canvas - Indicates whether the HTML5 Canvas API (CanvasRenderingContext2D) is available in this browser. Required for the Canvas renderer to function.
 * @property {?boolean} canvasBitBltShift - True if canvas supports a 'copy' bitblt onto itself when the source and destination regions overlap. This is used for fast pixel copy operations. Will be `null` if it could not be determined, `false` on iOS and Safari where it is known not to work.
 * @property {boolean} file - Indicates whether the File, FileReader, FileList, and Blob APIs are all available, enabling file reading operations within the browser.
 * @property {boolean} fileSystem - Indicates whether the FileSystem API (requestFileSystem) is available, allowing sandboxed local file storage access.
 * @property {boolean} getUserMedia - Indicates whether the getUserMedia API is available and functional. Used for accessing camera and microphone input. Note: older versions of Firefox (below 21) may report support but not actually work correctly.
 * @property {boolean} littleEndian - Indicates whether the device uses little-endian byte ordering. Only detected if the browser supports TypedArrays. Will be `null` if endianness could not be determined.
 * @property {boolean} localStorage - Indicates whether the Web Storage localStorage API is available for persisting key-value data between browser sessions.
 * @property {boolean} pointerLock - Indicates whether the Pointer Lock API is available, which allows the mouse cursor to be hidden and locked to the game canvas for first-person style input.
 * @property {boolean} stableSort - Indicates whether the browser's Array.sort implementation is stable, meaning equal elements retain their original relative order after sorting.
 * @property {boolean} support32bit - Indicates whether the device supports 32-bit pixel manipulation of canvas image data using ArrayBuffer and typed array views (Uint8ClampedArray / Int32Array). Requires little-endian byte ordering.
 * @property {boolean} vibration - Indicates whether the Vibration API is available, enabling haptic feedback on supported mobile devices.
 * @property {boolean} webGL - Indicates whether WebGL is available in this browser. Required for the WebGL renderer to function.
 * @property {boolean} worker - Indicates whether Web Workers are available, enabling background JavaScript execution on a separate thread.
 */
var Features = {

    canvas: false,
    canvasBitBltShift: null,
    file: false,
    fileSystem: false,
    getUserMedia: true,
    littleEndian: false,
    localStorage: false,
    pointerLock: false,
    stableSort: false,
    support32bit: false,
    vibration: false,
    webGL: false,
    worker: false

};

// Check Little or Big Endian system.
// @author Matt DesLauriers (@mattdesl)
function checkIsLittleEndian ()
{
    var a = new ArrayBuffer(4);
    var b = new Uint8Array(a);
    var c = new Uint32Array(a);

    b[0] = 0xa1;
    b[1] = 0xb2;
    b[2] = 0xc3;
    b[3] = 0xd4;

    if (c[0] === 0xd4c3b2a1)
    {
        return true;
    }

    if (c[0] === 0xa1b2c3d4)
    {
        return false;
    }
    else
    {
        //  Could not determine endianness
        return null;
    }
}

function init ()
{
    if (typeof importScripts === 'function')
    {
        return Features;
    }

    Features.canvas = !!window['CanvasRenderingContext2D'];

    try
    {
        Features.localStorage = !!localStorage.getItem;
    }
    catch (error)
    {
        Features.localStorage = false;
    }

    Features.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
    Features.fileSystem = !!window['requestFileSystem'];

    var isUint8 = false;

    var testWebGL = function ()
    {
        if (window['WebGLRenderingContext'])
        {
            try
            {
                var canvas = CanvasPool.createWebGL(this);

                var ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

                var canvas2D = CanvasPool.create2D(this);

                var ctx2D = canvas2D.getContext('2d', { willReadFrequently: true });

                //  Can't be done on a webgl context
                var image = ctx2D.createImageData(1, 1);

                //  Test to see if ImageData uses CanvasPixelArray or Uint8ClampedArray.
                //  @author Matt DesLauriers (@mattdesl)
                isUint8 = image.data instanceof Uint8ClampedArray;

                CanvasPool.remove(canvas);
                CanvasPool.remove(canvas2D);

                return !!ctx;
            }
            catch (e)
            {
                return false;
            }
        }

        return false;
    };

    Features.webGL = testWebGL();

    Features.worker = !!window['Worker'];

    Features.pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    Features.getUserMedia = Features.getUserMedia && !!navigator.getUserMedia && !!window.URL;

    // Older versions of firefox (< 21) apparently claim support but user media does not actually work
    if (Browser.firefox && Browser.firefoxVersion < 21)
    {
        Features.getUserMedia = false;
    }

    // Excludes iOS versions as they generally wrap UIWebView (eg. Safari WebKit) and it
    // is safer to not try and use the fast copy-over method.
    if (!OS.iOS && (Browser.ie || Browser.firefox || Browser.chrome))
    {
        Features.canvasBitBltShift = true;
    }

    // Known not to work
    if (Browser.safari || Browser.mobileSafari)
    {
        Features.canvasBitBltShift = false;
    }

    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    if (navigator.vibrate)
    {
        Features.vibration = true;
    }

    if (typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined' && typeof Uint32Array !== 'undefined')
    {
        Features.littleEndian = checkIsLittleEndian();
    }

    Features.support32bit = (
        typeof ArrayBuffer !== 'undefined' &&
        typeof Uint8ClampedArray !== 'undefined' &&
        typeof Int32Array !== 'undefined' &&
        Features.littleEndian !== null &&
        isUint8
    );

    return Features;
}

module.exports = init();
