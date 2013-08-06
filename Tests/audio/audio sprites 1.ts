/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/sound/SoundManager.ts" />
/// <reference path="../../Phaser/sound/Sound.ts" />

//var PhaserGlobal = { disableWebAudio: true };

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        game.load.audio('rabbit', ['assets/mp3/peter_rabbit.m4a', 'assets/mp3/peter_rabbit.mp3', 'assets/mp3/peter_rabbit.ogg']);
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
        game.load.start();

    }

    audioSprite: Phaser.Sound;
    button: Phaser.UI.Button;
    pause: Phaser.UI.Button;

    function create() {

        this.audioSprite = game.add.audio('rabbit');
        this.audioSprite.addMarker('title', 3.00, 5.00, 1, true);
        this.audioSprite.addMarker('help', 6.00, 12.00);
        this.audioSprite.addMarker('intro', 14.00, 19.00);
        this.audioSprite.addMarker('peter', 20.00, 21.50);

        this.button = game.add.button(game.stage.centerX, 400, 'button', playMusic, this, 2, 1, 0);
        //this.pause = game.add.button(200, 200, 'button', togglePause, this, 2, 1, 0);

    }

    function playMusic() {
        this.audioSprite.play('help');
    }

    function render() {
        Phaser.DebugUtils.renderSoundInfo(this.audioSprite, 32, 32);
    }

    function togglePause() {

        if (this.music.paused)
        {
            this.music.resume();
        }
        else
        {
            this.music.pause();
        }

    }


})();
