/**
 * Construct a new Track
 *
 * @class Track
 * @classdesc A track from a Standard MIDI file (a sequence of MIDI events)
 *
 * @param {Array<module:midijs/lib/file/event~Event>}
 * [events=[]] List of events in the track
 */
class Track {
    constructor(events) {
        this._events = Array.isArray(events) ? events : [];
    }

    /**
     * Get this track's events
     *
     * @return {Array<module:midijs/lib/event~Events>}
     */
    getEvents() {
        return [].slice.call(this._events);
    }

    /**
     * Get an event from this track
     *
     * @param {number} index Index of the event to get
     * @return {module:midijs/lib/track~Track|undefined} The event, or undefined
     */
    getEvent(index) {
        return this._events[index];
    }

    /**
     * Add an event to this track
     *
     * @param {number} [index=length] Index of the event
     * @param {module:midijs/lib/file/event~Event} event - The event to add
     * @return {module:midijs/lib/track~Track} Current instance
     */
    addEvent(index, event) {
        if (typeof index !== 'number') {
            event = index;
            index = this._events.length;
        }

        this._events.splice(index, 0, event);
        return this;
    }

    /**
     * Remove an event from this track
     *
     * @param {number} [index=-1] Index of the event to remove
     * @return {module:midijs/lib/track~Track} Current instance
     */
    removeEvent(index = -1) {
        this._events.splice(index, 1);
        return this;
    }
}

export { Track };
