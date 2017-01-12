var DrawImageBatch = require('./batches/DrawImageBatch');

var BatchManager = function (renderer, batchSize)
{
    this.renderer = renderer;

    this.currentBatch = null;

    this.drawImageBatch = new DrawImageBatch(this, batchSize);

    // this.pixelBatch = new Batch.Pixel(this, batchSize);
    // this.fxBatch = new Batch.FX(this, batchSize);
};

BatchManager.prototype.constructor = BatchManager;

BatchManager.prototype = {

    init: function ()
    {
        this.drawImageBatch.init();

        // this.pixelBatch.init();
        // this.fxBatch.init();

        this.currentBatch = this.drawImageBatch;
    },

    start: function ()
    {
        this.currentBatch.start();
    },

    stop: function ()
    {
        this.currentBatch.stop();
    },

    setBatch: function (newBatch)
    {
        if (this.currentBatch.type === newBatch.type)
        {
            return false;
        }

        //  Flush whatever was in the current batch (if anything)
        this.currentBatch.flush();

        this.currentBatch = newBatch;

        this.currentBatch.start(true);

        return true;
    },

    //  Add a new entry into the current sprite batch
//    add: function (source, blendMode, verts, uvs, textureIndex, alpha, tintColors, bgColors)
    add: function (source, blendMode, )
    {
        var hasFlushed = false;

        //  Check Batch Size and flush if needed
        if (this.drawImageBatch.size >= this.drawImageBatch.maxSize)
        {
            this.drawImageBatch.flush();

            hasFlushed = true;
        }

        this.drawImageBatch.add();
    },

    /*
    addPixel: function (x0, y0, x1, y1, x2, y2, x3, y3, color)
    {
        var hasFlushed = this.setBatch(this.pixelBatch);

        //  Check Batch Size and flush if needed
        if (!hasFlushed && this.pixelBatch.size >= this.pixelBatch.maxSize)
        {
            this.pixelBatch.flush();
        }

        this.pixelBatch.add(x0, y0, x1, y1, x2, y2, x3, y3, color);
    },
    */

    destroy: function ()
    {
        this.singleTextureBatch.destroy();

        this.renderer = null;
        this.gl = null;
    }

};

module.exports = BatchManager;
