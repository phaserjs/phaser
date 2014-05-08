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

    //  Browser

    /**
    * @property {boolean} arora - Set to true if running in Arora.
    * @default
    */
    this.arora = false;

    /**
    * @property {boolean} chrome - Set to true if running in Chrome.
    * @default
    */
    this.chrome = false;

    /**
    * @property {boolean} epiphany - Set to true if running in Epiphany.
    * @default
    */
    this.epiphany = false;

    /**
    * @property {boolean} firefox - Set to true if running in Firefox.
    * @default
    */
    this.firefox = false;

    /**
    * @property {boolean} ie - Set to true if running in Internet Explorer.
    * @default
    */
    this.ie = false;

    /**
    * @property {number} ieVersion - If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Device.trident and Device.tridentVersion.
    * @default
    */
    this.ieVersion = 0;

    /**
    * @property {boolean} trident - Set to true if running a Trident version of Internet Explorer (IE11+)
    * @default
    */
    this.trident = false;

    /**
    * @property {number} tridentVersion - If running in Internet Explorer 11 this will contain the major version number. See http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx
    * @default
    */
    this.tridentVersion = 0;

    /**
    * @property {boolean} mobileSafari - Set to true if running in Mobile Safari.
    * @default
    */
    this.mobileSafari = false;

    /**
    * @property {boolean} midori - Set to true if running in Midori.
    * @default
    */
    this.midori = false;

    /**
    * @property {boolean} opera - Set to true if running in Opera.
    * @default
    */
    this.opera = false;

    /**
    * @property {boolean} safari - Set to true if running in Safari.
    * @default
    */
    this.safari = false;

    /**
    * @property {boolean} webApp - Set to true if running as a WebApp, i.e. within a WebView
    * @default
    */
    this.webApp = false;

    /**
    * @property {boolean} silk - Set to true if running in the Silk browser (as used on the Amazon Kindle)
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
    this.littleEndian = false;

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
    * @property {string} requestFullscreen - If the browser supports the Full Screen API this holds the call you need to use to activate it.
    * @default
    */
    this.requestFullscreen = '';

    /**
    * @property {string} cancelFullscreen - If the browser supports the Full Screen API this holds the call you need to use to cancel it.
    * @default
    */
    this.cancelFullscreen = '';

    /**
    * @property {boolean} fullscreenKeyboard - Does the browser support access to the Keyboard during Full Screen mode?
    * @default
    */
    this.fullscreenKeyboard = false;

    //  Run the checks
    this._checkAudio();
    this._checkBrowser();
    this._checkCSS3D();
    this._checkDevice();
    this._checkFeatures();
    this._checkOS();

};

Phaser.Device.LITTLE_ENDIAN = false;

Phaser.Device.prototype = {

    /**
    * Check which OS is game running on.
    * @method Phaser.Device#_checkOS
    * @private
    */
    _checkOS: function () {

        var ua = navigator.userAgent;

        if (/Android/.test(ua))
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

        if (this.windows || this.macOS || (this.linux && this.silk === false))
        {
            this.desktop = true;
        }

        //  Windows Phone / Table reset
        if (this.windowsPhone || ((/Windows NT/i.test(ua)) && (/Touch/i.test(ua))))
        {
            this.desktop = false;
        }

    },

    /**
    * Check HTML5 features of the host environment.
    * @method Phaser.Device#_checkFeatures
    * @private
    */
    _checkFeatures: function () {

        this.canvas = !!window['CanvasRenderingContext2D'] || this.cocoonJS;

        try {
            this.localStorage = !!localStorage.getItem;
        } catch (error) {
            this.localStorage = false;
        }

        this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
        this.fileSystem = !!window['requestFileSystem'];
        this.webGL = ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )();

        if (this.webGL === null || this.webGL === false)
        {
            this.webGL = false;
        }
        else
        {
            this.webGL = true;
        }

        this.worker = !!window['Worker'];

        if ('ontouchstart' in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 1))
        {
            this.touch = true;
        }

        if (window.navigator.msPointerEnabled || window.navigator.pointerEnabled)
        {
            this.mspointer = true;
        }

        this.pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        this.quirksMode = (document.compatMode === 'CSS1Compat') ? false : true;

        this.getUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

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

        for (var i = 0; i < fs.length; i++)
        {
            if (this.game.canvas[fs[i]])
            {
                this.fullscreen = true;
                this.requestFullscreen = fs[i];
            }
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

        if (this.fullscreen)
        {
            for (var i = 0; i < cfs.length; i++)
            {
                if (this.game.canvas[cfs[i]])
                {
                    this.cancelFullscreen = cfs[i];
                }
            }
        }

        //  Keyboard Input?
        if (window['Element'] && Element['ALLOW_KEYBOARD_INPUT'])
        {
            this.fullscreenKeyboard = true;
        }

    },

    /**
    * Check what browser is game running in.
    * @method Phaser.Device#_checkBrowser
    * @private
    */
    _checkBrowser: function () {

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
        else if (/Mobile Safari/.test(ua))
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
            this.safari = true;
        }
        else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua))
        {
            this.ie = true;
            this.trident = true;
            this.tridentVersion = parseInt(RegExp.$1, 10);
            this.ieVersion = parseInt(RegExp.$3, 10);
        }

        //Silk gets its own if clause because its ua also contains 'Safari'
        if (/Silk/.test(ua))
        {
            this.silk = true;
        }

        // WebApp mode in iOS
        if (navigator['standalone'])
        {
            this.webApp = true;
        }

        if (navigator['isCocoonJS'])
        {
            this.cocoonJS = true;
        }

        if (typeof window.ejecta !== "undefined")
        {
            this.ejecta = true;
        }

        if (/Crosswalk/.test(ua))
        {
            this.crosswalk = true;
        }

    },

    /**
    * Check audio support.
    * @method Phaser.Device#_checkAudio
    * @private
    */
    _checkAudio: function () {

        this.audioData = !!(window['Audio']);
        this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);
        var audioElement = document.createElement('audio');
        var result = false;

        try {
            if (result = !!audioElement.canPlayType) {

                if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                    this.ogg = true;
                }

                if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '')) {
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
            }
        } catch (e) {
        }

    },

    /**
    * Check PixelRatio, iOS device, Vibration API, ArrayBuffers and endianess.
    * @method Phaser.Device#_checkDevice
    * @private
    */
    _checkDevice: function () {

        this.pixelRatio = window['devicePixelRatio'] || 1;
        this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
        this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
        this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;

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

        this.support32bit = (typeof ArrayBuffer !== "undefined" && typeof Uint8ClampedArray !== "undefined" && typeof Int32Array !== "undefined" && this.littleEndian !== null && this._checkIsUint8ClampedImageData());

        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        if (navigator.vibrate)
        {
            this.vibration = true;
        }

    },

    /**
    * Check Little or Big Endian system.
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
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Device#_checkIsUint8ClampedImageData
    * @private
    */
    _checkIsUint8ClampedImageData: function () {

        if (typeof Uint8ClampedArray === "undefined")
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
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);
        this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");

    },

    /**
    * Check whether the host environment can play audio.
    * @method Phaser.Device#canPlayAudio
    * @param {string} type - One of 'mp3, 'ogg', 'm4a', 'wav', 'webm'.
    * @return {boolean} True if the given file type is supported by the browser, otherwise false.
    */
    canPlayAudio: function (type) {

        if (type == 'mp3' && this.mp3)
        {
            return true;
        }
        else if (type == 'ogg' && (this.ogg || this.opus))
        {
            return true;
        }
        else if (type == 'm4a' && this.m4a)
        {
            return true;
        }
        else if (type == 'wav' && this.wav)
        {
            return true;
        }
        else if (type == 'webm' && this.webm)
        {
            return true;
        }

        return false;

    },

    /**
    * Check whether the console is open.
    * Note that this only works in Firefox with Firebug and earlier versions of Chrome.
    * It used to work in Chrome, but then they removed the ability: http://src.chromium.org/viewvc/blink?view=revision&revision=151136
    * 
    * @method Phaser.Device#isConsoleOpen
    * @return {boolean} True if the browser dev console is open.
    */
    isConsoleOpen: function () {

        if (window.console && window.console['firebug'])
        {
            return true;
        }

        if (window.console)
        {
            console.profile();
            console.profileEnd();

            if (console.clear)
            {
                console.clear();
            }

            if (console['profiles'])
            {
                return console['profiles'].length > 0;
            }
        }

        return false;

    }

};

Phaser.Device.prototype.constructor = Phaser.Device;
