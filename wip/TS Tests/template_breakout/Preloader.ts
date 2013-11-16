/// <reference path="phaser.d.ts" />
module BasicGame
{
	export class Preloader extends Phaser.State {
		background:Phaser.Sprite = null;
		preloadBar:Phaser.Sprite = null;
		ready:boolean = false;

		preload():void {
			this.background = this.add.sprite(0.0,0.0,"preloaderBackground");
			this.preloadBar = this.add.sprite(300,400,"preloaderBar");

			this.load.setPreloadSprite( this.preloadBar );

			this.load.image("titlepage","assets/title.gif");
			this.load.image("playButton","assets/play_button.png");
			this.load.audio("titleMusic",["assets/main_menu.mp3","assets/main_menu.ogg"]);

			this.load.atlas("breakout","assets/breakout.png","assets/breakout.json");
			this.load.image("starfield","assets/starfield.jpg");
		}

		create():void {
			this.preloadBar.cropEnabled = false;
		}

		update():void {
			if( this.cache.isSoundDecoded("titleMusic") && this.ready == false )
			{
				this.ready = true;
				this.game.state.start("MainMenu");
			}
		}
	}
}
