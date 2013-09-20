/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Animation.FrameData
*/

/**
* FrameData is a container for Frame objects, which are the internal representation of animation data in Phaser.
*
* @class FrameData
* @constructor
*/
Phaser.Animation.FrameData = function () {

    /**
    * Local array of frames.
    * @property _frames
    * @private
    * @type {Array}
    */
    this._frames = [];

    /**
    * Local array of frame names for name to index conversions.
    * @property _frameNames
    * @private
    * @type {Array}
    */
    this._frameNames = [];

};

Phaser.Animation.FrameData.prototype = {

    /**
    * Adds a new Frame to this FrameData collection. Typically called by the Animation.Parser and not directly.
    *
    * @method addFrame
    * @param {Phaser.Animation.Frame} frame The frame to add to this FrameData set.
    * @return {Phaser.Animation.Frame} The frame that was just added.
    */
    addFrame: function (frame) {

        frame.index = this._frames.length;

        this._frames.push(frame);

        if (frame.name !== '')
        {
            this._frameNames[frame.name] = frame.index;
        }

        return frame;

    },

	/**
	* Get a Frame by its numerical index.
    *
    * @method getFrame
	* @param {Number} index The index of the frame you want to get.
	* @return {Phaser.Animation.Frame} The frame, if found.
	*/
    getFrame: function (index) {

        if (this._frames[index])
        {
            return this._frames[index];
        }

        return null;

    },

    /**
    * Get a Frame by its frame name.
    *
    * @method getFrameByName
    * @param {String} name The name of the frame you want to get.
    * @return {Phaser.Animation.Frame} The frame, if found.
    */
    getFrameByName: function (name) {

        if (typeof this._frameNames[name] === 'number')
        {
            return this._frames[this._frameNames[name]];
        }

        return null;

    },

    /**
    * Check if there is a Frame with the given name.
    *
    * @method checkFrameName
    * @param {String} name The name of the frame you want to check.
    * @return {Boolean} True if the frame is found, otherwise false.
    */
    checkFrameName: function (name) {

        if (this._frameNames[name] == null)
        {
            return false;
        }

        return true;
        
    },

	/**
	* Returns a range of frames based on the given start and end frame indexes and returns them in an Array.
    *
    * @method getFrameRange
    * @param {Number} start The starting frame index.
	* @param {Number} end The ending frame index.
	* @param {Array} [output] Optional array. If given the results will be appended to the end of this Array.
	* @return {Array} An array of Frames between the start and end index values, or an empty array if none were found.
	*/
    getFrameRange: function (start, end, output) {
        
        if (typeof output === "undefined") { output = []; }

        for (var i = start; i <= end; i++)
        {
            output.push(this._frames[i]);
        }

        return output;

    },

	/**
	* Returns all of the Frames in this FrameData set where the frame index is found in the input array.
    * The frames are returned in the output array, or if none is provided in a new Array object.
    *
    * @method getFrames
    * @param {Array} frames An Array containing the indexes of the frames to retrieve. If the array is empty then all frames in the FrameData are returned.
    * @param {Boolean} [useNumericIndex=true] Are the given frames using numeric indexes (default) or strings? (false)
    * @param {Array} [output] Optional array. If given the results will be appended to the end of this Array, otherwise a new array is created.
    * @return {Array} An array of all Frames in this FrameData set matching the given names or IDs.
	*/
    getFrames: function (frames, useNumericIndex, output) {

        if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
        if (typeof output === "undefined") { output = []; }

        if (typeof frames === "undefined" || frames.length == 0)
        {
            //  No input array, so we loop through all frames
            for (var i = 0; i < this._frames.length; i++)
            {
                //  We only need the indexes
                output.push(this._frames[i]);
            }
        }
        else
        {
            //  Input array given, loop through that instead
            for (var i = 0, len = frames.length; i < len; i++)
            {
                //  Does the input array contain names or indexes?
                if (useNumericIndex)
                {
                    //  The actual frame
                    output.push(this.getFrame(frames[i]));
                }
                else
                {
                    //  The actual frame
                    output.push(this.getFrameByName(frames[i]));
                }
            }
        }

        return output;

    },

    /**
    * Returns all of the Frame indexes in this FrameData set.
    * The frames indexes are returned in the output array, or if none is provided in a new Array object.
    *
    * @method getFrameIndexes
    * @param {Array} frames An Array containing the indexes of the frames to retrieve. If the array is empty then all frames in the FrameData are returned.
    * @param {Boolean} [useNumericIndex=true] Are the given frames using numeric indexes (default) or strings? (false)
    * @param {Array} [output] Optional array. If given the results will be appended to the end of this Array, otherwise a new array is created.
    * @return {Array} An array of all Frame indexes matching the given names or IDs.
    */
    getFrameIndexes: function (frames, useNumericIndex, output) {

        if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
        if (typeof output === "undefined") { output = []; }

        if (typeof frames === "undefined" || frames.length == 0)
        {
            //  No frames array, so we loop through all frames
            for (var i = 0, len = this._frames.length; i < len; i++)
            {
                output.push(this._frames[i].index);
            }
        }
        else
        {
            //  Input array given, loop through that instead
            for (var i = 0, len = frames.length; i < len; i++)
            {
                //  Does the frames array contain names or indexes?
                if (useNumericIndex)
                {
                    output.push(frames[i]);
                }
                else
                {
                    output.push(this.getFrameByName(frames[i]).index);
                }
            }
        }

        return output;

    }

};

Object.defineProperty(Phaser.Animation.FrameData.prototype, "total", {

    /**
    * Returns the total number of frames in this FrameData set.
    *
    * @method total
    * @return {Number} The total number of frames in this FrameData set.
    */
    get: function () {
        return this._frames.length;
    }

});

