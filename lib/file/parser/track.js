import { parseChunk } from './chunk';
import { parseEvent } from './event';
import { Track } from '../track';

/**
 * Parse a MIDI track chunk
 *
 * @param {module:buffercursor} cursor Buffer to parse
 * @return {Track} Parsed track
 */
function parseTrack(cursor) {
    let chunk, events = [], result, runningStatus = null;

    chunk = parseChunk('MTrk', cursor);

    while (!chunk.eof()) {
        result = parseEvent(chunk, runningStatus);
        runningStatus = result.runningStatus;

        events.push(result.event);
    }

    return new Track(events);
}

export { parseTrack };
