var Class = require('../../utils/Class');

var Node = new Class({

    initialize:

    function Node(owner)
    {
        this.next = this;
        this.prev = this;
        this.head = this;
        this.owner = owner;
    },

    selfRemove: function ()
    {
        this.prev.next = this.next;
        this.next.prev = this.prev;
        this.next = this;
        this.prev = this;
        this.head = this;
        return this;
    },

    getCount: function ()
    {
        var count = 0;
        var head = this.head;
        var node = head.next;

        for (;node != head; node = node.next)
        {
            count += 1;
        }

        return count;
    },

    clear: function ()
    {
        if (this.head != this)
        {
            while (this.next != this)
            {
                next.selfRemove();
            }
        }
        else
        {
            this.selfRemove();
        }
        return this;
    },

    insertBefore: function (target)
    {
        this.selfRemove();
        this.next = target;
        this.prev = target.prev;
        target.prev = this;
        this.prev.next = this;
        this.head = target.head;
        return this;
    },

    insertAfter: function (target)
    {
        this.selfRemove();
        this.prev = target;
        this.next = target.next;
        target.next = this;
        this.next.prev = this;
        this.head = target.head;
        return this;
    },

    insertBack: function (target)
    {
        return this.insertAfter(target.head);
    },

    insertFront: function (target)
    {
        return this.insertBefore(target.head);
    },

    getTail: function () 
    {
        return this.head.prev;
    }
});

var TransformData = new Class({

    initialize:

    function TransformData()
    {
        this.x = 0.0;
        this.y = 0.0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.rotation = 0.0;
    }

});

var TransformNode = new Class({

    initialize:

    function TransformNode(object)
    {
        this.object = object;
        this.parent = new Node(this);
        this.children = new Node(this);
        this.localTransform = new TransformData();
        this.worldTransform = new TransformData();
    },

    setParent: function (parent)
    {
        this.parent.insertFront(parent.children);
        return this;
    },

    add: function (child)
    {
        child.setParent(this);
        return this;
    },

    removeParent: function ()
    {
        this.parent.selfRemove();
        return this;
    },

    remove: function (child)
    {
        child.removeParent();
        return this;
    },

    clearChildren: function ()
    {
        this.children.clear();
        return this;
    },

    getParentNode: function ()
    {
        return this.parent.head.owner;
    },

    getRootNode: function ()
    {
        if (this.parent.head.owner.parent.head.owner === this)
        {
            return this;
        }
        else
        {
            return this.parent.head.owner.getRootNode();
        }
    },

    getChildCount: function ()
    {
        return this.children.getCount();
    }

});

module.exports = TransformNode;
