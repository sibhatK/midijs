import { MIDINotMIDIError, MIDINotSupportedError, MIDIParserError } from '../../error';
import { parseChunk } from './chunk';
import { Header } from '../header';

/**
 * Parse a MIDI header chunk
 *
 * @param {module:buffercursor} cursor Buffer to parse
 * @throws {MIDINotMIDIError}
 * If the file is not a MIDI file
 * @throws {MIDIParserError}
 * If time is expressed in unsupported SMPTE format
 * @return {Header} Parsed header
 */
function parseHeader(cursor) {
    let chunk, fileType, trackCount, timeDivision;

    try {
        chunk = parseChunk('MThd', cursor);
    } catch (e) {
        if (e instanceof MIDIParserError) {
            throw new MIDINotMIDIError();
        }
    }
    fileType = chunk.readUInt16BE();
    trackCount = chunk.readUInt16BE();
    timeDivision = chunk.readUInt16BE();

    if ((timeDivision & 0x8000) === 0) {
        timeDivision = timeDivision & 0x7FFF;
    } else {
        throw new MIDINotSupportedError(
            'Expressing time in SMPTE format is not supported yet'
        );
    }

    return new Header(fileType, trackCount, timeDivision);
}

export { parseHeader };
