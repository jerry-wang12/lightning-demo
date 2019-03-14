import { EventEmitter } from 'lightning/utilsPrivate';

/**
 Represents an object which keeps track of a user's interacting state.
 @constructor InteractingState
 @param {Object} options - The options object.
 @param {Object} [options.duration=2000] - The number of milliseconds of idle time to wait before exiting the interacting state.
 @param {Object} [options.debounceInteraction=false] - Whether to debounce interaction to ignore consecutive leave-enter interactions.
 **/
export class InteractingState {
    constructor(options) {
        const duration =
            options && options.duration >= 0 ? options.duration : 2000;

        this.eventemitter = new EventEmitter();
        this._interacting = false;
        this._debouncedLeave = debounce(this.leave.bind(this), duration);

        this._debounceInteraction = options && options.debounceInteraction;
        this._interactedRecently = false;
        if (this._debounceInteraction) {
            // debounce leave until a short time later
            this._debouncedEmitLeave = debounce(() => {
                if (!this._interacting) {
                    this._interactedRecently = false;
                    this.eventemitter.emit('leave');
                }
            }, 200);
            // debounce enter until left
            this._debouncedEmitEnter = () => {
                if (!this._interactedRecently) {
                    this._interactedRecently = true;
                    this.eventemitter.emit('enter');
                }
            };
        }
    }

    /**
     Checks whether or not we are in the interacting state.
     @method InteractingState#isInteracting
     @return {Boolean} - Whether or not we are interacting.
     **/
    isInteracting() {
        return this._interacting;
    }

    /**
     Enters the interacting state.
     @method InteractingState#enter
     @returns {void}
     **/
    enter() {
        if (!this._interacting) {
            this._interacting = true;
            if (this._debounceInteraction) {
                this._debouncedEmitEnter();
            } else {
                this.eventemitter.emit('enter');
            }
        }
    }

    /**
     Registers a handler to execute when we enter the interacting state.
     @method InteractingState#onenter
     @param {Function} handler - The callback function.
     **/
    onenter(handler) {
        this.eventemitter.on('enter', handler);
    }

    /**
     Leaves the interacting state.
     @method InteractingState#leave
     @returns {void}
     **/
    leave() {
        if (this._interacting) {
            this._interacting = false;
            if (this._debounceInteraction) {
                this._debouncedEmitLeave();
            } else {
                this.eventemitter.emit('leave');
            }
        }
    }

    /**
     Registers a handler to execute when we leave the interacting state.
     @method InteractingState#onleave
     @param {Function} handler - The callback function.
     **/
    onleave(handler) {
        this.eventemitter.on('leave', handler);
    }

    /**
     Signals the start of the transition into the interacting state and
     schedules a transition out of the interacting state after an idle
     duration. Calling this method multiple times will reset the timer.
     @method InteractingState#interacting
     @returns {void}
     **/
    interacting() {
        this.enter();
        this._debouncedLeave();
    }
}

/**
 Creates a debounced function that delays invoking `func` until after
 `delay` milliseconds have elapsed since the last time the debounced
 function was invoked.
 @function debounce
 @param {Function} func - The function to debounce
 @param {Number} delay - The number of milliseconds to delay
 @param {Object} options - The options object
 @param {Boolean} options.leading - Specify invoking on the leading edge of the timeout
 @return {Function} - debounced function
 **/
export function debounce(func, delay, options) {
    const _options = options || {};
    let invokeLeading = _options.leading;
    let timer;

    return function debounced() {
        const args = Array.prototype.slice.apply(arguments);
        if (invokeLeading) {
            func.apply(this, args);
            invokeLeading = false;
        }
        clearTimeout(timer);
        // eslint-disable-next-line lwc/no-set-timeout
        timer = setTimeout(function() {
            func.apply(this, args);
            invokeLeading = _options.leading; // reset for next debounce sequence
        }, delay);
    };
}
