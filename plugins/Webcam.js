/**
* Provides access to the Webcam (if available)
*/
Phaser.Plugin.Webcam = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    if (!game.device.getUserMedia)
    {
        return false;
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    this.context = null;
    this.stream = null;

    this.video = document.createElement('video');
    this.video.autoplay = true;

};

Phaser.Plugin.Webcam.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Webcam.prototype.constructor = Phaser.Plugin.Webcam;

Phaser.Plugin.Webcam.prototype.start = function (width, height, context) {

    console.log('Webcam start', width, height);

    this.context = context;

    if (!this.stream)
    {
        navigator.getUserMedia( { video: { mandatory: { minWidth: width, minHeight: height } } }, this.connectCallback.bind(this), this.errorCallback.bind(this));
    }

};

Phaser.Plugin.Webcam.prototype.stop = function () {

    if (this.stream)
    {
        this.stream.stop();
        this.stream = null;
    }

};

Phaser.Plugin.Webcam.prototype.connectCallback = function (stream) {

    this.stream = stream;

    this.video.src = window.URL.createObjectURL(this.stream);

};

Phaser.Plugin.Webcam.prototype.errorCallback = function (e) {

    console.log('Video Stream rejected', e);

};

Phaser.Plugin.Webcam.prototype.grab = function (context, x, y) {

    if (this.stream)
    {
        context.drawImage(this.video, x, y);
    }

};

Phaser.Plugin.Webcam.prototype.update = function () {

    if (this.stream)
    {
        this.context.drawImage(this.video, 0, 0);
    }

};

/**
* @name Phaser.Plugin.Webcam#active
* @property {boolean} active - Is this Webcam plugin capturing a video stream or not?
* @readonly
*/
Object.defineProperty(Phaser.Plugin.Webcam.prototype, "active", {

    get: function() {
        return (this.stream);
    }

});
