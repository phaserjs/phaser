/// <reference path="phaser.d.ts" />

module BasicGame
{
	export class MainMenu extends Phaser.State{
		music:Phaser.Sound;
		playButton:Phaser.Button;

		create():void {
			
			this.music = this.add.audio("titleMusic");
			this.music.play();

			this.add.sprite(0,0,"titlepage");

			this.playButton = this.add.button(200,300,"playButton", this.startGame, this);
		}

		startGame():void {
			this.music.stop();
			this.game.state.start("GameState");
		}
	}
}