/// <reference path="../_definitions.ts" />
/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/
var Phaser;
(function (Phaser) {
    var Device = (function () {
        /**
        * Device constructor
        */
        function Device() {
            /**
            * An optional 'fix' for the horrendous Android stock browser bug
            * https://code.google.com/p/android/issues/detail?id=39247
            * @type {boolean}
            */
            this.patchAndroidClearRectBug = false;
            //  Operating System
            /**
            * Is running desktop?
            * @type {boolean}
            */
            this.desktop = false;
            /**
            * Is running on iOS?
            * @type {boolean}
            */
            this.iOS = false;
            /**
            * Is running on android?
            * @type {boolean}
            */
            this.android = false;
            /**
            * Is running on chromeOS?
            * @type {boolean}
            */
            this.chromeOS = false;
            /**
            * Is running on linux?
            * @type {boolean}
            */
            this.linux = false;
            /**
            * Is running on maxOS?
            * @type {boolean}
            */
            this.macOS = false;
            /**
            * Is running on windows?
            * @type {boolean}
            */
            this.windows = false;
            //  Features
            /**
            * Is canvas available?
            * @type {boolean}
            */
            this.canvas = false;
            /**
            * Is file available?
            * @type {boolean}
            */
            this.file = false;
            /**
            * Is fileSystem available?
            * @type {boolean}
            */
            this.fileSystem = false;
            /**
            * Is localStorage available?
            * @type {boolean}
            */
            this.localStorage = false;
            /**
            * Is webGL available?
            * @type {boolean}
            */
            this.webGL = false;
            /**
            * Is worker available?
            * @type {boolean}
            */
            this.worker = false;
            /**
            * Is touch available?
            * @type {boolean}
            */
            this.touch = false;
            /**
            * Is mspointer available?
            * @type {boolean}
            */
            this.mspointer = false;
            /**
            * Is css3D available?
            * @type {boolean}
            */
            this.css3D = false;
            //  Browser
            /**
            * Is running in arora?
            * @type {boolean}
            */
            this.arora = false;
            /**
            * Is running in chrome?
            * @type {boolean}
            */
            this.chrome = false;
            /**
            * Is running in epiphany?
            * @type {boolean}
            */
            this.epiphany = false;
            /**
            * Is running in firefox?
            * @type {boolean}
            */
            this.firefox = false;
            /**
            * Is running in ie?
            * @type {boolean}
            */
            this.ie = false;
            /**
            * Version of ie?
            * @type Number
            */
            this.ieVersion = 0;
            /**
            * Is running in mobileSafari?
            * @type {boolean}
            */
            this.mobileSafari = false;
            /**
            * Is running in midori?
            * @type {boolean}
            */
            this.midori = false;
            /**
            * Is running in opera?
            * @type {boolean}
            */
            this.opera = false;
            /**
            * Is running in safari?
            * @type {boolean}
            */
            this.safari = false;
            this.webApp = false;
            //  Audio
            /**
            * Are Audio tags available?
            * @type {boolean}
            */
            this.audioData = false;
            /**
            * Is the WebAudio API available?
            * @type {boolean}
            */
            this.webAudio = false;
            /**
            * Can this device play ogg files?
            * @type {boolean}
            */
            this.ogg = false;
            /**
            * Can this device play opus files?
            * @type {boolean}
            */
            this.opus = false;
            /**
            * Can this device play mp3 files?
            * @type {boolean}
            */
            this.mp3 = false;
            /**
            * Can this device play wav files?
            * @type {boolean}
            */
            this.wav = false;
            /**
            * Can this device play m4a files?
            * @type {boolean}
            */
            this.m4a = false;
            /**
            * Can this device play webm files?
            * @type {boolean}
            */
            this.webm = false;
            //  Device
            /**
            * Is running on iPhone?
            * @type {boolean}
            */
            this.iPhone = false;
            /**
            * Is running on iPhone4?
            * @type {boolean}
            */
            this.iPhone4 = false;
            /**
            * Is running on iPad?
            * @type {boolean}
            */
            this.iPad = false;
            /**
            * PixelRatio of the host device?
            * @type Number
            */
            this.pixelRatio = 0;
            this._checkAudio();
            this._checkBrowser();
            this._checkCSS3D();
            this._checkDevice();
            this._checkFeatures();
            this._checkOS();
        }
        /**
        * Check which OS is game running on.
        * @private
        */
        Device.prototype._checkOS = function () {
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
        };

        /**
        * Check HTML5 features of the host environment.
        * @private
        */
        Device.prototype._checkFeatures = function () {
            this.canvas = !!window['CanvasRenderingContext2D'];

            try  {
                this.localStorage = !!localStorage.getItem;
            } catch (error) {
                this.localStorage = false;
            }

            this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
            this.fileSystem = !!window['requestFileSystem'];
            this.webGL = !!window['WebGLRenderingContext'];
            this.worker = !!window['Worker'];

            if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
                this.touch = true;
            }

            if (window.navigator.msPointerEnabled) {
                this.mspointer = true;
            }
        };

        /**
        * Check what browser is game running in.
        * @private
        */
        Device.prototype._checkBrowser = function () {
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

            if (navigator['standalone']) {
                this.webApp = true;
            }
        };

        Device.prototype.canPlayAudio = function (type) {
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
        };

        /**
        * Check audio support.
        * @private
        */
        Device.prototype._checkAudio = function () {
            this.audioData = !!(window['Audio']);
            this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);

            var audioElement = document.createElement('audio');
            var result = false;

            try  {
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
        };

        /**
        * Check PixelRatio of devices.
        * @private
        */
        Device.prototype._checkDevice = function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
        };

        /**
        * Check whether the host environment support 3D CSS.
        * @private
        */
        Device.prototype._checkCSS3D = function () {
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
        };

        Device.prototype.isConsoleOpen = function () {
            if (window.console && window.console['firebug']) {
                return true;
            }

            if (window.console) {
                console.profile();
                console.profileEnd();

                if (console.clear)
                    console.clear();

                return console['profiles'].length > 0;
            }

            return false;
        };
        return Device;
    })();
    Phaser.Device = Device;
})(Phaser || (Phaser = {}));
