//  Queues a Game Object for removal from this Input Manager on the next update.
var QueueForRemoval = function (child)
{
    this._pendingRemoval.push(child);

    return this;
};

module.exports = QueueForRemoval;
