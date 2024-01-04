import { MIDIParserError } from '../../error';

/**
 * Parse a MIDI chunk
 *
 * @param {string} expected Expected type
 * @param {module:buffercursor} cursor Buffer to parse
 * @throws {MIDIParserError}
 * Type expectation failed
 * @return {Buffer} Chunk data
 */
function parseChunk(expected, cursor) {
    const type = cursor.toString('ascii', 4);
    const length = cursor.readUInt32BE();

    if (type !== expected) {
        throw new MIDIParserError(type, expected, cursor.tell());
    }

    return cursor.slice(length);
}

export { parseChunk };
