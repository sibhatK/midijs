import { encodeChunk } from './chunk';
import buffer from 'buffer';
import BufferCursor from 'buffercursor';

/**
 * Encode a MIDI header chunk
 *
 * @param {Header} header Header to encode
 * @return {Buffer} Encoded header
 */
function encodeHeader(header) {
    const cursor = new BufferCursor(new buffer.Buffer(6));

    cursor.writeUInt16BE(header.getFileType());
    cursor.writeUInt16BE(header._trackCount);
    cursor.writeUInt16BE(header.getTicksPerBeat() & 0x7FFF);

    return encodeChunk('MThd', cursor.buffer);
}

export { encodeHeader };
