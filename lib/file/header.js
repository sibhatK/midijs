import { MIDIInvalidArgument } from '../error';

class Header {
    static FILE_TYPE = {
        SINGLE_TRACK: 0,
        SYNC_TRACKS: 1,
        ASYNC_TRACKS: 2
    };

    constructor(fileType, trackCount, ticksPerBeat) {
        this._fileType = fileType || Header.FILE_TYPE.SYNC_TRACKS;
        this._trackCount = trackCount || 0;
        this._ticksPerBeat = ticksPerBeat || 120;
    }

    getFileType() {
        return this._fileType;
    }

    getTicksPerBeat() {
        return this._ticksPerBeat;
    }

    setFileType(fileType) {
        const types = Header.FILE_TYPE;
        
        for (const type in types) {
            if (types.hasOwnProperty(type) && fileType === types[type]) {
                this._fileType = fileType;
                return this;
            }
        }

        throw new MIDIInvalidArgument(
            `File type "${fileType}" is not defined. Did you mean 0, 1 or 2?`
        );
    }

    setTicksPerBeat(ticksPerBeat) {
        if (ticksPerBeat < 1 || ticksPerBeat > 65535) {
            throw new MIDIInvalidArgument(
                `Ticks per beat amount should be between 0 and 65535 (got ${ticksPerBeat})`
            );
        }

        this._ticksPerBeat = ticksPerBeat;
        return this;
    }
}

export { Header };
