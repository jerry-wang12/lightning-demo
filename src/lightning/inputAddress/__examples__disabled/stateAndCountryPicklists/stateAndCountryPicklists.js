import { LightningElement, track } from 'lwc';

export default class InputAddressBase extends LightningElement {
    address = {
        street: '121 Spear St.',
        city: 'San Francisco',
        province: 'CA',
        postalCode: '94105',
        country: 'US',
    };

    @track _country = 'US';

    countryProvinceMap = {
        US: [
            { label: 'California', value: 'CA' },
            { label: 'Texas', value: 'TX' },
            { label: 'Washington', value: 'WA' },
        ],
        CN: [
            { label: 'GuangDong', value: 'GD' },
            { label: 'GuangXi', value: 'GX' },
            { label: 'Sichuan', value: 'SC' },
        ],
        VA: [],
    };

    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'China', value: 'CN' },
        { label: 'Vatican', value: 'VA' },
    ];

    get getProvinceOptions() {
        return this.countryProvinceMap[this._country];
    }
    get getCountryOptions() {
        return this.countryOptions;
    }

    handleChange() {
        this._country = event.detail.country;
    }
}
