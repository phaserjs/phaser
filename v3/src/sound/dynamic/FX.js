
var Between = require('../../math/Between');
var GetValue = require('../../utils/object/GetValue');

//  Phaser.Sound.Dynamic.FX

//  Based on Sound.js by KittyKatAttack
//  https://github.com/kittykatattack/sound.js

// frequency,      //The sound's fequency pitch in Hertz
// attack,              //The time, in seconds, to fade the sound in
// decay,               //The time, in seconds, to fade the sound out
// type,                //waveform type: "sine", "triangle", "square", "sawtooth"
// volume,         //The sound's maximum volume
// panValue,            //The speaker pan. left: -1, middle: 0, right: 1
// wait,                //The time, in seconds, to wait before playing the sound
// pitchBend,     //The number of Hz in which to bend the sound's pitch down
// reverse,             //If `reverse` is true the pitch will bend up
// random,         //A range, in Hz, within which to randomize the pitch
// dissonance,          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
// echo,                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
// reverb,              //An array: [durationInSeconds, decayRateInSeconds, reverse]
// timeout              //A number, in seconds, which is the maximum duration for sound effects

var FX = function (ctx, config)
{
    this.audioContext = ctx;

    this.frequencyValue = GetValue(config, 'frequency', 200);
    this.attack = GetValue(config, 'attack', 0);
    this.decay = GetValue(config, 'decay', 1);
    this.type = GetValue(config, 'type', 'sine');
    this.volumeValue = GetValue(config, 'volume', 1);
    this.panValue = GetValue(config, 'pan', 0);
    this.wait = GetValue(config, 'wait', 0);
    this.pitchBendAmount = GetValue(config, 'pitchBend', 0);
    this.reverse = GetValue(config, 'reverse', false);
    this.randomValue = GetValue(config, 'random', 0);
    this.dissonance = GetValue(config, 'dissonance', 0);
    this.echo = GetValue(config, 'echo', false);
    this.echoDelay = GetValue(config, 'echo.delay', 0);
    this.echoFeedback = GetValue(config, 'echo.feedback', 0);
    this.echoFilter = GetValue(config, 'echo.filter', 0);
    this.reverb = GetValue(config, 'reverb', false);
    this.reverbDuration = GetValue(config, 'reverb.duration', 0);
    this.reverbDecay = GetValue(config, 'reverb.decay', 0);
    this.reverbReverse = GetValue(config, 'reverb.reverse', false);
    this.timeout = GetValue(config, 'timeout', false);

    this.volume = ctx.createGain();
    this.pan = (!ctx.createStereoPanner) ? ctx.createPanner() : ctx.createStereoPanner();

    this.volume.connect(this.pan);
    this.pan.connect(ctx.destination);

    //  Set the values

    this.volume.gain.value = this.volumeValue;

    if (!ctx.createStereoPanner)
    {
        this.pan.setPosition(this.panValue, 0, 1 - Math.abs(this.panValue));
    }
    else
    {
        this.pan.pan.value = this.panValue;
    }

    //  Create an oscillator, gain and pan nodes, and connect them together to the destination

    var oscillator = ctx.createOscillator();

    oscillator.connect(this.volume);
    oscillator.type = this.type;

    //  Optionally randomize the pitch if `randomValue` > 0.
    //  A random pitch is selected that's within the range specified by `frequencyValue`.
    //  The random pitch will be either above or below the target frequency.

    if (this.randomValue > 0)
    {
        oscillator.frequency.value = Between(
            this.frequencyValue - this.randomValue / 2,
            this.frequencyValue + this.randomValue / 2
        );
    }
    else
    {
        oscillator.frequency.value = this.frequencyValue;
    }

    //  Apply effects

    if (this.attack > 0)
    {
        this.fadeIn(this.volume);
    }

    this.fadeOut(this.volume);

    if (this.pitchBendAmount > 0)
    {
        this.pitchBend(oscillator);
    }

    if (this.echo)
    {
        this.addEcho(this.volume);
    }

    if (this.reverb)
    {
        this.addReverb(this.volume);
    }

    if (this.dissonance > 0)
    {
        this.addDissonance();
    }

    this.play(oscillator);

    var _this = this;

    oscillator.onended = function ()
    {
        console.log('onended');
        _this.pan.disconnect();
        _this.volume.disconnect();
    };
};

FX.prototype.constructor = FX;

FX.prototype = {

    play: function (oscillator)
    {
        oscillator.start(this.audioContext.currentTime + this.wait);

        //Oscillators have to be stopped otherwise they accumulate in 
        //memory and tax the CPU. They'll be stopped after a default
        //timeout of 2 seconds, which should be enough for most sound 
        //effects. Override this in the `soundEffect` parameters if you
        //need a longer sound

        oscillator.stop(this.audioContext.currentTime + this.wait + 2);
    },

    fadeIn: function (volume)
    {
        volume.gain.value = 0;

        volume.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + this.wait);

        volume.gain.linearRampToValueAtTime(this.volumeValue, this.audioContext.currentTime + this.wait + this.attack);
    },

    fadeOut: function (volume)
    {
        volume.gain.linearRampToValueAtTime(this.volumeValue, this.audioContext.currentTime + this.wait + this.attack);

        volume.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + this.wait + this.attack + this.decay);
    },

    addReverb: function (volume)
    {
        var convolver = this.audioContext.createConvolver();

        convolver.buffer = this.impulseResponse(this.reverbDuration, this.reverbDecay, this.reverbReverse, this.audioContext);

        volume.connect(convolver);

        convolver.connect(this.pan);
    },

    addEcho: function (volume)
    {
        var feedback = this.audioContext.createGain();
        var delay = this.audioContext.createDelay();
        var filter = this.audioContext.createBiquadFilter();

        //  Set the node values

        feedback.gain.value = this.echoFeedback;
        delay.delayTime.value = this.echoDelay;

        if (this.echoFilter)
        {
            filter.frequency.value = this.echoFilter;
        }

        //  Create the delay feedback loop (with optional filtering)

        delay.connect(feedback);

        if (this.echoFilter)
        {
            feedback.connect(filter);
            filter.connect(delay);
        }
        else
        {
            feedback.connect(delay);
        }

        //  Connect the delay node to the oscillator volume node

        volume.connect(delay);

        //  Connect the delay node to the main sound chains pan node,
        //  so that the echo effect is directed to the correct speaker

        delay.connect(this.pan);
    },

    pitchBend: function (oscillator)
    {
        var frequency = oscillator.frequency.value;

        if (!this.reverse)
        {
            //  If reverse is false, make the sound drop in pitch
            oscillator.frequency.linearRampToValueAtTime(frequency, this.audioContext.currentTime + this.wait);
            oscillator.frequency.linearRampToValueAtTime(frequency - this.pitchBendAmount, this.audioContext.currentTime + this.wait + this.attack + this.decay);
        }
        else
        {
            //  If reverse is true, make the sound rise in pitch
            oscillator.frequency.linearRampToValueAtTime(frequency, this.audioContext.currentTime + this.wait);
            oscillator.frequency.linearRampToValueAtTime(frequency + this.pitchBendAmount, this.audioContext.currentTime + this.wait + this.attack + this.decay);
        }

    },

    addDissonance: function ()
    {
        //  Create two more oscillators and gain nodes

        var ctx = this.audioContext;

        var d1 = ctx.createOscillator();
        var d2 = ctx.createOscillator();
        var d1Volume = ctx.createGain();
        var d2Volume = ctx.createGain();

        //  Set the volume to the `volumeValue`
        d1Volume.gain.value = this.volumeValue;
        d2Volume.gain.value = this.volumeValue;

        //  Connect the oscillators to the gain and destination nodes
        d1.connect(d1Volume);
        d2.connect(d2Volume);

        d1Volume.connect(ctx.destination);
        d2Volume.connect(ctx.destination);

        //  Set the waveform to "sawtooth" for a harsh effect
        d1.type = 'sawtooth';
        d2.type = 'sawtooth';

        //  Make the two oscillators play at frequencies above and below the main sound's frequency.
        //  Use whatever value was supplied by the `dissonance` argument
        d1.frequency.value = this.frequencyValue + this.dissonance;
        d2.frequency.value = this.frequencyValue - this.dissonance;

        //  Fade in / out, pitch bend and play the oscillators to match the main sound
        if (this.attack > 0)
        {
            this.fadeIn(d1Volume);
            this.fadeIn(d2Volume);
        }

        if (this.decay > 0)
        {
            this.fadeOut(d1Volume);
            this.fadeOut(d2Volume);
        }

        if (this.pitchBendAmount > 0)
        {
            this.pitchBend(d1);
            this.pitchBend(d2);
        }

        if (this.echo)
        {
            this.addEcho(d1Volume);
            this.addEcho(d2Volume);
        }

        if (this.reverb)
        {
            this.addReverb(d1Volume);
            this.addReverb(d2Volume);
        }

        this.play(d1);
        this.play(d2);
    },

    impulseResponse: function (duration, decay, reverse)
    {
        //  The length of the buffer.
        var length = this.audioContext.sampleRate * duration;

        //  Create an audio buffer (an empty sound container) to store the reverb effect.
        var impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);

        //  Use `getChannelData` to initialize empty arrays to store sound data for the left and right channels.
        var left = impulse.getChannelData(0);
        var right = impulse.getChannelData(1);

        //  Loop through each sample-frame and fill the channel data with random noise.
        for (var i = 0; i < length; i++)
        {
            //  Apply the reverse effect, if `reverse` is `true`.
            var n = (reverse) ? length - i : i;

            //  Fill the left and right channels with random white noise which decays exponentially.
            left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }

        //  Return the `impulse`.
        return impulse;
    }

};

module.exports = FX;
