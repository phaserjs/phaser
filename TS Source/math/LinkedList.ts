/// <reference path="../_definitions.ts" />

/**
* Phaser - LinkedList
*
* A miniature linked list class. Useful for optimizing time-critical or highly repetitive tasks!
*/

module Phaser {

    export class LinkedList {

        /**
         * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
         */
        constructor() {

            this.object = null;
            this.next = null;

        }

        /**
         * Stores a reference to an <code>IGameObject</code>.
         */
        //public object: IGameObject;
        public object;

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

}