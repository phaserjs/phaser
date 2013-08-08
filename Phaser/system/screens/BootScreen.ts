/// <reference path="../../Game.ts" />

/**
* Phaser - BootScreen
*
* The BootScreen is displayed when Phaser is started without any default functions or State
*/

module Phaser {

    export class BootScreen {

        /**
         * BootScreen constructor
         * Create a new <code>BootScreen</code> with specific width and height.
         *
         * @param width {number} Screen canvas width.
         * @param height {number} Screen canvas height.
         */
        constructor(game:Game) {

            this.game = game;

            this._logo = new Image();
            this._logo.src = this._logoData;

        }

        /**
         * Local reference to Game.
         */
        public game: Game;
        /**
         * Engine logo.
         */
        private _logo;
        /**
         * Engine logo image data.
         */
        private _logoData: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAZCAYAAADdYmvFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAstJREFUeNrsWlFuwjAMbavdZGcAcRm4AXzvCPuGG8BlEJxhZ+l4TJ48z3actGGthqUI1MaO/V6cmIT2/fW10eTt46NvKshtvDZlG31yfOL9a/ldU6x4IZ0GQs0gS217enMkJYr5ixXkYrFoVqtV1kDn8/n+KfXw/Hq9Nin7h8MhScB2u3Xtav2ivsNWrh7XLcWMYqA4eUZ1kj0MAifHJEeKFojWzyIH+rL/0Cwif2AX9nN1oQOgrTg8XcTFx+ScdEOJ4WBxXQ1EjRyrn0cOzzQLzFyQSQcgw/5Qkkr0JVEQpNIdhL4vm4DL5fLulNTHcy6Uxl4/6iMLiePx2KzX6/v30+n0aynUlrnSeNq2/VN9bgM4dFPdNPmsJnIg/PuQbJmLdFN3UNu0SzbyJ0GOWJVWZE/QMkY+owrqXxGEdZA37BVyX6lJTipT6J1lf7fbqc+xh8nYeIvikatP+PGW0nEJ4jOydHYOIcfKnmgWoZDQSIIeio4Sf1IthYWskCO4vqQ6lFYjl8tl9L1H67PZbMz3VO3t93uVXHofmUjReLyMwHi5eCb3ICwJj5ZU9nCg+SzUgPYyif+2epTk4pkkyDp+eXTlZu2BkUybEkklePZfK9lPuTnc07vbmt1bYulHBeNQgx18SsH4ni/cV2rSLtqNDNUH2JQ2SsXS57Y9PHlfumkwCdICt5rnkNdPjpMiIEWgRlAJSdF4SvCQMWj+VyfI0h8D/EgWSYKiJKXi8VrOhJUxaFiFCOKKUJAtR78k9eX4USLHXqLGXOIiWUT4Vj9JiP4W0io3VDz8AJXblNWQrOimLjIGy/9uLICH6mrVmFbxEFHauzmc0fGJJmPg/v+6D0oB7N2bj0FsNHtSWTQniWTR931QlHXvasDTHXLjqY0/1/8hSDxACD+lAGH8dKQbQk5N3TFtzDmLWutvV0+pL5FVoHvCNG35FGAAayS4KUoKC9QAAAAASUVORK5CYII=";
        /**
         * Background gradient effect color 1.
         */
        private _color1 = { r: 20, g: 20, b: 20 };
        /**
         * Background gradient effect color 2.
         */
        private _color2 = { r: 200, g: 200, b: 200 };
        /**
         * Fade effect tween.
         * @type {Phaser.Tween}
         */
        private _fade: Phaser.Tween = null;

        /**
         * Update color and fade.
         */
        public update() {

            if (this._fade == null)
            {
                this.colorCycle();
            }

            this._color1.r = Math.round(this._color1.r);
            this._color1.g = Math.round(this._color1.g);
            this._color1.b = Math.round(this._color1.b);
            this._color2.r = Math.round(this._color2.r);
            this._color2.g = Math.round(this._color2.g);
            this._color2.b = Math.round(this._color2.b);

        }

        /**
         * Render BootScreen.
         */
        public render() {

            var grd = this.game.stage.context.createLinearGradient(0, 0, 0, this.game.stage.height);
            grd.addColorStop(0, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            grd.addColorStop(0.5, 'rgb(' + this._color2.r + ', ' + this._color2.g + ', ' + this._color2.b + ')');
            grd.addColorStop(1, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            this.game.stage.context.fillStyle = grd;
            this.game.stage.context.fillRect(0, 0, this.game.stage.width, this.game.stage.height);

            this.game.stage.context.shadowOffsetX = 0;
            this.game.stage.context.shadowOffsetY = 0;

            if (this._logo)
            {
                this.game.stage.context.drawImage(this._logo, 32, 32);
            }

            this.game.stage.context.shadowColor = 'rgb(0,0,0)';
            this.game.stage.context.shadowOffsetX = 1;
            this.game.stage.context.shadowOffsetY = 1;
            this.game.stage.context.shadowBlur = 0;
            this.game.stage.context.fillStyle = 'rgb(255,255,255)';
            this.game.stage.context.font = 'bold 18px Arial';
            this.game.stage.context.textBaseline = 'top';
            this.game.stage.context.fillText(Phaser.VERSION, 32, 64+32);
            this.game.stage.context.fillText('Game Size: ' + this.game.stage.width + ' x ' + this.game.stage.height, 32, 64+64);
            this.game.stage.context.fillText('www.photonstorm.com', 32, 64+96);
            this.game.stage.context.font = '16px Arial';
            this.game.stage.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 64+160);
            this.game.stage.context.fillText('functions in the Game constructor or use Game.switchState()', 32, 64+184);

        }

        /**
         * Start color fading cycle.
         */
        private colorCycle() {

            this._fade = this.game.add.tween(this._color2);

            this._fade.to({ r: Math.random() * 250, g: Math.random() * 250, b: Math.random() * 250 }, 3000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.colorCycle, this);
            this._fade.start();

        }


    }

}