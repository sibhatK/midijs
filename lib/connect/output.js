import { MIDIInvalidArgument } from '../error';
import { ChannelEvent } from '../file';
import { encodeChannelEvent } from '../file/encoder/event';

/**
 * Construct a new Output
 *
 * @class Output
 * @classdesc An output device to which we can send MIDI events
 *
 * @param {MIDIOutput} native Native MIDI output
 */
class Output {
    constructor(native) {
        this.native = native;

        this.id = native.id;
        this.manufacturer = native.manufacturer;
        this.name = native.name;
        this.version = native.version;
    }

    /**
     * Send a MIDI event to the output
     *
     * @param {ChannelEvent} event MIDI event to send
     * @throws {MIDIInvalidArgument}
     * Not a valid channel event
     */
    send(event) {
        if (!(event instanceof ChannelEvent)) {
            throw new MIDIInvalidArgument(
                'Expected a channel event to be sent'
            );
        }

        const data = encodeChannelEvent(event).data;

        this.native.send(
            Array.from(data),
            event.delay || 0
        );
    }
}

export { Output };