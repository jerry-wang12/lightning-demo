// NOTE: lightning-record-utils is a public library. adding new utils here means we
// will have to support it until the end of time. Consider adding the util to
// lightning-utils-private instead if it's something we can live with as
// internal-only.

/**
 * This is a prettified copy-paste of the force:records#to18 method.
 * Converts to 18-char record ids. Details at http://sfdc.co/bnBMvm.
 *
 * @param {String} recordId - a 15- or 18-char record id.
 * @return {String|null} - an 18-char record id, null if an invalid record id was provided.
 */

export function normalizeRecordId(recordId) {
    if (!recordId) {
        return null;
    }

    if (recordId.length === 15) {
        let suffix = '';
        const CASE_DECODE_STRING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456';
        // Build the 3 character suffix
        for (let set = 0; set < 3; ++set) {
            let decodeValue = 0;
            for (let bit = 0; bit < 5; bit++) {
                const c = recordId.charAt(set * 5 + bit);
                if (c >= 'A' && c <= 'Z') {
                    decodeValue += 1 << bit;
                }
            }

            suffix += CASE_DECODE_STRING.charAt(decodeValue);
        }

        return recordId + suffix;
    } else if (recordId.length === 18) {
        return recordId;
    }
    return null;
}
