import {
    fullHexValue,
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    rgbToPosition,
    rgbToHsv,
} from '../colorUtil';

const CANVAS = { x: 198, y: 80 };

it('Converts short HEX to full form', () => {
    expect(fullHexValue('#fff')).toBe('#ffffff');
    expect(fullHexValue('#000')).toBe('#000000');
    expect(fullHexValue('#ABC')).toBe('#AABBCC');
    expect(fullHexValue('ABC')).toBe('#AABBCC');
});

describe('lightning-color-picker-custom', () => {
    let hsl, hsv, position;
    it('Converts a valid HEX to an RGB object', () => {
        expect(hexToRgb('#FFFFFF')).toEqual({
            red: 255,
            green: 255,
            blue: 255,
        });
        expect(hexToRgb('#000000')).toEqual({ red: 0, green: 0, blue: 0 });
        expect(hexToRgb('000000')).toEqual({ red: 0, green: 0, blue: 0 });
        expect(hexToRgb('1067f2')).toEqual({ red: 16, green: 103, blue: 242 });
        expect(hexToRgb('#1067f2')).toEqual({ red: 16, green: 103, blue: 242 });
        expect(hexToRgb('#54db2b')).toEqual({ red: 84, green: 219, blue: 43 });
    });
    it('Converts a valid RGB object into a valid HEX value', () => {
        expect(rgbToHex({ red: 0, green: 0, blue: 0 })).toBe('000000');
        expect(rgbToHex({ red: 16, green: 103, blue: 242 })).toBe('1067F2');
        expect(rgbToHex({ red: 84, green: 219, blue: 43 })).toBe('54DB2B');
        expect(rgbToHex({ red: 221, green: 17, blue: 17 })).toBe('DD1111');
        expect(rgbToHex({ red: 89, green: 98, blue: 99 })).toBe('596263');
    });
    it('Converts a valid RGB object into a valid HSL(hue,saturation,lightness) object', () => {
        expect(rgbToHsl({ red: 0, green: 0, blue: 0 })).toEqual({
            hue: 0,
            saturation: 0,
            lightness: 0,
        });
        expect(rgbToHsl({ red: 255, green: 255, blue: 255 })).toEqual({
            hue: 0,
            saturation: 0,
            lightness: 100,
        });

        hsl = rgbToHsl({ red: 16, green: 103, blue: 242 });
        expect(hsl.hue).toBeCloseTo(217, 0);
        expect(hsl.saturation).toBeCloseTo(90, 0);
        expect(hsl.lightness).toBeCloseTo(51, 0);

        hsl = rgbToHsl({ red: 84, green: 219, blue: 43 });
        expect(hsl.hue).toBeCloseTo(106, 0);
        expect(hsl.saturation).toBeCloseTo(71, 0);
        expect(hsl.lightness).toBeCloseTo(51, 0);

        hsl = rgbToHsl({ red: 221, green: 17, blue: 17 });
        expect(hsl.hue).toBeCloseTo(0, 0);
        expect(hsl.saturation).toBeCloseTo(86, 0);
        expect(hsl.lightness).toBeCloseTo(47, 0);
    });
    it('Converts a valid RGB object into a valid Position(x,y) object', () => {
        expect(rgbToPosition({ red: 0, green: 0, blue: 0 }, CANVAS)).toEqual({
            x: 0,
            y: 80,
        });
        expect(
            rgbToPosition({ red: 255, green: 255, blue: 255 }, CANVAS)
        ).toEqual({ x: 0, y: 0 });

        position = rgbToPosition({ red: 16, green: 103, blue: 242 }, CANVAS);
        expect(position.x).toBeCloseTo(185, 0);
        expect(position.y).toBeCloseTo(4, 0);

        position = rgbToPosition({ red: 221, green: 17, blue: 17 }, CANVAS);
        expect(position.x).toBeCloseTo(183, 0);
        expect(position.y).toBeCloseTo(11, 0);

        position = rgbToPosition({ red: 84, green: 219, blue: 43 }, CANVAS);
        expect(position.x).toBeCloseTo(159, 0);
        expect(position.y).toBeCloseTo(11, 0);
    });
    it('Converts a valid RGB object into a valid HSV(hue,saturation,brightness) object', () => {
        expect(rgbToHsv({ red: 0, green: 0, blue: 0 })).toEqual({
            hue: 0,
            saturation: 0,
            brightness: 0,
        });
        expect(rgbToHsv({ red: 255, green: 255, blue: 255 })).toEqual({
            hue: 0,
            saturation: 0,
            brightness: 100,
        });

        hsv = rgbToHsv({ red: 16, green: 103, blue: 242 });
        expect(hsv.hue).toBeCloseTo(217, 0);
        expect(hsv.saturation).toBeCloseTo(93, 0);
        expect(hsv.brightness).toBeCloseTo(95, 0);

        hsv = rgbToHsv({ red: 84, green: 219, blue: 43 });
        expect(hsv.hue).toBeCloseTo(106, 0);
        expect(hsv.saturation).toBeCloseTo(80, 0);
        expect(hsv.brightness).toBeCloseTo(86, 0);

        hsv = rgbToHsv({ red: 221, green: 17, blue: 17 });
        expect(hsv.hue).toBeCloseTo(0, 0);
        expect(hsv.saturation).toBeCloseTo(92, 0);
        expect(hsv.brightness).toBeCloseTo(87, 0);
    });
});
