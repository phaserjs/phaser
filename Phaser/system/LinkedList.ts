/// <reference path="../Basic.ts" />

/**
 * A miniature linked list class.
 * Useful for optimizing time-critical or highly repetitive tasks!
 * See <code>QuadTree</code> for how to use it, IF YOU DARE.
 */
class LinkedList {

    /**
     * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
     */
    constructor() {

        this.object = null;
        this.next = null;

    }

    /**
     * Stores a reference to an <code>Basic</code>.
     */
    public object: Basic;

    /**
     * Stores a reference to the next link in the list.
     */
    public next: LinkedList;

    /**
     * Clean up memory.
     */
    public destroy() {

        this.object = null;

        if (this.next != null)
        {
            this.next.destroy();
        }

        this.next = null;

    }
}
