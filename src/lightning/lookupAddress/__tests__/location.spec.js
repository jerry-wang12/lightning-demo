import { getLocation, DEFAULT_LOCATION } from '../location';

describe('getLocation', () => {
    it('should return default location if navigator not available', async () => {
        const location = await getLocation();
        expect(location).toEqual(DEFAULT_LOCATION);
    });
});
