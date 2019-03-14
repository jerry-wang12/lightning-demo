const ADJECTIVES = [
    'pretty',
    'large',
    'big',
    'small',
    'tall',
    'short',
    'long',
    'handsome',
    'plain',
    'quaint',
    'clean',
    'elegant',
    'easy',
    'angry',
    'crazy',
    'helpful',
    'mushy',
    'odd',
    'unsightly',
    'adorable',
    'important',
    'inexpensive',
    'cheap',
    'expensive',
    'fancy',
];
const COLORS = [
    'red',
    'yellow',
    'blue',
    'green',
    'pink',
    'brown',
    'purple',
    'brown',
    'white',
    'black',
    'orange',
];
const NOUNS = [
    'table',
    'chair',
    'house',
    'bbq',
    'desk',
    'car',
    'pony',
    'cookie',
    'sandwich',
    'burger',
    'pizza',
    'mouse',
    'keyboard',
];
const EMAILS = [
    'reiniergs@gmail.com',
    'reinier.guerra@salesforce.com',
    'cpatino@salesforce.com',
    'info@lightning.com',
    'gonzalo@salesforce.com',
    'jose@salesforce.com',
];

const URLS = [
    'https://www.salesforce.com',
    'https://www.heroku.com',
    'https://www.lightning.com',
];

function _random(max) {
    return Math.round(Math.random() * 9e9) % max;
}

let nextId = 1;

export default class Store {
    constructor(count) {
        this.id = 1;
        this.buildData(count);
    }

    buildData(count = 1000) {
        const data = [];
        const now = Date.now();
        for (let i = 0; i < count; i += 1) {
            data.push({
                id: nextId++,
                text: `${ADJECTIVES[_random(ADJECTIVES.length)]} ${
                    COLORS[_random(COLORS.length)]
                } ${NOUNS[_random(NOUNS.length)]}`,
                number: _random(9e9),
                email: EMAILS[_random(EMAILS.length)],
                date: new Date(now - _random(9e9)).toString(),
                url: URLS[_random(URLS.length)],
            });
        }
        this.data = data;
        return this;
    }

    updateData() {
        const newData = [];
        for (let i = 0; i < this.data.length; i++) {
            if (i % 10 === 0) {
                newData[i] = Object.assign({}, this.data[i], {
                    text: this.data[i].text + ' !!!',
                });
            } else {
                newData[i] = this.data[i];
            }
        }
        this.data = newData;
        return this;
    }

    delete(id) {
        const idx = this.data.findIndex(d => d.id === id);
        this.data.splice(idx, 1);
        return this;
    }

    add() {
        this.data = this.data.concat(this.buildData(100));
        return this;
    }

    clear() {
        this.data = [];
        return this;
    }

    swapRows() {
        if (this.data.length > 10) {
            const d4 = this.data[4];
            const d9 = this.data[9];
            this.data = this.data.map((data, i) => {
                if (i === 4) {
                    return d9;
                } else if (i === 9) {
                    return d4;
                }
                return data;
            });
        }
        return this;
    }
}
