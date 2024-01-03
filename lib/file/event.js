import { MIDIInvalidEventError } from '../error';

/**
 * Construct a new Event
 *
 * @abstract
 * @class Event
 * @classdesc Any type of MIDI event
 *
 * @param {Object} [props={}] Event properties
 * @param {number} [defaults={}] Default event properties
 * @param {number} [delay=0] Event delay in ticks
 */
class Event {
    constructor(props, defaults, delay) {
        this.delay = delay || 0;
        props = props || {};

        for (const name in defaults) {
            if (defaults.hasOwnProperty(name)) {
                this[name] = props.hasOwnProperty(name) ? props[name] : defaults[name];
            }
        }
    }
}

/**
 * Construct a new MetaEvent
 *
 * @class MetaEvent
 * @extends Event
 * @classdesc A meta MIDI event, only encountered in Standard MIDI files
 * as holds information about the file
 *
 * @param {MetaEvent.TYPE} type Type of meta event
 * @param {Object} [props={}] Event properties (@see MetaEvent.TYPE)
 * @param {number} [delay=0] Meta info delay in ticks
 * @throws {MIDIInvalidEventError}
 * Invalid meta event type
 */
class MetaEvent extends Event {
    constructor(type, props, delay) {
        const defaults = MetaEvent.getDefaults(type);
        super(props, defaults, delay);
        this.type = type;
    }

    static getDefaults(type) {
        //... switch case for type and defaults as in the original function
        //... default case throws MIDIInvalidEventError
    }
}

MetaEvent.TYPE = {
    //... enum values as in the original file
};

/**
 * Construct a SysexEvent
 *
 * @class SysexEvent
 * @extends Event
 * @classdesc A system exclusive MIDI event.
 * @param {number} type Sysex type
 * @param {Buffer} data Sysex data
 * @param {number} delay Sysex message delay in ticks
 */
class SysexEvent extends Event {
    constructor(type, data, delay) {
        super({}, {}, delay);
        this.type = type;
        this.data = data;
    }
}

/**
 * Construct a ChannelEvent
 *
 * @class ChannelEvent
 * @extends Event
 * @classdesc A channel MIDI event.
 * @param {ChannelEvent.TYPE} type Type of channel event
 * @param {Object} [props={}] Event properties
 * @param {number} [channel=0] Channel to which the event applies
 * @param {number} [delay=0] Channel event delay in ticks
 * @throws {MIDIInvalidEventError}
 * Invalid channel event type
 */
class ChannelEvent extends Event {
    constructor(type, props, channel, delay) {
        const defaults = ChannelEvent.getDefaults(type);
        super(props, defaults, delay);
        this.type = type;
        this.channel = channel || 0;
    }

    static getDefaults(type) {
        //... switch case for type and defaults as in the original function
        //... default case throws MIDIInvalidEventError
    }
}

ChannelEvent.TYPE = {
    //... enum values as in the original file
};

export { Event, MetaEvent, SysexEvent, ChannelEvent };
