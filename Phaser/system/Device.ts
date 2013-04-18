/// <reference path="../Game.ts" />

/**
 *  Device
 *
 *  @desc       Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
 *              https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
 *
 *	@version 	1.0 - March 5th 2013
 *	@author 	Richard Davey
 *	@author		mrdoob
 *	@author		Modernizr team
 */

/**
*   Phaser
*/

module Phaser {

    export class Device {

        /**
        *
        * @constructor
        * @return {Device} This Object
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

        public desktop: bool = false;

        /**
        * 
        * @property iOS 
        * @type Boolean
        */
        public iOS: bool = false;

        /**
        * 
        * @property android
        * @type Boolean
        */
        public android: bool = false;

        /**
        * 
        * @property chromeOS
        * @type Boolean
        */
        public chromeOS: bool = false;

        /**
        * 
        * @property linux
        * @type Boolean
        */
        public linux: bool = false;

        /**
        * 
        * @property maxOS
        * @type Boolean
        */
        public macOS: bool = false;

        /**
        * 
        * @property windows
        * @type Boolean
        */
        public windows: bool = false;

        //  Features

        /**
        * 
        * @property canvas
        * @type Boolean
        */
        public canvas: bool = false;

        /**
        * 
        * @property file
        * @type Boolean
        */
        public file: bool = false;

        /**
        * 
        * @property fileSystem
        * @type Boolean
        */
        public fileSystem: bool = false;

        /**
        * 
        * @property localStorage
        * @type Boolean
        */
        public localStorage: bool = false;

        /**
        * 
        * @property webGL
        * @type Boolean
        */
        public webGL: bool = false;

        /**
        * 
        * @property worker
        * @type Boolean
        */
        public worker: bool = false;

        /**
        * 
        * @property touch
        * @type Boolean
        */
        public touch: bool = false;

        /**
        * 
        * @property css3D
        * @type Boolean
        */
        public css3D: bool = false;

        //  Browser

        /**
        * 
        * @property arora
        * @type Boolean
        */
        public arora: bool = false;

        /**
        * 
        * @property chrome
        * @type Boolean
        */
        public chrome: bool = false;

        /**
        * 
        * @property epiphany
        * @type Boolean
        */
        public epiphany: bool = false;

        /**
        * 
        * @property firefox
        * @type Boolean
        */
        public firefox: bool = false;

        /**
        * 
        * @property ie
        * @type Boolean
        */
        public ie: bool = false;

        /**
        * 
        * @property ieVersion
        * @type Number
        */
        public ieVersion: number = 0;

        /**
        * 
        * @property mobileSafari
        * @type Boolean
        */
        public mobileSafari: bool = false;

        /**
        * 
        * @property midori
        * @type Boolean
        */
        public midori: bool = false;

        /**
        * 
        * @property opera
        * @type Boolean
        */
        public opera: bool = false;

        /**
        * 
        * @property safari
        * @type Boolean 
        */
        public safari: bool = false;
        public webApp: bool = false;

        //  Audio

        /**
        * 
        * @property audioData
        * @type Boolean
        */
        public audioData: bool = false;

        /**
        * 
        * @property webaudio
        * @type Boolean
        */
        public webaudio: bool = false;

        /**
        * 
        * @property ogg
        * @type Boolean
        */
        public ogg: bool = false;

        /**
        * 
        * @property mp3
        * @type Boolean
        */
        public mp3: bool = false;

        /**
        * 
        * @property wav
        * @type Boolean
        */
        public wav: bool = false;

        /**
        * 
        * @property m4a
        * @type Boolean
        */
        public m4a: bool = false;

        //  Device

        /**
        * 
        * @property iPhone
        * @type Boolean
        */
        public iPhone: bool = false;

        /**
        * 
        * @property iPhone4
        * @type Boolean
        */
        public iPhone4: bool = false;

        /**
        * 
        * @property iPad
        * @type Boolean
        */
        public iPad: bool = false;

        /**
        * 
        * @property pixelRatio
        * @type Number
        */
        public pixelRatio: number = 0;

        /**
        * 
        * @method _checkOS
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
        * 
        * @method _checkFeatures
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

        }

        /**
        * 
        * @method _checkBrowser
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
        * 
        * @method _checkAudio
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
        * 
        * @method _checkDevice
        * @private
        */
        private _checkDevice() {

            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;

        }

        /**
        * 
        * @method _checkCSS3D
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
        * 
        * @method getAll
        * @return {String}
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