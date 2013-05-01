/// <reference path="../../Game.d.ts" />
module Phaser {
    class AnimationLoader {
        static parseSpriteSheet(game: Game, key: string, frameWidth: number, frameHeight: number, frameMax: number): FrameData;
        static parseJSONData(game: Game, json): FrameData;
    }
}
