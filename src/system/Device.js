/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Device
*/


/**
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* {@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js}
*
* @class Phaser.Device
* @constructor
*/

Phaser.Device = function () {

    /**
    * An optional 'fix' for the horrendous Android stock browser bug
    * {@link https://code.google.com/p/android/issues/detail?id=39247}
    * @property {boolean} patchAndroidClearRectBug - Description.
    * @default
    */
    this.patchAndroidClearRectBug = false;

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

    //  Browser

    /**
    * @property {boolean} arora - Is running in arora?
    * @default
    */
    this.arora = false;

    /**
    * @property {boolean} chrome - Is running in chrome?
    * @default
    */
    this.chrome = false;

    /**
    * @property {boolean} epiphany - Is running in epiphany?
    * @default
    */
    this.epiphany = false;

    /**
    * @property {boolean} firefox - Is running in firefox?
    * @default
    */
    this.firefox = false;

    /**
    * @property {boolean} ie - Is running in ie?
    * @default
    */
    this.ie = false;

    /**
    * @property {number} ieVersion - Version of ie?
    * @default
    */
    this.ieVersion = 0;

    /**
    * @property {boolean} mobileSafari - Is running in mobileSafari?
    * @default
    */
    this.mobileSafari = false;

    /**
    * @property {boolean} midori - Is running in midori?
    * @default
    */
    this.midori = false;

    /**
    * @property {boolean} opera - Is running in opera?
    * @default
    */
    this.opera = false;

    /**
    * @property {boolean} safari - Is running in safari?
    * @default
    */
    this.safari = false;
    this.webApp = false;

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

    //  Run the checks
    this._checkAudio();
    this._checkBrowser();
    this._checkCSS3D();
    this._checkDevice();
    this._checkFeatures();
    this._checkOS();
    
};

Phaser.Device.prototype = {

    /**
    * Check which OS is game running on.
    * @method _checkOS
    * @private
    */
    _checkOS: function () {

        var ua = navigator.userAgent;

        if (/Android/.test(ua)) {
            this.android = true;
        } else if (/CrOS/.test(ua)) {
            this.chromeOS = true;
        } else if (/iP[ao]d|iPhone/i.test(ua)) {
            this.iOS = true;
        } else if (/Linux/.test(ua)) {
            this.linux = true;
        } else if (/Mac OS/.test(ua)) {
            this.macOS = true;
        } else if (/Windows/.test(ua)) {
            this.windows = true;
        }

        if (this.windows || this.macOS || this.linux) {
            this.desktop = true;
        }

    },

    /**
    * Check HTML5 features of the host environment.
    * @method _checkFeatures
    * @private
    */
    _checkFeatures: function () {

        this.canvas = !!window['CanvasRenderingContext2D'];

        try {
            this.localStorage = !!localStorage.getItem;
        } catch (error) {
            this.localStorage = false;
        }

        this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
        this.fileSystem = !!window['requestFileSystem'];
        this.webGL = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
        // this.webGL = !!window['WebGLRenderingContext'];
        this.worker = !!window['Worker'];
        
        if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
            this.touch = true;
        }

        if (window.navigator.msPointerEnabled) {
            this.mspointer = true;
        }
        
        this.pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    },

    /**
    * Check what browser is game running in.
    * @method _checkBrowser
    * @private
    */
    _checkBrowser: function () {

        var ua = navigator.userAgent;

        if (/Arora/.test(ua)) {
            this.arora = true;
        } else if (/Chrome/.test(ua)) {
            this.chrome = true;
        } else if (/Epiphany/.test(ua)) {
            this.epiphany = true;
        } else if (/Firefox/.test(ua)) {
            this.firefox = true;
        } else if (/Mobile Safari/.test(ua)) {
            this.mobileSafari = true;
        } else if (/MSIE (\d+\.\d+);/.test(ua)) {
            this.ie = true;
            this.ieVersion = parseInt(RegExp.$1);
        } else if (/Midori/.test(ua)) {
            this.midori = true;
        } else if (/Opera/.test(ua)) {
            this.opera = true;
        } else if (/Safari/.test(ua)) {
            this.safari = true;
        }

        // WebApp mode in iOS
        if (navigator['standalone']) {
            this.webApp = true;
        }

    },

    /**
    * Check audio support.
    * @method _checkAudio
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
    * Check PixelRatio of devices.
    * @method _checkDevice
    * @private
    */
    _checkDevice: function () {

        this.pixelRatio = window['devicePixelRatio'] || 1;
        this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
        this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
        this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;

    },

    /**
    * Check whether the host environment support 3D CSS.
    * @method _checkCSS3D
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

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }
        document.body.removeChild(el);
        this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");

    },

    /**
    * Check whether the host environment can play audio.
    * @method canPlayAudio
    * @param {string} type - One of 'mp3, 'ogg', 'm4a', 'wav', 'webm'.
    */
    canPlayAudio: function (type) {

        if (type == 'mp3' && this.mp3) {
            return true;
        } else if (type == 'ogg' && (this.ogg || this.opus)) {
            return true;
        } else if (type == 'm4a' && this.m4a) {
            return true;
        } else if (type == 'wav' && this.wav) {
            return true;
        } else if (type == 'webm' && this.webm) {
            return true;
        }

        return false;

    },

    /**
    * Check whether the console is open.
    * @method isConsoleOpen
    * @return {boolean} True if console is open.
    */

    isConsoleOpen: function () {

        if (window.console && window.console['firebug']) {
            return true;
        }

        if (window.console) {
            console.profile();
            console.profileEnd();

            if (console.clear) {
                console.clear();
            }

            return console['profiles'].length > 0;
        }

        return false;

    }

};
