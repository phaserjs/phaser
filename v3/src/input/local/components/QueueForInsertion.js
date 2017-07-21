//  Queues a Game Object for insertion into this Input Manager on the next update.
var QueueForInsertion = function (child)
{
    if (this.children.pendingInsertion.indexOf(child) === -1 && this.children.list.indexOf(child) === -1)
    {
        this.children.pendingInsertion.push(child);
    }

    return this;
};

module.exports = QueueForInsertion;
