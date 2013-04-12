class SoundManager {

    constructor(game:Game) {

        this._game = game;

		if (!!window['AudioContext'])
		{
			this._context = new window['AudioContext']();
		}
		else if (!!window['webkitAudioContext'])
		{
			this._context = new window['webkitAudioContext']();
		}

		if (this._context !== null)
		{
		    this._gainNode = this._context.createGainNode();
		    this._gainNode.connect(this._context.destination);
		    this._volume = 1;
		}

    }

    private _game: Game;

    private _context = null;
    private _gainNode;
    private _volume: number;

    public mute() {

        this._gainNode.gain.value = 0;

    }

    public unmute() {

        this._gainNode.gain.value = this._volume;

    }

    public set volume(value: number) {

        this._volume = value;
        this._gainNode.gain.value = this._volume;

    }

    public get volume(): number {
        return this._volume;
    }

    public decode(key: string, callback = null, sound?: Sound = null) {

        var soundData = this._game.cache.getSound(key);

        if (soundData)
        {
            if (this._game.cache.isSoundDecoded(key) === false)
            {
                var that = this;

                this._context.decodeAudioData(soundData, function (buffer) {
                    that._game.cache.decodedSound(key, buffer);

                    if (sound)
                    {
                        sound.setDecodedBuffer(buffer);
                    }

                    callback();
                });
            }
        }

    }

    public play(key:string, volume?: number = 1, loop?: bool = false): Sound {

        if (this._context === null)
        {
            return;
        }

        var soundData = this._game.cache.getSound(key);

        if (soundData)
        {
            //  Does the sound need decoding?
            if (this._game.cache.isSoundDecoded(key) === true)
            {
                return new Sound(this._context, this._gainNode, soundData, volume, loop);
            }
            else
            {
                var tempSound: Sound = new Sound(this._context, this._gainNode, null, volume, loop);

                //  this is an async process, so we can return the Sound object anyway, it just won't be playing yet
                this.decode(key, () => this.play(key), tempSound);

                return tempSound;
            }
        }

    }

}

class Sound {

    constructor(context, gainNode, data, volume?: number = 1, loop?: bool = false) {

        this._context = context;
        this._gainNode = gainNode;
        this._buffer = data;
        this._volume = volume;
        this.loop = loop;

        //  Local volume control
        if (this._context !== null)
        {
            this._localGainNode = this._context.createGainNode();
		    this._localGainNode.connect(this._gainNode);
            this._localGainNode.gain.value = this._volume;
        }

        if (this._buffer === null)
        {
            this.isDecoding = true;
        }
        else
        {
            this.play();
        }

    }

    private _context;
    private _gainNode;
    private _localGainNode;
    private _buffer;
	private _volume: number;
    private _sound;

	loop: bool = false;
	duration: number;
	isPlaying: bool = false;
	isDecoding: bool = false;

	public setDecodedBuffer(data) {

	    this._buffer = data;
	    this.isDecoding = false;
	    this.play();

	}

	public play() {

	    if (this._buffer === null || this.isDecoding === true)
	    {
	        return;
	    }

	    this._sound = this._context.createBufferSource();
	    this._sound.buffer = this._buffer;
		this._sound.connect(this._localGainNode);

		if (this.loop)
		{
    		this._sound.loop = true;
		}

        this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it

		this.duration = this._sound.buffer.duration;
		this.isPlaying = true;

	}

	public stop () {

		if (this.isPlaying === true)
		{
			this.isPlaying = false;

			this._sound.noteOff(0);
		}

	}

    public mute() {

        this._localGainNode.gain.value = 0;

    }

    public unmute() {

        this._localGainNode.gain.value = this._volume;

    }

    public set volume(value: number) {

        this._volume = value;
        this._localGainNode.gain.value = this._volume;

    }

    public get volume(): number {
        return this._volume;
    }

}