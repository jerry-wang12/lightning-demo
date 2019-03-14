import { toHighlightParts } from '../highlight';

describe('toHighlight', () => {
    it('should parse to highlight parts if no highlight', () => {
        const text = 'asdalksdjlalskdj aalksjdlajsdalksd';
        const matched = [];

        const expected = [
            { highlight: false, text: 'asdalksdjlalskdj aalksjdlajsdalksd' },
        ];
        expect(toHighlightParts(text, matched)).toEqual(expected);

        expect(toHighlightParts(text, null)).toEqual(expected);
    });

    it('should parse to highlight parts for one highlight', () => {
        const text = 'asdalksdjlalskdj aalksjdlajsdalksd';
        const matched = [
            {
                offset: 0,
                length: 6,
            },
        ];

        const expected = [
            { highlight: true, text: 'asdalk' },
            { highlight: false, text: 'sdjlalskdj aalksjdlajsdalksd' },
        ];
        expect(toHighlightParts(text, matched)).toEqual(expected);
    });

    it('should parse to highlight parts for multiple highlights', () => {
        const text = 'asdalksdjlalskdj aalksjdlajsdalksd';
        const matched = [
            {
                offset: 0,
                length: 6,
            },
            {
                offset: 11,
                length: 4,
            },
        ];

        const expected = [
            { highlight: true, text: 'asdalk' },
            { highlight: false, text: 'sdjla' },
            { highlight: true, text: 'lskd' },
            { highlight: false, text: 'j aalksjdlajsdalksd' },
        ];
        expect(toHighlightParts(text, matched)).toEqual(expected);
    });
});
