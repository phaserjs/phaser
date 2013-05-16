/// <reference path="../Game.ts" />

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

        //  Operating System

        /**
         * Is running desktop?
         * @type {boolean}
         */
        public desktop: bool = false;

        /**
         * Is running on iOS?
         * @type {boolean}
         */
        public iOS: bool = false;

         /**
          * Is running on android?
          * @type {boolean}
          */
        public android: bool = false;

        /**
         * Is running on chromeOS?
         * @type {boolean}
         */
        public chromeOS: bool = false;

        /**
         * Is running on linux?
         * @type {boolean}
         */
        public linux: bool = false;

        /**
         * Is running on maxOS?
         * @type {boolean}
         */
        public macOS: bool = false;

        /**
         * Is running on windows?
         * @type {boolean}
         */
        public windows: bool = false;

        //  Features

        /**
         * Is canvas available?
         * @type {boolean}
         */
        public canvas: bool = false;

        /**
         * Is file available?
         * @type {boolean}
         */
        public file: bool = false;

        /**
         * Is fileSystem available?
         * @type {boolean}
         */
        public fileSystem: bool = false;

        /**
         * Is localStorage available?
         * @type {boolean}
         */
        public localStorage: bool = false;

        /**
         * Is webGL available?
         * @type {boolean}
         */
        public webGL: bool = false;

        /**
         * Is worker available?
         * @type {boolean}
         */
        public worker: bool = false;

        /**
         * Is touch available?
         * @type {boolean}
         */
        public touch: bool = false;

        /**
         * Is mspointer available?
         * @type {boolean}
         */
        public mspointer: bool = false;

        /**
         * Is css3D available?
         * @type {boolean}
         */
        public css3D: bool = false;

        //  Browser

        /**
         * Is running in arora?
         * @type {boolean}
         */
        public arora: bool = false;

        /**
         * Is running in chrome?
         * @type {boolean}
         */
        public chrome: bool = false;

        /**
         * Is running in epiphany?
         * @type {boolean}
         */
        public epiphany: bool = false;

        /**
         * Is running in firefox?
         * @type {boolean}
         */
        public firefox: bool = false;

        /**
         * Is running in ie?
         * @type {boolean}
         */
        public ie: bool = false;

        /**
         * Version of ie?
         * @type Number
         */
        public ieVersion: number = 0;

        /**
         * Is running in mobileSafari?
         * @type {boolean}
         */
        public mobileSafari: bool = false;

        /**
         * Is running in midori?
         * @type {boolean}
         */
        public midori: bool = false;

        /**
         * Is running in opera?
         * @type {boolean}
         */
        public opera: bool = false;

        /**
         * Is running in safari?
         * @type {boolean}
         */
        public safari: bool = false;
        public webApp: bool = false;

        //  Audio

        /**
         * Is audioData available?
         * @type {boolean}
         */
        public audioData: bool = false;

        /**
         * Is webaudio available?
         * @type {boolean}
         */
        public webaudio: bool = false;

        /**
         * Is ogg available?
         * @type {boolean}
         */
        public ogg: bool = false;

        /**
         * Is mp3 available?
         * @type {boolean}
         */
        public mp3: bool = false;

        /**
         * Is wav available?
         * @type {boolean}
         */
        public wav: bool = false;

        /**
         * Is m4a available?
         * @type {boolean}
         */
        public m4a: bool = false;

        //  Device

        /**
         * Is running on iPhone?
         * @type {boolean}
         */
        public iPhone: bool = false;

        /**
         * Is running on iPhone4?
         * @type {boolean}
         */
        public iPhone4: bool = false;

        /**
         * Is running on iPad?
         * @type {boolean}
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

        /**
         * Check audio support.
         * @private
         */
        private _checkAudio() {

            this.audioData = !!(window['Audio']);
            this.webaudio = !!(window['webkitAudioContext'] || window['AudioContext']);

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

        /**
         * Get all informations of host device.
         * @return {string} Informations in a string.
         */
        public getAll(): string {

            var output: string = '';

            output = output.concat('Device\n');
            output = output.concat('iPhone : ' + this.iPhone + '\n');
            output = output.concat('iPhone4 : ' + this.iPhone4 + '\n');
            output = output.concat('iPad : ' + this.iPad + '\n');

            output = output.concat('\n');
            output = output.concat('Operating System\n');
            output = output.concat('iOS: ' + this.iOS + '\n');
            output = output.concat('Android: ' + this.android + '\n');
            output = output.concat('ChromeOS: ' + this.chromeOS + '\n');
            output = output.concat('Linux: ' + this.linux + '\n');
            output = output.concat('MacOS: ' + this.macOS + '\n');
            output = output.concat('Windows: ' + this.windows + '\n');

            output = output.concat('\n');
            output = output.concat('Browser\n');
            output = output.concat('Arora: ' + this.arora + '\n');
            output = output.concat('Chrome: ' + this.chrome + '\n');
            output = output.concat('Epiphany: ' + this.epiphany + '\n');
            output = output.concat('Firefox: ' + this.firefox + '\n');
            output = output.concat('Internet Explorer: ' + this.ie + ' (' + this.ieVersion + ')\n');
            output = output.concat('Mobile Safari: ' + this.mobileSafari + '\n');
            output = output.concat('Midori: ' + this.midori + '\n');
            output = output.concat('Opera: ' + this.opera + '\n');
            output = output.concat('Safari: ' + this.safari + '\n');

            output = output.concat('\n');
            output = output.concat('Features\n');
            output = output.concat('Canvas: ' + this.canvas + '\n');
            output = output.concat('File: ' + this.file + '\n');
            output = output.concat('FileSystem: ' + this.fileSystem + '\n');
            output = output.concat('LocalStorage: ' + this.localStorage + '\n');
            output = output.concat('WebGL: ' + this.webGL + '\n');
            output = output.concat('Worker: ' + this.worker + '\n');
            output = output.concat('Touch: ' + this.touch + '\n');
            output = output.concat('MSPointer: ' + this.mspointer + '\n');
            output = output.concat('CSS 3D: ' + this.css3D + '\n');

            output = output.concat('\n');
            output = output.concat('Audio\n');
            output = output.concat('Audio Data: ' + this.canvas + '\n');
            output = output.concat('Web Audio: ' + this.canvas + '\n');
            output = output.concat('Can play OGG: ' + this.canvas + '\n');
            output = output.concat('Can play MP3: ' + this.canvas + '\n');
            output = output.concat('Can play M4A: ' + this.canvas + '\n');
            output = output.concat('Can play WAV: ' + this.canvas + '\n');

            return output;

        }

    }

}