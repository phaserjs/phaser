//  Queues a Game Object for insertion into this Input Manager on the next update.
var QueueForInsertion = function (child)
{
    if (this._pendingInsertion.indexOf(child) === -1 && this._list.indexOf(child) === -1)
    {
        this._pendingInsertion.push(child);
    }

    return this;
};

module.exports = QueueForInsertion;
