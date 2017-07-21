//  Return the child lowest down the display list (with the smallest index)
var SortIndexHandler = function (childA, childB)
{
    //  The higher the index, the lower down the display list they are.
    //  So entry 0 will be the top-most item (visually)
    var indexA = this.displayList.getIndex(childA.gameObject);
    var indexB = this.displayList.getIndex(childB.gameObject);

    if (indexA < indexB)
    {
        return 1;
    }
    else if (indexA > indexB)
    {
        return -1;
    }

    //  Technically this shouldn't happen, but if the GO wasn't part of this display list then it'll
    //  have an index of -1, so in some cases it can
    return 0;
};

module.exports = SortIndexHandler;
