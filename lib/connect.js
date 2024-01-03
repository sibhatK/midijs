import { Driver } from './connect/driver';
import { Input } from './connect/input';
import { Output } from './connect/output';
import Promise from 'promise';

/**
 * Establish a connection to the MIDI driver
 *
 * @return {Promise} A connection promise
 */
function connect() {
    return new Promise(function (resolve, reject) {
        navigator.requestMIDIAccess().then(function (access) {
            resolve(new Driver(access));
        }).catch(function () {
            reject(new Error('MIDI access denied'));
        });
    });
}

connect.Driver = Driver;
connect.Input = Input;
connect.Output = Output;

// Export the connect function if navigator is available in the global scope
if (typeof globalThis.navigator !== 'undefined') {
    export { connect };
}
