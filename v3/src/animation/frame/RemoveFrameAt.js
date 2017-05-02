var RemoveFrameAt = function (index)
{
    this.frames.splice(index, 1);

    this.updateFrameSequence();

    return this;
};

module.exports = RemoveFrameAt;
