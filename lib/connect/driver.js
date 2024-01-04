import { Output } from './output';
import { Input } from './input';
import EventEmitter from 'events';

class Driver extends EventEmitter {
    constructor(native) {
        super();
        this.native = native;
        this.outputs = Array.from(native.outputs.values()).map(port => new Output(port));
        this.output = null;
        this.inputs = Array.from(native.inputs.values()).map(port => new Input(port));
        this.input = null;

        native.onconnect = (event) => {
            let port = event.port;

            if (port.type === 'input') {
                port = new Input(port);
                this.inputs.push(port);
            } else {
                port = new Output(port);
                this.outputs.push(port);
            }

            this.emit('connect', port);
        };

        native.ondisconnect = (event) => {
            let port = event.port;

            if (port.type === 'input') {
                port = new Input(port);
                this.inputs = this.inputs.filter(input => input.id !== port.id);
            } else {
                port = new Output(port);
                this.outputs = this.outputs.filter(output => output.id !== port.id);
            }

            this.emit('disconnect', port);
        };
    }

    setInput(input) {
        if (this.input !== null) {
            this.input.removeListener('event', this._transmitMIDIEvent);
        }
    
        if (!input) {
            this.input = null;
            return;
        }
    
        if (typeof input === 'string') {
            input = this.inputs.find(function (element) {
                return (element.id === input);
            });
        } else if (!input instanceof Input) {
            input = new Input(input);
        }
    
        this.input = input;
        this.input.on('event', this._transmitMIDIEvent);    
    }

    _transmitMIDIEvent(event) {
        this.emit('event', event);
    }

    setOutput(output) {
        if (!output) {
            this.output = null;
            return;
        }
    
        if (typeof output === 'number') {
            output = this.outputs.find(function (element) {
                return (element.id === output);
            });
        } else if (!output instanceof Output) {
            output = new Output(output);
        }
    
        this.output = output;
    }

    send(event) {
        if (this.output !== null) {
            this.output.send(event);
        }
    }
}

export { Driver };


'use strict';

var Output = require('./output').Output;
var Input = require('./input').Input;

var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * Construct a new Driver
 *
 * @class Driver
 * @extends events.EventEmitter
 * @classdesc Enable you to access all the plugged-in MIDI
 * devices and to control them
 *
 * @param {MIDIAccess} native Native MIDI access
 */
function Driver(native) {
    var outputs = [], inputs = [], length, i;

    EventEmitter.call(this);
    this.native = native;

    length = native.outputs.size;

    for (i = 0; i < length; i += 1) {
        outputs[i] = new Output(native.outputs.get(i));
    }

    length = native.inputs.size;

    for (i = 0; i < length; i += 1) {
        inputs[i] = new Input(native.inputs.get(i));
    }

    this.outputs = outputs;
    this.output = null;
    this.inputs = inputs;
    this.input = null;

    native.onconnect = function (event) {
        var port = event.port;

        if (port.type === 'input') {
            port = new Input(port);
            this.inputs.push(port);
        } else {
            port = new Output(port);
            this.outputs.push(port);
        }

        this.emit('connect', port);
    }.bind(this);

    native.ondisconnect = function (event) {
        var port = event.port;

        if (port.type === 'input') {
            port = new Input(port);
            this.inputs = this.inputs.filter(function (input) {
                return (input.id !== port.id);
            });
        } else {
            port = new Output(port);
            this.outputs = this.outputs.filter(function (output) {
                return (output.id !== port.id);
            });
        }

        this.emit('disconnect', port);
    }.bind(this);
}

exports.Driver = Driver;
util.inherits(Driver, EventEmitter);

/**
 * Select a plugged-in input device as the default input
 * (will start listening to events emitted by the given input
 * and stop listening to the previous default input if there
 * was one)
 *
 * @param {module:midijs/lib/connect/input~Input|MIDIInput|string}
 * input Input id or instance
 * @return {null}
 */
Driver.prototype.setInput = function (input) {
    if (this.input !== null) {
        this.input.removeListener('event', this._transmitMIDIEvent);
    }

    if (!input) {
        this.input = null;
        return;
    }

    if (typeof input === 'string') {
        input = this.inputs.find(function (element) {
            return (element.id === input);
        });
    } else if (!input instanceof Input) {
        input = new Input(input);
    }

    this.input = input;
    this.input.on('event', this._transmitMIDIEvent);
};

/**
 * Transmit events from the default input
 *
 * @private
 * @param {module:midijs/lib/file/event~ChannelEvent}
 * event Event to be transmitted
 * @return {null}
 */
Driver.prototype._transmitMIDIEvent = function (event) {
    this.emit('event', event);
};

/**
 * Select a plugged-in output device as the default output
 *
 * @param {module:midijs/lib/connect/output~Output|MIDIOutput|string}
 * output Output id or instance
 * @return {null}
 */
Driver.prototype.setOutput = function (output) {
    if (!output) {
        this.output = null;
        return;
    }

    if (typeof output === 'number') {
        output = this.outputs.find(function (element) {
            return (element.id === output);
        });
    } else if (!output instanceof Output) {
        output = new Output(output);
    }

    this.output = output;
};

/**
 * Send a MIDI event to the default output
 *
 * @param {module:midijs/lib/file/event~ChannelEvent}
 * event Event to be sent
 * @return {null}
 */
Driver.prototype.send = function (event) {
    if (this.output !== null) {
        this.output.send(event);
    }
};
