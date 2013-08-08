/// <reference path="../Game.ts" />
/// <reference path="SoundManager.ts" />

/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/

module Phaser {

    export class Sound {

        /**
         * Sound constructor
         * @param [volume] {number} volume of this sound when playing.
         * @param [loop] {boolean} loop this sound when playing? (Default to false)
         */
        constructor(game: Phaser.Game, key: string, volume: number = 1, loop: boolean = false) {

            this.game = game;

            this.usingWebAudio = this.game.sound.usingWebAudio;
            this.usingAudioTag = this.game.sound.usingAudioTag;
            this.key = key;

            if (this.usingWebAudio)
            {
                this.context = this.game.sound.context;
                this.masterGainNode = this.game.sound.masterGain;

                if (typeof this.context.createGain === 'undefined')
                {
                    this.gainNode = this.context.createGainNode();
                }
                else
                {
                    this.gainNode = this.context.createGain();
                }

                this.gainNode.gain.value = volume * this.game.sound.volume;
                this.gainNode.connect(this.masterGainNode);
            }
            else
            {
                if (this.game.cache.getSound(key) && this.game.cache.getSound(key).locked == false)
                {
                    this._sound = this.game.cache.getSoundData(key);
                    this.totalDuration = this._sound.duration;
                }
                else
                {
                    this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this);
                }
            }

            this._volume = volume;
            this.loop = loop;
            this.markers = {};

            this.onDecoded = new Phaser.Signal;
            this.onPlay = new Phaser.Signal;
            this.onPause = new Phaser.Signal;
            this.onResume = new Phaser.Signal;
            this.onLoop = new Phaser.Signal;
            this.onStop = new Phaser.Signal;
            this.onMute = new Phaser.Signal;
            this.onMarkerComplete = new Phaser.Signal;

        }

        private soundHasUnlocked(key:string) {

            if (key == this.key)
            {
                this._sound = this.game.cache.getSoundData(this.key);
                this.totalDuration = this._sound.duration;
                //console.log('sound has unlocked', this._sound);
            }

        }

        /**
         * Local reference to the current Phaser.Game.
         */
        public game: Game;

        /**
         * Reference to AudioContext instance.
         */
        public context = null;

        /**
         * Reference to gain node of SoundManager.
         */
        public masterGainNode;

        /**
         * GainNode of this sound.
         */
        public gainNode;

        /**
         * Decoded data buffer / Audio tag.
         */
        private _buffer = null;

        /**
         * Volume of this sound.
         */
        private _volume: number;

        /**
         * The real sound object (buffer source).
         */
        private _sound;

        private _muteVolume: number;
        private _muted: boolean = false;
        private _tempPosition: number;
        private _tempVolume: number;
        private _tempLoop: boolean;
        private _tempMarker: string;

        public usingWebAudio: boolean = false;
        public usingAudioTag: boolean = false;

        public name: string = '';

        autoplay: boolean = false;
        totalDuration: number = 0;
        startTime: number = 0;
        currentTime: number = 0;
        duration: number = 0;
        stopTime: number = 0;
        position: number;
        paused: boolean = false;
        loop: boolean = false;
        isPlaying: boolean = false;
        key: string;
        markers;
        currentMarker: string = '';

        //  events
        public onDecoded: Phaser.Signal;
        public onPlay: Phaser.Signal;
        public onPause: Phaser.Signal;
        public onResume: Phaser.Signal;
        public onLoop: Phaser.Signal;
        public onStop: Phaser.Signal;
        public onMute: Phaser.Signal;
        public onMarkerComplete: Phaser.Signal;

        public pendingPlayback: boolean = false;

        public get isDecoding(): boolean {
            return this.game.cache.getSound(this.key).isDecoding;
        }

        public get isDecoded(): boolean {
            return this.game.cache.isSoundDecoded(this.key);
        }

        public addMarker(name: string, start: number, stop: number, volume: number = 1, loop: boolean = false) {
            this.markers[name] = { name: name, start: start, stop: stop, volume: volume, duration: stop - start, loop: loop };
        }

        public removeMarker(name: string) {
            delete this.markers[name];
        }

        public update() {

            if (this.pendingPlayback && this.game.cache.isSoundReady(this.key))
            {
                this.pendingPlayback = false;
                this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
            }

            if (this.isPlaying)
            {
                this.currentTime = this.game.time.now - this.startTime;

                if (this.currentTime >= this.duration)
                {
                    //console.log(this.currentMarker, 'has hit duration');

                    if (this.usingWebAudio)
                    {
                        if (this.loop)
                        {
                            //console.log('loop1');

                            //  won't work with markers, needs to reset the position
                            this.onLoop.dispatch(this);

                            if (this.currentMarker == '')
                            {
                                //console.log('loop2');
                                this.currentTime = 0;
                                this.startTime = this.game.time.now;
                            }
                            else
                            {
                                //console.log('loop3');
                                this.play(this.currentMarker, 0, this.volume, true, true);
                            }
                        }
                        else
                        {
                            //console.log('stopping, no loop for marker');
                            this.stop();
                        }
                    }
                    else
                    {
                        if (this.loop)
                        {
                            this.onLoop.dispatch(this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        }
                        else
                        {
                            this.stop();
                        }
                    }
                }

            }

        }

        public override: boolean = false;

        /**
         * Play this sound, or a marked section of it.
         * @param marker {string} Assets key of the sound you want to play.
         * @param [volume] {number} volume of the sound you want to play.
         * @param [loop] {boolean} loop when it finished playing? (Default to false)
         * @return {Sound} The playing sound object.
         */
        public play(marker: string = '', position: number = 0, volume: number = 1, loop: boolean = false, forceRestart: boolean = false) {

            //console.log('play', marker, 'current is', this.currentMarker);

            if (this.isPlaying == true && forceRestart == false && this.override == false)
            {
                //  Use Restart instead
                return;
            }

            if (this.isPlaying && this.override)
            {
                //console.log('asked to play', marker, 'but already playing', this.currentMarker);
                if (this.usingWebAudio)
                {
                    if (typeof this._sound.stop === 'undefined')
                    {
                        this._sound.noteOff(0);
                    }
                    else
                    {
                        this._sound.stop(0);
                    }
                }
                else if (this.usingAudioTag)
                {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }

            this.currentMarker = marker;

            if (marker !== '' && this.markers[marker])
            {
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration * 1000;

                //console.log('marker info loaded', this.loop, this.duration);

                this._tempMarker = marker;
                this._tempPosition = this.position;
                this._tempVolume = this.volume;
                this._tempLoop = this.loop;
            }
            else
            {
                this.position = position;
                this.volume = volume;
                this.loop = loop;
                this.duration = 0;

                this._tempMarker = marker;
                this._tempPosition = position;
                this._tempVolume = volume;
                this._tempLoop = loop;
            }

            if (this.usingWebAudio)
            {
                //  Does the sound need decoding?
                if (this.game.cache.isSoundDecoded(this.key))
                {
                    //  Do we need to do this every time we play? How about just if the buffer is empty?
                    if (this._buffer == null)
                    {
                        this._buffer = this.game.cache.getSoundData(this.key);
                    }

                    //if (this._sound == null)
                    //{
                        this._sound = this.context.createBufferSource();
                        this._sound.buffer = this._buffer;
                        this._sound.connect(this.gainNode);
                        this.totalDuration = this._sound.buffer.duration;
                    //}

                    if (this.duration == 0)
                    {
                        this.duration = this.totalDuration * 1000;
                    }

                    if (this.loop && marker == '')
                    {
                        this._sound.loop = true;
                    }

                    //  Useful to cache this somewhere perhaps?
                    if (typeof this._sound.start === 'undefined')
                    {
                        this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                        //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                    }
                    else
                    {
                        this._sound.start(0, this.position, this.duration / 1000);
                    }

                    this.isPlaying = true;
                    this.startTime = this.game.time.now;
                    this.currentTime = 0;
                    this.stopTime = this.startTime + this.duration;
                    this.onPlay.dispatch(this);

                    //console.log('playing, start', this.startTime, 'stop');

                }
                else
                {
                    this.pendingPlayback = true;

                    if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding == false)
                    {
                        this.game.sound.decode(this.key, this);
                    }
                }
            }
            else
            {
                //console.log('Sound play Audio');

                if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked)
                {
                    //console.log('tried playing locked sound, pending set, reload started');
                    this.game.cache.reloadSound(this.key);
                    this.pendingPlayback = true;
                }
                else
                {
                    //console.log('sound not locked, state?', this._sound.readyState);
                    if (this._sound && this._sound.readyState == 4)
                    {
                        if (this.duration == 0)
                        {
                            this.duration = this.totalDuration * 1000;
                        }

                        //console.log('playing', this._sound);
                        this._sound.currentTime = this.position;
                        this._sound.muted = this._muted;

                        if (this._muted)
                        {
                            this._sound.volume = 0;
                        }
                        else
                        {
                            this._sound.volume = this._volume;
                        }

                        this._sound.play();

                        this.isPlaying = true;
                        this.startTime = this.game.time.now;
                        this.currentTime = 0;
                        this.stopTime = this.startTime + this.duration;
                        this.onPlay.dispatch(this);
                    }
                    else
                    {
                        this.pendingPlayback = true;
                    }
                }

            }

        }

        public restart(marker: string = '', position: number = 0, volume: number = 1, loop: boolean = false) {
            this.play(marker, position, volume, loop, true);
        }

        public pause() {

            if (this.isPlaying && this._sound)
            {
                this.stop();
                this.isPlaying = false;
                this.paused = true;
                this.onPause.dispatch(this);
            }

        }

        public resume() {

            if (this.paused && this._sound)
            {
                if (this.usingWebAudio)
                {
                    if (typeof this._sound.start === 'undefined')
                    {
                        this._sound.noteGrainOn(0, this.position, this.duration);
                        //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                    }
                    else
                    {
                        this._sound.start(0, this.position, this.duration);
                    }
                }
                else
                {
                    this._sound.play();
                }

                this.isPlaying = true;
                this.paused = false;
                this.onResume.dispatch(this);
            }

        }

        /**
         * Stop playing this sound.
         */
        public stop() {

            if (this.isPlaying && this._sound)
            {
                if (this.usingWebAudio)
                {
                    if (typeof this._sound.stop === 'undefined')
                    {
                        this._sound.noteOff(0);
                    }
                    else
                    {
                        this._sound.stop(0);
                    }
                }
                else if (this.usingAudioTag)
                {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }

            this.isPlaying = false;

            var prevMarker:string = this.currentMarker;

            this.currentMarker = '';

            this.onStop.dispatch(this, prevMarker);

        }

        /**
         * Mute sounds.
         */
        public get mute(): boolean {
            return this._muted;
        }

        public set mute(value: boolean) {

            if (value)
            {
                this._muted = true;

                if (this.usingWebAudio)
                {
                    this._muteVolume = this.gainNode.gain.value;
                    this.gainNode.gain.value = 0;
                }
                else if (this.usingAudioTag && this._sound)
                {
                    this._muteVolume = this._sound.volume;
                    this._sound.volume = 0;
                }
            }
            else
            {
                this._muted = false;

                if (this.usingWebAudio)
                {
                    this.gainNode.gain.value = this._muteVolume;
                }
                else if (this.usingAudioTag && this._sound)
                {
                    this._sound.volume = this._muteVolume;
                }
            }

            this.onMute.dispatch(this);

        }

        public set volume(value: number) {

            this._volume = value;

            if (this.usingWebAudio)
            {
                this.gainNode.gain.value = value;
            }
            else if (this.usingAudioTag && this._sound)
            {
                this._sound.volume = value;
            }

        }

        public get volume(): number {
            return this._volume;
        }

    }

}