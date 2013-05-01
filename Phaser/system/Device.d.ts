/// <reference path="../Game.d.ts" />
module Phaser {
    class Device {
        constructor();
        public desktop: bool;
        public iOS: bool;
        public android: bool;
        public chromeOS: bool;
        public linux: bool;
        public macOS: bool;
        public windows: bool;
        public canvas: bool;
        public file: bool;
        public fileSystem: bool;
        public localStorage: bool;
        public webGL: bool;
        public worker: bool;
        public touch: bool;
        public css3D: bool;
        public arora: bool;
        public chrome: bool;
        public epiphany: bool;
        public firefox: bool;
        public ie: bool;
        public ieVersion: number;
        public mobileSafari: bool;
        public midori: bool;
        public opera: bool;
        public safari: bool;
        public webApp: bool;
        public audioData: bool;
        public webaudio: bool;
        public ogg: bool;
        public mp3: bool;
        public wav: bool;
        public m4a: bool;
        public iPhone: bool;
        public iPhone4: bool;
        public iPad: bool;
        public pixelRatio: number;
        private _checkOS();
        private _checkFeatures();
        private _checkBrowser();
        private _checkAudio();
        private _checkDevice();
        private _checkCSS3D();
        public getAll(): string;
    }
}
