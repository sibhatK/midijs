import { encodeChunk } from './chunk';
import { encodeEvent } from './event';
import buffer from 'buffer';

/**
 * Encode a MIDI track chunk
 *
 * @param {Track} track Track to encode
 * @return {Buffer} Encoded track
 */
function encodeTrack(track) {
    const events = track.getEvents();
    let data = [];
    const length = events.length;
    let runningStatus = null;
    let result;

    for (let i = 0; i < length; i++) {
        result = encodeEvent(events[i], runningStatus);
        runningStatus = result.runningStatus;

        data[i] = result.data;
    }

    return encodeChunk('MTrk', buffer.Buffer.concat(data));
}

export { encodeTrack };
