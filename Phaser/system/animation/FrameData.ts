/// <reference path="../../Game.ts" />

/**
* Phaser - FrameData
*
* FrameData is a container for Frame objects, the internal representation of animation data in Phaser.
*/

module Phaser {

    export class FrameData {

        /**
         * FrameData constructor
         */
        constructor() {

            this._frames = [];
            this._frameNames = [];

        }

        /**
         * Local frame container.
         */
        private _frames: Frame[];
        /**
         * Local frameName<->index container.
         */
        private _frameNames;

        public get total(): number {
            return this._frames.length;
        }

        /**
         * Add a new frame.
         * @param frame {Frame} The frame you want to add.
         * @return {Frame} The frame you just added.
         */
        public addFrame(frame: Frame): Frame {

            frame.index = this._frames.length;

            this._frames.push(frame);

            if (frame.name !== '')
            {
                this._frameNames[frame.name] = frame.index;
            }

            return frame;

        }

        /**
         * Get a frame by its index.
         * @param index {number} Index of the frame you want to get.
         * @return {Frame} The frame you want.
         */
        public getFrame(index: number): Frame {

            if (this._frames[index])
            {
                return this._frames[index];
            }

            return null;

        }

        /**
         * Get a frame by its name.
         * @param name {string} Name of the frame you want to get.
         * @return {Frame} The frame you want.
         */
        public getFrameByName(name: string): Frame {

            if (this._frameNames[name] >= 0)
            {
                return this._frames[this._frameNames[name]];
            }

            return null;

        }

        /**
         * Check whether there's a frame with given name.
         * @param name {string} Name of the frame you want to check.
         * @return {boolean} True if frame with given name found, otherwise return false.
         */
        public checkFrameName(name: string): bool {

            if (this._frameNames[name] >= 0)
            {
                return true;
            }

            return false;

        }

        /**
         * Get ranges of frames in an array.
         * @param start {number} Start index of frames you want.
         * @param end {number} End index of frames you want.
         * @param output {Frame[]} Optional, result will be added into this array.
         * @return {Frame[]} Ranges of specific frames in an array.
         */
        public getFrameRange(start: number, end: number, output?: Frame[] = []): Frame[] {

            for (var i = start; i <= end; i++)
            {
                output.push(this._frames[i]);
            }

            return output;

        }

        /**
         * Get all indexes of frames by giving their name.
         * @param output {number[]} Optional, result will be added into this array.
         * @return {number[]} Indexes of specific frames in an array.
         */
        public getFrameIndexes(output?: number[] = []): number[] {

            output.length = 0;

            for (var i = 0; i < this._frames.length; i++)
            {
                output.push(i);
            }

            return output;

        }

        /**
         * Get all names of frames by giving their indexes.
         * @param output {number[]} Optional, result will be added into this array.
         * @return {number[]} Names of specific frames in an array.
         */
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

        /**
         * Get all frames in this frame data.
         * @return {Frame[]} All the frames in an array.
         */
        public getAllFrames(): Frame[] {
            return this._frames;
        }

        /**
         * Get All frames with specific ranges.
         * @param range {number[]} Ranges in an array.
         * @return {Frame[]} All frames in an array.
         */
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
