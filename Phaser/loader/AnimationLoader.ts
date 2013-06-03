/// <reference path="../Game.ts" />

/**
* Phaser - AnimationLoader
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*/

module Phaser {

    export class AnimationLoader {

        /**
         * Parse a sprite sheet from asset data.
         * @param key {string} Asset key for the sprite sheet data.
         * @param frameWidth {number} Width of animation frame.
         * @param frameHeight {number} Height of animation frame.
         * @param frameMax {number} Number of animation frames.
         * @return {FrameData} Generated FrameData object.
         */
        public static parseSpriteSheet(game: Game, key: string, frameWidth: number, frameHeight: number, frameMax: number): FrameData {

            //  How big is our image?

            var img = game.cache.getImage(key);

            if (img == null)
            {
                return null;
            }

            var width = img.width;
            var height = img.height;

            var row = Math.round(width / frameWidth);
            var column = Math.round(height / frameHeight);
            var total = row * column;

            if (frameMax !== -1)
            {
                total = frameMax;
            }

            //  Zero or smaller than frame sizes?
            if (width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0)
            {
                return null;
            }

            //  Let's create some frames then
            var data: FrameData = new FrameData();

            var x = 0;
            var y = 0;

            for (var i = 0; i < total; i++)
            {
                data.addFrame(new Frame(x, y, frameWidth, frameHeight, ''));

                x += frameWidth;

                if (x === width)
                {
                    x = 0;
                    y += frameHeight;
                }

            }

            return data;

        }

        /**
         * Parse frame datas from json.
         * @param json {object} Json data you want to parse.
         * @return {FrameData} Generated FrameData object.
         */
        public static parseJSONData(game: Game, json): FrameData {

            //  Malformed?
            if (!json['frames'])
            {
                throw new Error("Phaser.AnimationLoader.parseJSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            }

            //  Let's create some frames then
            var data: FrameData = new FrameData();

            //  By this stage frames is a fully parsed array
            var frames = json['frames'];
            var newFrame: Frame;

            for (var i = 0; i < frames.length; i++)
            {
                newFrame = data.addFrame(new Frame(frames[i].frame.x, frames[i].frame.y, frames[i].frame.w, frames[i].frame.h, frames[i].filename));
                newFrame.setTrim(frames[i].trimmed, frames[i].sourceSize.w, frames[i].sourceSize.h, frames[i].spriteSourceSize.x, frames[i].spriteSourceSize.y, frames[i].spriteSourceSize.w, frames[i].spriteSourceSize.h);
            }

            return data;

        }

        public static parseXMLData(game: Game, xml, format: number): FrameData {

            //  Malformed?
            if (!xml.getElementsByTagName('TextureAtlas'))
            {
                throw new Error("Phaser.AnimationLoader.parseXMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            }

            //  Let's create some frames then
            var data: FrameData = new FrameData();

            var frames = xml.getElementsByTagName('SubTexture');

            var newFrame: Frame;

            for (var i = 0; i < frames.length; i++)
            {
                var frame = frames[i].attributes;

                newFrame = data.addFrame(new Frame(frame.x.nodeValue, frame.y.nodeValue, frame.width.nodeValue, frame.height.nodeValue, frame.name.nodeValue));

                //  Trimmed?
                if (frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0')
                {
                    newFrame.setTrim(true, frame.width.nodeValue, frame.height.nodeValue, Math.abs(frame.frameX.nodeValue), Math.abs(frame.frameY.nodeValue), frame.frameWidth.nodeValue, frame.frameHeight.nodeValue);
                }

            }

            return data;
        }

    }

}