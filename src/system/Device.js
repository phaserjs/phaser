/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
*
* @class Phaser.Device
* @constructor
*/
Phaser.Device = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    * @protected
    * @deprecated 2.2.0 - The device settings are no longer dependent upon a game.
    */
    this.game = game;

    //  Operating System

    /**
    * @property {boolean} desktop - Is running desktop?
    * @default
    */
    this.desktop = false;

    /**
    * @property {boolean} iOS - Is running on iOS?
    * @default
    */
    this.iOS = false;

    /**
    * @property {boolean} cocoonJS - Is the game running under CocoonJS?
    * @default
    */
    this.cocoonJS = false;
    
    /**
    * @property {boolean} cocoonJSApp - Is this game running with CocoonJS.App?
    * @default
    */
    this.cocoonJSApp = false;
    
    /**
    * @property {boolean} cordova - Is the game running under Apache Cordova?
    * @default
    */
    this.cordova = false;
    
    /**
    * @property {boolean} node - Is the game running under Node.js?
    * @default
    */
    this.node = false;
    
    /**
    * @property {boolean} nodeWebkit - Is the game running under Node-Webkit?
    * @default
    */
    this.nodeWebkit = false;
    
    /**
    * @property {boolean} ejecta - Is the game running under Ejecta?
    * @default
    */
    this.ejecta = false;

    /**
    * @property {boolean} crosswalk - Is the game running under the Intel Crosswalk XDK?
    * @default
    */
    this.crosswalk = false;

    /**
    * @property {boolean} android - Is running on android?
    * @default
    */
    this.android = false;

    /**
    * @property {boolean} chromeOS - Is running on chromeOS?
    * @default
    */
    this.chromeOS = false;

    /**
    * @property {boolean} linux - Is running on linux?
    * @default
    */
    this.linux = false;

    /**
    * @property {boolean} macOS - Is running on macOS?
    * @default
    */
    this.macOS = false;

    /**
    * @property {boolean} windows - Is running on windows?
    * @default
    */
    this.windows = false;

    /**
    * @property {boolean} windowsPhone - Is running on a Windows Phone?
    * @default
    */
    this.windowsPhone = false;

    //  Features

    /**
    * @property {boolean} canvas - Is canvas available?
    * @default
    */
    this.canvas = false;

    /**
    * @property {boolean} file - Is file available?
    * @default
    */
    this.file = false;

    /**
    * @property {boolean} fileSystem - Is fileSystem available?
    * @default
    */
    this.fileSystem = false;

    /**
    * @property {boolean} localStorage - Is localStorage available?
    * @default
    */
    this.localStorage = false;

    /**
    * @property {boolean} webGL - Is webGL available?
    * @default
    */
    this.webGL = false;

    /**
    * @property {boolean} worker - Is worker available?
    * @default
    */
    this.worker = false;

    /**
    * @property {boolean} css3D - Is css3D available?
    * @default
    */
    this.css3D = false;

    /**
    * @property {boolean} pointerLock - Is Pointer Lock available?
    * @default
    */
    this.pointerLock = false;

    /**
    * @property {boolean} typedArray - Does the browser support TypedArrays?
    * @default
    */
    this.typedArray = false;

    /**
    * @property {boolean} vibration - Does the device support the Vibration API?
    * @default
    */
    this.vibration = false;

    /**
    * @property {boolean} getUserMedia - Does the device support the getUserMedia API?
    * @default
    */
    this.getUserMedia = false;

    /**
    * @property {boolean} quirksMode - Is the browser running in strict mode (false) or quirks mode? (true)
    * @default
    */
    this.quirksMode = false;

    //  Input

    /**
    * @property {boolean} touch - Is touch available?
    * @default
    */
    this.touch = false;

    /**
    * @property {boolean} mspointer - Is mspointer available?
    * @default
    */
    this.mspointer = false;

    /**
    * @property {string|null} wheelEvent - The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
    * @default
    * @protected
    */
    this.wheelEvent = null;

    //  Browser

    /**
    * @property {boolean} arora - True if running in Arora.
    * @default
    */
    this.arora = false;

    /**
    * @property {boolean} chrome - True if running in Chrome.
    * @default
    */
    this.chrome = false;

    /**
    * @property {boolean} epiphany - True if running in Epiphany.
    * @default
    */
    this.epiphany = false;

    /**
    * @property {boolean} firefox - True if running in Firefox.
    * @default
    */
    this.firefox = false;

    /**
    * @property {boolean} ie - True if running in Internet Explorer.
    * @default
    */
    this.ie = false;

    /**
    * @property {number} ieVersion - If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Device.trident and Device.tridentVersion.
    * @default
    */
    this.ieVersion = 0;

    /**
    * @property {boolean} trident - True if running a Trident version of Internet Explorer (IE11+)
    * @default
    */
    this.trident = false;

    /**
    * @property {number} tridentVersion - If running in Internet Explorer 11 this will contain the major version number. See http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx
    * @default
    */
    this.tridentVersion = 0;

    /**
    * @property {boolean} mobileSafari - True if running in Mobile Safari.
    * @default
    */
    this.mobileSafari = false;

    /**
    * @property {boolean} midori - True if running in Midori.
    * @default
    */
    this.midori = false;

    /**
    * @property {boolean} opera - True if running in Opera.
    * @default
    */
    this.opera = false;

    /**
    * @property {boolean} safari - True if running in Safari.
    * @default
    */
    this.safari = false;

    /**
    * @property {boolean} webApp - True if running as a WebApp, i.e. within a WebView in iOS.
    * @default
    */
    this.webApp = false;

    /**
    * @property {boolean} silk - True if running in the Silk browser (as used on the Amazon Kindle)
    * @default
    */
    this.silk = false;

    //  Audio

    /**
    * @property {boolean} audioData - Are Audio tags available?
    * @default
    */
    this.audioData = false;

    /**
    * @property {boolean} webAudio - Is the WebAudio API available?
    * @default
    */
    this.webAudio = false;

    /**
    * @property {boolean} ogg - Can this device play ogg files?
    * @default
    */
    this.ogg = false;

    /**
    * @property {boolean} opus - Can this device play opus files?
    * @default
    */
    this.opus = false;

    /**
    * @property {boolean} mp3 - Can this device play mp3 files?
    * @default
    */
    this.mp3 = false;

    /**
    * @property {boolean} wav - Can this device play wav files?
    * @default
    */
    this.wav = false;

    /**
    * Can this device play m4a files?
    * @property {boolean} m4a - True if this device can play m4a files.
    * @default
    */
    this.m4a = false;

    /**
    * @property {boolean} webm - Can this device play webm files?
    * @default
    */
    this.webm = false;

    //  Device

    /**
    * @property {boolean} iPhone - Is running on iPhone?
    * @default
    */
    this.iPhone = false;

    /**
    * @property {boolean} iPhone4 - Is running on iPhone4?
    * @default
    */
    this.iPhone4 = false;

    /**
    * @property {boolean} iPad - Is running on iPad?
    * @default
    */
    this.iPad = false;

    /**
    * @property {number} pixelRatio - PixelRatio of the host device?
    * @default
    */
    this.pixelRatio = 0;

    /**
    * @property {boolean} littleEndian - Is the device big or little endian? (only detected if the browser supports TypedArrays)
    * @default
    */
    this.littleEndian = undefined;

    /**
    * @property {boolean} support32bit - Does the device context support 32bit pixel manipulation using array buffer views?
    * @default
    */
    this.support32bit = false;

    /**
    * @property {boolean} fullscreen - Does the browser support the Full Screen API?
    * @default
    */
    this.fullscreen = false;

    /**
    * @property {string} requestFullscreen - The name of the (element) function to enable Full Screen mode, if supported.
    * @default
    */
    this.requestFullscreen = '';

    /**
    * @property {string} cancelFullscreen - The name of the (document) function to disable Full Screen mode, if supported.
    * @default
    */
    this.cancelFullscreen = '';

    /**
    * @property {boolean} fullscreenKeyboard - Does the browser support access to the Keyboard during Full Screen mode?
    * @default
    */
    this.fullscreenKeyboard = false;

    //  Run the checks
    this._checkOS();
    this._checkAudio();
    this._checkBrowser();
    this._checkCSS3D();
    this._checkDevice();
    this._checkFeatures();
    this._checkInput();

};

Phaser.Device.LITTLE_ENDIAN = false;

Phaser.Device.prototype = {

    /**
    * Check which OS is game running on.
    * This is run _before_ any other checks.
    *
    * @method Phaser.Device#_checkOS
    * @private
    */
    _checkOS: function () {

        var ua = navigator.userAgent;

        if (/Playstation Vita/.test(ua))
        {
            this.vita = true;
        }
        else if (/Kindle/.test(ua) || /\bKF[A-Z][A-Z]+/.test(ua) || /Silk.*Mobile Safari/.test(ua))
        {
            this.kindle = true;
            // This will NOT detect early generations of Kindle Fire, I think there is no reliable way...
            // E.g. "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.1.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true"
        }
        else if (/Android/.test(ua))
        {
            this.android = true;
        }
        else if (/CrOS/.test(ua))
        {
            this.chromeOS = true;
        }
        else if (/iP[ao]d|iPhone/i.test(ua))
        {
            this.iOS = true;
        }
        else if (/Linux/.test(ua))
        {
            this.linux = true;
        }
        else if (/Mac OS/.test(ua))
        {
            this.macOS = true;
        }
        else if (/Windows/.test(ua))
        {
            this.windows = true;

            if (/Windows Phone/i.test(ua))
            {
                this.windowsPhone = true;
            }
        }

        // Browser checks not done yet
        var silk = /Silk/.test(ua);

        if (this.windows || this.macOS || (this.linux && !silk) || this.chromeOS)
        {
            this.desktop = true;
        }

        //  Windows Phone / Table reset
        if (this.windowsPhone || (/Windows NT/i.test(ua) && /Touch/i.test(ua)))
        {
            this.desktop = false;
        }

    },

    /**
    * Check HTML5 features of the host environment.
    *
    * @method Phaser.Device#_checkFeatures
    * @private
    */
    _checkFeatures: function () {

        this.canvas = !!window.CanvasRenderingContext2D || this.cocoonJS;

        try {
            this.localStorage = !!localStorage.getItem;
        } catch (e) {
            this.localStorage = false;
        }

        this.file = !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob;
        this.fileSystem = !!window.requestFileSystem;

        this.webGL = ( function () { try { var canvas = document.createElement( 'canvas' ); /*Force screencanvas to false*/ canvas.screencanvas = false; return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )();
        this.webGL = !!this.webGL;

        this.worker = !!window.Worker;

        this.pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        this.quirksMode = (document.compatMode === 'CSS1Compat') ? false : true;

        this.getUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    },

    /**
    * Checks/configures various input.
    *
    * @method Phaser.Device#checkInput
    * @private
    */
    _checkInput: function () {

        if ('ontouchstart' in document.documentElement ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 1))
        {
            this.touch = true;
        }

        if (navigator.msPointerEnabled || navigator.pointerEnabled)
        {
            this.mspointer = true;
        }

        if (!this.cocoonJS)
        {
            // See https://developer.mozilla.org/en-US/docs/Web/Events/wheel
            if ('onwheel' in window || (this.ie && 'WheelEvent' in window))
            {
                // DOM3 Wheel Event: FF 17+, IE 9+, Chrome 31+, Safari 7+
                this.wheelEvent = 'wheel';
            }
            else if ('onmousewheel' in window)
            {
                // Non-FF legacy: IE 6-9, Chrome 1-31, Safari 5-7.
                this.wheelEvent = 'mousewheel';
            }
            else if (this.firefox && 'MouseScrollEvent' in window)
            {
                // FF prior to 17. This should probably be scrubbed.
                this.wheelEvent = 'DOMMouseScroll';
            }
        }

    },

    /**
    * Checks for support of the Full Screen API.
    *
    * @method Phaser.Device#checkFullScreenSupport
    */
    checkFullScreenSupport: function () {

        var fs = [
            'requestFullscreen',
            'requestFullScreen',
            'webkitRequestFullscreen',
            'webkitRequestFullScreen',
            'msRequestFullscreen',
            'msRequestFullScreen',
            'mozRequestFullScreen',
            'mozRequestFullscreen'
        ];

        // Creat a new canvas to avoid reliance on game/game.canvas
        var canvas = document.createElement('canvas');

        for (var i = 0; i < fs.length; i++)
        {
            if (canvas[fs[i]])
            {
                this.fullscreen = true;
                this.requestFullscreen = fs[i];
                break;
            }
        }

        if (!this.fullscreen)
        {
            return;
        }

        var cfs = [
            'cancelFullScreen',
            'exitFullscreen',
            'webkitCancelFullScreen',
            'webkitExitFullscreen',
            'msCancelFullScreen',
            'msExitFullscreen',
            'mozCancelFullScreen',
            'mozExitFullscreen'
        ];

        for (var i = 0; i < cfs.length; i++)
        {
            if (document[cfs[i]])
            {
                this.cancelFullscreen = cfs[i];
                break;
            }
        }

        //  Keyboard Input?
        if (window.Element && window.Element.ALLOW_KEYBOARD_INPUT)
        {
            this.fullscreenKeyboard = true;
        }

    },

    /**
    * Check the host/browser environment.
    * This should only be called after checking the OS.
    *
    * @method Phaser.Device#_checkBrowser
    * @private
    */
    _checkBrowser: function () {

        // Ref. http://browscap.org/

        var ua = navigator.userAgent;

        if (/Arora/.test(ua))
        {
            this.arora = true;
        }
        else if (/Chrome/.test(ua))
        {
            this.chrome = true;
        }
        else if (/Epiphany/.test(ua))
        {
            this.epiphany = true;
        }
        else if (/Firefox/.test(ua))
        {
            this.firefox = true;
        }
        else if (/Silk/.test(ua))
        {
            this.silk = true;
        }
        else if (this.iOS && /AppleWebKit/.test(ua))
        {
            this.mobileSafari = true;
        }
        else if (/MSIE (\d+\.\d+);/.test(ua))
        {
            this.ie = true;
            this.ieVersion = parseInt(RegExp.$1, 10);
        }
        else if (/Midori/.test(ua))
        {
            this.midori = true;
        }
        else if (/Opera/.test(ua))
        {
            this.opera = true;
        }
        else if (/Safari/.test(ua))
        {
            // Safari is low because it is used generically and tagged
            // by many browsers including Chrome, Opera, Silk, etc.
            this.safari = true;
        }
        else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua))
        {
            this.ie = true;
            this.trident = true;
            this.tridentVersion = parseInt(RegExp.$1, 10);
            this.ieVersion = parseInt(RegExp.$3, 10);
        }

        // "Non-browser" host detection

        if (typeof process !== 'undefined' && typeof require !== 'undefined')
        {
            this.node = true;

            try
            {
                this.nodeWebkit = (typeof require('nw.gui') !== 'undefined');
            }
            catch (e)
            {
                this.nodeWebkit = false;
            }
        }

        if (navigator.standalone)
        {
            this.webApp = true;
        }
        
        if (typeof window.cordova !== 'undefined')
        {
            this.cordova = true;
        }
        
        if (navigator.isCocoonJS)
        {
            this.cocoonJS = true;
        
            try
            {
                this.cocoonJSApp = (typeof CocoonJS !== 'undefined');
            }
            catch (e)
            {
                this.cocoonJSApp = false;
            }
        }
        else if (typeof window.ejecta !== 'undefined')
        {
            this.ejecta = true;
        }
        else if (/Crosswalk/.test(ua))
        {
            this.crosswalk = true;
        }

    },

    /**
    * Check audio support.
    *
    * @method Phaser.Device#_checkAudio
    * @private
    */
    _checkAudio: function () {

        this.audioData = !!window.Audio;
        this.webAudio = !!window.webkitAudioContext || window.AudioContext;
        var audioElement = document.createElement('audio');

        try {
            // IE9 can throw an exception: ref. https://github.com/Modernizr/Modernizr/issues/224
            if (!audioElement.canPlayType)
            {
                return;
            }

            if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                this.ogg = true;
            }

            if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '') || audioElement.canPlayType('audio/opus;').replace(/^no$/, '')) {
                this.opus = true;
            }

            if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                this.mp3 = true;
            }

            // Mimetypes accepted:
            //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   bit.ly/iphoneoscodecs
            if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                this.wav = true;
            }

            if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
                this.m4a = true;
            }

            if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
                this.webm = true;
            }
        } catch (e) {
        }

    },

    /**
    * Check PixelRatio, iOS device model, Vibration API, ArrayBuffers and endianess.
    *
    * @method Phaser.Device#_checkDevice
    * @private
    */
    _checkDevice: function () {

        var ua = navigator.userAgent;

        this.pixelRatio = window.devicePixelRatio || 1;
        this.iPhone = /iPhone/i.test(ua);
        this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
        this.iPad = /iPad/i.test(ua);

        if (typeof Int8Array !== 'undefined')
        {
            this.typedArray = true;
        }
        else
        {
            this.typedArray = false;
        }

        if (typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined' && typeof Uint32Array !== 'undefined')
        {
            this.littleEndian = this._checkIsLittleEndian();
            Phaser.Device.LITTLE_ENDIAN = this.littleEndian;
        }

        this.support32bit = (typeof ArrayBuffer !== 'undefined' && typeof Uint8ClampedArray !== 'undefined' && typeof Int32Array !== 'undefined' && this.littleEndian !== null && this._checkIsUint8ClampedImageData());

        this.vibration = !!(navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate);

    },

    /**
    * Check Little or Big Endian system.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Device#_checkIsLittleEndian
    * @private
    */
    _checkIsLittleEndian: function () {

        var a = new ArrayBuffer(4);
        var b = new Uint8Array(a);
        var c = new Uint32Array(a);

        b[0] = 0xa1;
        b[1] = 0xb2;
        b[2] = 0xc3;
        b[3] = 0xd4;

        if (c[0] == 0xd4c3b2a1)
        {
            return true;
        }

        if (c[0] == 0xa1b2c3d4)
        {
            return false;
        }
        else
        {
            //  Could not determine endianness
            return null;
        }

    },

    /**
    * Test to see if ImageData uses CanvasPixelArray or Uint8ClampedArray.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Device#_checkIsUint8ClampedImageData
    * @private
    */
    _checkIsUint8ClampedImageData: function () {

        if (typeof Uint8ClampedArray === 'undefined')
        {
            return false;
        }

        var elem = document.createElement('canvas');
        var ctx = elem.getContext('2d');

        if (!ctx)
        {
            return false;
        }

        var image = ctx.createImageData(1, 1);

        return image.data instanceof Uint8ClampedArray;

    },

    /**
    * Check whether the host environment support 3D CSS.
    *
    * @method Phaser.Device#_checkCSS3D
    * @private
    */
    _checkCSS3D: function () {

        var el = document.createElement('p');
        var has3d;
        var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms)
        {
            if (el.style[t] !== undefined)
            {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);
        this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== 'none');

    },

    /**
    * Check whether the host environment can play a particular audio format.
    *
    * @method Phaser.Device#canPlayAudio
    * @param {string} type - Type of audio format to test, eg. 'mp3, 'ogg', 'm4a', 'wav', 'webm' or 'opus'.
    * @return {boolean} True if the given file type is supported by the browser, otherwise false.
    */
    canPlayAudio: function (type) {

        return (
            (type == 'mp3' && this.mp3) ||
            (type == 'ogg' && (this.ogg || this.opus)) ||
            (type == 'm4a' && this.m4a) ||
            (type == 'opus' && this.opus) ||
            (type == 'wav' && this.wav) ||
            (type == 'webm' && this.webm)
        );

    },

    /**
    * Check whether the console is open.
    *
    * This _only_ works in Firefox with Firebug.
    *
    * There is no current support for Chrome (see http://src.chromium.org/viewvc/blink?view=revision&revision=151136 for details)
    * or other browsers.
    *
    * @method Phaser.Device#isConsoleOpen
    * @return {boolean} True if the browser dev console is verifiably open.
    * @protected
    */
    isConsoleOpen: function () {

        return !!(window.console && window.console.firebug);

    }

};

Phaser.Device.prototype.constructor = Phaser.Device;

/**
* A class-static function to check wether we’re running on an Android Stock browser.
* Autors might want to scale down on effects and switch to the CANVAS rendering method on those devices.
* Usage: var defaultRenderingMode = Phaser.Device.isAndroidStockBrowser() ? Phaser.CANVAS : Phaser.AUTO;
* 
* @method Phaser.Device.isAndroidStockBrowser
*/
Phaser.Device.isAndroidStockBrowser = function() {

    var matches = navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && matches[1] < 537;

};
