function format(arg) {
    if (typeof arg === 'number') {
        return `0x${arg.toString(16).toUpperCase()}`;
    }

    if (typeof arg === 'string') {
        return `"${arg}"`;
    }

    return arg.toString();
}

class MIDIParserError extends Error {
    constructor(actual, expected, byte) {
        super();
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.actual = actual;
        this.expected = expected;

        actual = format(actual);
        expected = format(expected);

        this.message = `Invalid MIDI file: expected ${expected} but found ${actual}`;

        if (byte !== undefined) {
            this.byte = byte;
            this.message += ` (at byte ${byte})`;
        }
    }
}

class MIDIEncoderError extends Error {
    constructor(actual, expected) {
        super();
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.actual = actual;
        this.expected = expected;

        actual = format(actual);
        expected = format(expected);

        this.message = `MIDI encoding error: expected ${expected} but found ${actual}`;
    }
}

class MIDIInvalidEventError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
    }
}

class MIDIInvalidArgument extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
    }
}

class MIDINotMIDIError extends Error {
    constructor() {
        super('Not a valid MIDI file');
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
    }
}

class MIDINotSupportedError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
    }
}

export { MIDIParserError, MIDIEncoderError, MIDIInvalidEventError, MIDIInvalidArgument, MIDINotMIDIError, MIDINotSupportedError };
