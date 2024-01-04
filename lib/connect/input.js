import buffer from 'buffer';
import BufferCursor from 'buffercursor';
import EventEmitter from 'events';
import { parseChannelEvent } from '../file/parser/event';

class Input extends EventEmitter {
    constructor(native) {
        super();
        this.native = native;

        this.id = native.id;
        this.manufacturer = native.manufacturer;
        this.name = native.name;
        this.version = native.version;

        native.onmidimessage = (event) => {
            const data = new BufferCursor(new buffer.Buffer(event.data));
            const type = data.readUInt8();
            const object = parseChannelEvent(
                event.receivedTime,
                type >> 4,
                type & 0xF,
                data
            );

            this.emit('event', object);
        };
    }
}

export { Input };
