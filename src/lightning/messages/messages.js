import { LightningElement, track, api } from 'lwc';
import { parseError } from 'lightning/recordEditUtils';
export default class LightningMessages extends LightningElement {
    @track err = {};

    @track hasError = false;
    // err is one of several error formats
    // returned by ui api, parseError normalizes them
    @api
    setError(err) {
        if (!err) {
            this.hasError = false;
        } else {
            const parsedError = parseError(err);
            this.hasError = true;
            this.err = parsedError;
        }
    }

    @api
    get error() {
        return this.err;
    }

    // alias to setError method, the
    // other method kept for backward compat
    set error(val) {
        this.setError(val);
    }
}
