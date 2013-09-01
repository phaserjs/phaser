/**
* Phaser - LinkedList
*
* A miniature linked list class. Useful for optimizing time-critical or highly repetitive tasks!
*/

/**
* Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
*/
Phaser.LinkedList = function () {

    this.object = null;
    this.next = null;

};

Phaser.LinkedList.prototype = {

    destroy: function () {

        this.object = null;

        if (this.next != null)
        {
            this.next.destroy();
        }

        this.next = null;
    }

};
