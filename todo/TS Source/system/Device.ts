/// <reference path="../_definitions.ts" />

/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/

module Phaser {

    export class Device {

        /**
         * Device constructor
         */
        constructor() {

            this._checkAudio();
            this._checkBrowser();
            this._checkCSS3D();
            this._checkDevice();
            this._checkFeatures();
            this._checkOS();

        }

        /**
         * An optional 'fix' for the horrendous Android stock browser bug
         * https://code.google.com/p/android/issues/detail?id=39247
         * @type {bool}
         */
        public patchAndroidClearRectBug: bool = false;

        //  Operating System

        /**
         * Is running desktop?
         * @type {bool}
         */
        public desktop: bool = false;

        /**
         * Is running on iOS?
         * @type {bool}
         */
        public iOS: bool = false;

         /**
          * Is running on android?
          * @type {bool}
          */
        public android: bool = false;

        /**
         * Is running on chromeOS?
         * @type {bool}
         */
        public chromeOS: bool = false;

        /**
         * Is running on linux?
         * @type {bool}
         */
        public linux: bool = false;

        /**
         * Is running on maxOS?
         * @type {bool}
         */
        public macOS: bool = false;

        /**
         * Is running on windows?
         * @type {bool}
         */
        public windows: bool = false;

        //  Features

        /**
         * Is canvas available?
         * @type {bool}
         */
        public canvas: bool = false;

        /**
         * Is file available?
         * @type {bool}
         */
        public file: bool = false;

        /**
         * Is fileSystem available?
         * @type {bool}
         */
        public fileSystem: bool = false;

        /**
         * Is localStorage available?
         * @type {bool}
         */
        public localStorage: bool = false;

        /**
         * Is webGL available?
         * @type {bool}
         */
        public webGL: bool = false;

        /**
         * Is worker available?
         * @type {bool}
         */
        public worker: bool = false;

        /**
         * Is touch available?
         * @type {bool}
         */
        public touch: bool = false;

        /**
         * Is mspointer available?
         * @type {bool}
         */
        public mspointer: bool = false;

        /**
         * Is css3D available?
         * @type {bool}
         */
        public css3D: bool = false;

        //  Browser

        /**
         * Is running in arora?
         * @type {bool}
         */
        public arora: bool = false;

        /**
         * Is running in chrome?
         * @type {bool}
         */
        public chrome: bool = false;

        /**
         * Is running in epiphany?
         * @type {bool}
         */
        public epiphany: bool = false;

        /**
         * Is running in firefox?
         * @type {bool}
         */
        public firefox: bool = false;

        /**
         * Is running in ie?
         * @type {bool}
         */
        public ie: bool = false;

        /**
         * Version of ie?
         * @type Number
         */
        public ieVersion: number = 0;

        /**
         * Is running in mobileSafari?
         * @type {bool}
         */
        public mobileSafari: bool = false;

        /**
         * Is running in midori?
         * @type {bool}
         */
        public midori: bool = false;

        /**
         * Is running in opera?
         * @type {bool}
         */
        public opera: bool = false;

        /**
         * Is running in safari?
         * @type {bool}
         */
        public safari: bool = false;
        public webApp: bool = false;

        //  Audio

        /**
         * Are Audio tags available?
         * @type {bool}
         */
        public audioData: bool = false;

        /**
         * Is the WebAudio API available?
         * @type {bool}
         */
        public webAudio: bool = false;

        /**
         * Can this device play ogg files?
         * @type {bool}
         */
        public ogg: bool = false;

        /**
         * Can this device play opus files?
         * @type {bool}
         */
        public opus: bool = false;

        /**
         * Can this device play mp3 files?
         * @type {bool}
         */
        public mp3: bool = false;

        /**
         * Can this device play wav files?
         * @type {bool}
         */
        public wav: bool = false;

        /**
         * Can this device play m4a files?
         * @type {bool}
         */
        public m4a: bool = false;

        /**
         * Can this device play webm files?
         * @type {bool}
         */
        public webm: bool = false;

        //  Device

        /**
         * Is running on iPhone?
         * @type {bool}
         */
        public iPhone: bool = false;

        /**
         * Is running on iPhone4?
         * @type {bool}
         */
        public iPhone4: bool = false;

        /**
         * Is running on iPad?
         * @type {bool}
         */
        public iPad: bool = false;

        /**
         * PixelRatio of the host device?
         * @type Number
         */
        public pixelRatio: number = 0;

        /**
         * Check which OS is game running on.
         * @private
         */
        private _checkOS() {

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
            }

            if (this.windows || this.macOS || this.linux)
            {
                this.desktop = true;
            }

        }

        /**
         * Check HTML5 features of the host environment.
         * @private
         */
        private _checkFeatures() {

            this.canvas = !!window['CanvasRenderingContext2D'];

            try
            {
                this.localStorage = !!localStorage.getItem;
            }
            catch (error)
            {
                this.localStorage = false;
            }

            this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
            this.fileSystem = !!window['requestFileSystem'];
            this.webGL = !!window['WebGLRenderingContext'];
            this.worker = !!window['Worker'];

            if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled)
            {
                this.touch = true;
            }

            if (window.navigator.msPointerEnabled)
            {
                this.mspointer = true;
            }

        }

        /**
         * Check what browser is game running in.
         * @private
         */
        private _checkBrowser() {

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
                this.ieVersion = parseInt(RegExp.$1);
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

            // WebApp mode in iOS
            if (navigator['standalone'])
            {
                this.webApp = true;
            }

        }

        public canPlayAudio(type: string): bool {

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

        }

        /**
         * Check audio support.
         * @private
         */
        private _checkAudio() {

            this.audioData = !!(window['Audio']);
            this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);

            var audioElement: HTMLAudioElement = <HTMLAudioElement> document.createElement('audio');
            var result = false;

            try
            {
                if (result = !!audioElement.canPlayType)
                {
                    if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''))
                    {
                        this.ogg = true;
                    }

                    if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''))
                    {
                        this.opus = true;
                    }

                    if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, ''))
                    {
                        this.mp3 = true;
                    }

                    // Mimetypes accepted:
                    //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                    //   bit.ly/iphoneoscodecs
                    if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''))
                    {
                        this.wav = true;
                    }

                    if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, ''))
                    {
                        this.m4a = true;
                    }

                    if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''))
                    {
                        this.webm = true;
                    }
                }
            } catch (e) { }

        }

        /**
         * Check PixelRatio of devices.
         * @private
         */
        private _checkDevice() {

            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;

        }

        /**
         * Check whether the host environment support 3D CSS.
         * @private
         */
        private _checkCSS3D() {

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

        }

        public isConsoleOpen(): bool {

            if (window.console && window.console['firebug'])
            {
                return true;
            }

            if (window.console)
            {
                console.profile(); 
                console.profileEnd(); 
            
                if (console.clear) console.clear();
            
                return console['profiles'].length > 0;
            }

            return false;

        }

    }

}