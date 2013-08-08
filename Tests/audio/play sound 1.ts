/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/sound/SoundManager.ts" />
/// <reference path="../../Phaser/sound/Sound.ts" />

//var PhaserGlobal = { fakeiOSTouchLock: true, disableWebAudio: true };

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);

    function preload() {

        //game.load.audio('wizball', ['assets/mp3/oedipus_wizball_highscore.ogg', 'assets/mp3/oedipus_wizball_highscore.mp3']);
        game.load.audio('boden', ['assets/mp3/bodenstaendig_2000_in_rock_4bit.mp3']);
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
        

    }

    button: Phaser.UI.Button;
    music: Phaser.Sound;
    volumeUp: Phaser.UI.Button;
    volumeDown: Phaser.UI.Button;
    pause: Phaser.UI.Button;

    function create() {

        this.music = game.add.audio('boden');

        this.button = game.add.button(game.stage.centerX, 400, 'button', playMusic, this, 2, 1, 0);
        //this.volumeUp = game.add.button(0, 0, 'button', volUp, this, 2, 1, 0);
        //this.volumeDown = game.add.button(700, 0, 'button', volDown, this, 2, 1, 0);
        //this.pause = game.add.button(200, 200, 'button', togglePause, this, 2, 1, 0);

    }

    function render() {
        Phaser.DebugUtils.renderSoundInfo(this.music, 0, 300);
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

    function volUp() {
        //game.sound.volume += 0.1;
        this.music.volume += 0.1;
        console.log('vol up', game.sound.volume);
    }

    function volDown() {
        //game.sound.volume -= 0.1;
        this.music.volume -= 0.1;
        console.log('vol down', game.sound.volume);
    }

    function playMusic() {
        this.music.play();
    }

})();
