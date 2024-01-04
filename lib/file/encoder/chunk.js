import buffer from 'buffer';
import BufferCursor from 'buffercursor';

/**
 * Encode a MIDI chunk
 *
 * @param {string} type Chunk type
 * @param {Buffer} data Chunk data
 * @return {Buffer} Encoded chunk
 */
function encodeChunk(type, data) {
    const cursor = new BufferCursor(new buffer.Buffer(
        buffer.Buffer.byteLength(type) + 4 + data.length
    ));

    cursor.write(type);
    cursor.writeUInt32BE(data.length);
    cursor.copy(data);

    return cursor.buffer;
}

export { encodeChunk };
