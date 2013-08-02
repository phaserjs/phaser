/// <reference path="../Phaser/Game.ts" />

module Phaser {

    export interface IPlugin {

        game: Game;
        active: bool;
        visible: bool;

        preUpdate();
        postUpdate();

        preRender();
        postRender();

        destroy();

    }

}