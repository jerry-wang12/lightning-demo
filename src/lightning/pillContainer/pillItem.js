export default class LightningPillItem {
    constructor(item) {
        this._item = item;
    }

    get item() {
        return this._item;
    }

    get isAvatar() {
        return this._item.type === 'avatar';
    }

    get isIcon() {
        return this._item.type === 'icon';
    }
}
