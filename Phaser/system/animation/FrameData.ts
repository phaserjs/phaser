/// <reference path="../../Game.ts" />

/**
* Phaser - FrameData
*
* FrameData is a container for Frame objects, the internal representation of animation data in Phaser.
*/

module Phaser {

    export class FrameData {

        constructor() {

            this._frames = [];
            this._frameNames = [];

        }

        private _frames: Frame[];
        private _frameNames;

        public get total(): number {
            return this._frames.length;
        }

        public addFrame(frame: Frame): Frame {

            frame.index = this._frames.length;

            this._frames.push(frame);

            if (frame.name !== '')
            {
                this._frameNames[frame.name] = frame.index;
            }

            return frame;

        }

        public getFrame(index: number): Frame {

            if (this._frames[index])
            {
                return this._frames[index];
            }

            return null;

        }

        public getFrameByName(name: string): Frame {

            if (this._frameNames[name] >= 0)
            {
                return this._frames[this._frameNames[name]];
            }

            return null;

        }

        public checkFrameName(name: string): bool {

            if (this._frameNames[name] >= 0)
            {
                return true;
            }

            return false;

        }

        public getFrameRange(start: number, end: number, output?: Frame[] = []): Frame[] {

            for (var i = start; i <= end; i++)
            {
                output.push(this._frames[i]);
            }

            return output;

        }

        public getFrameIndexes(output?: number[] = []): number[] {

            output.length = 0;

            for (var i = 0; i < this._frames.length; i++)
            {
                output.push(i);
            }

            return output;

        }

        public getFrameIndexesByName(input: string[]): number[] {

            var output: number[] = [];

            for (var i = 0; i < input.length; i++)
            {
                if (this.getFrameByName(input[i]))
                {
                    output.push(this.getFrameByName(input[i]).index);
                }
            }

            return output;

        }

        public getAllFrames(): Frame[] {
            return this._frames;
        }

        public getFrames(range: number[]) {

            var output: Frame[] = [];

            for (var i = 0; i < range.length; i++)
            {
                output.push(this._frames[i]);
            }

            return output;

        }

    }

}
