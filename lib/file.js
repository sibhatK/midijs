import buffer from 'buffer';
import util from 'util';
import stream from 'stream';
import BufferCursor from 'buffercursor';
import { Header } from './file/header';
import { Event as MIDIEvent, MetaEvent, SysexEvent, ChannelEvent } from './file/event';
import { Track } from './file/track';
import { parseHeader } from './file/parser/header';
import { parseTrack } from './file/parser/track';
import { encodeHeader } from './file/encoder/header';
import { encodeTrack } from './file/encoder/track';

const noop = function () {};

class File extends stream.Duplex {
    constructor(data, callback = noop) {
        super();
        this._header = new Header();
        this._tracks = [];
        if (data && buffer.Buffer.isBuffer(data)) {
            this.setData(data, callback);
        }
    }

    _read() {
        this.getData((err, data) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            this.push(data);
            this.push(null);
        });
    }

    _write(chunk, encoding, callback) {
        if (!Array.isArray(this._data)) {
            this._data = [chunk];
        } else {
            this._data.push(chunk);
        }
        callback();
    }

    end() {
        super.end();
        const data = buffer.Buffer.concat(this._data);
        delete this._data;

        this.setData(data, (err) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            this.emit('parsed');
        });
    }

    getData(callback) {
        let header, tracks = [], length, err = null, data = null, i;

        try {
            header = encodeHeader(this._header);
            length = this._header._trackCount;

            for (i = 0; i < length; i++) {
                tracks.push(encodeTrack(this._tracks[i]));
            }

            data = buffer.Buffer.concat([header].concat(tracks));
        } catch (e) {
            err = e;
        }

        callback(err, data);
    }

    setData(data, callback) {
        let header, tracks = [], cursor, length, err = null, i;

        try {
            cursor = new BufferCursor(data);
            header = parseHeader(cursor);

            length = header._trackCount;

            for (i = 0; i < length; i++) {
                tracks.push(parseTrack(cursor));
            }

            if (header.getFileType() === 0 && length > 1) {
                tracks = tracks.slice(0, 1);
            }

            this._header = header;
            this._tracks = tracks;
        } catch (e) {
            err = e;
        }

        callback(err);
    }

    getHeader() {
        return this._header;
    }

    getTracks() {
        return [].slice.call(this._tracks);
    }

    getTrack(index) {
        return this._tracks[index];
    }

    addTrack(index, events) {
        if (Array.isArray(index)) {
            events = index;
            index = this._tracks.length;
        } else if (!Array.isArray(events)) {
            if (typeof index !== 'number') {
                events = [].slice.call(arguments);
                index = this._tracks.length;
            } else {
                events = [].slice.call(arguments, 1);
            }
        }

        this._tracks.splice(index, 0, new Track(events));
        this._header._trackCount += 1;

        return this;
    }

    removeTrack(index = -1) {
        this._header._trackCount -= this._tracks.splice(index, 1).length;
        return this;
    }
}

// Static properties
File.Header = Header;
File.Event = MIDIEvent;
File.MetaEvent = MetaEvent;
File.SysexEvent = SysexEvent;
File.ChannelEvent = ChannelEvent;
File.Track = Track;

export { File };
