import { LightningElement, track } from 'lwc';

export default class ButtonOnclick extends LightningElement {
    @track toggleIconName = 'utility:preview';
    @track toggleButtonLabel = 'Hide content';
    @track greekLetter;

    // when the component is first initialized assign an initial value to the `greekLetter` variable
    connectedCallback() {
        this.greekLetter = this.getRandomGreekLetter();
    }

    // Handles click on the 'Show/hide content' button
    handleToggleClick() {
        // retrieve the classList from the specific element
        const contentBlockClasslist = this.template.querySelector(
            '.lgc-id_content-toggle'
        ).classList;
        // toggle the hidden class
        contentBlockClasslist.toggle('slds-hidden');

        // if the current icon-name is `utility:preview` then change it to `utility:hide`
        if (this.toggleIconName === 'utility:preview') {
            this.toggleIconName = 'utility:hide';
            this.toggleButtonLabel = 'Reveal content';
        } else {
            this.toggleIconName = 'utility:preview';
            this.toggleButtonLabel = 'Hide content';
        }
    }

    // Handles click on the 'Random greek letter' button
    handleRandomClick() {
        this.greekLetter = this.getRandomGreekLetter();
    }

    // internal only method of this example component
    // :: this generates a random greek letter string that is inserted into the template
    getRandomGreekLetter() {
        // retrieve a random greek letter from the array
        const letter = this.greek[
            Math.floor(Math.random() * this.greek.length)
        ];

        // create a temporary <textarea> element using the DOMParser
        // :: this allows for the pretty formatting using the HTML character entities such as `&alpha;`
        // :: this allows the browser to automatically convert the string to proper HTML
        const textarea = new DOMParser().parseFromString(
            `<textarea>${letter} [ &${letter}; ]</textarea>`,
            'text/html'
        ).body.firstChild;

        // return the final converted value for output in our component
        return textarea.value;
    }

    // list of greek letter names
    greek = [
        'alpha',
        'theta',
        'tau',
        'beta',
        'vartheta',
        'pi',
        'upsilon',
        'gamma',
        'iota',
        'varpi',
        'phi',
        'delta',
        'kappa',
        'rho',
        'varphi',
        'epsilon',
        'lambda',
        'varrho',
        'chi',
        'varepsilon',
        'mu',
        'sigma',
        'psi',
        'zeta',
        'nu',
        'varsigma',
        'omega',
        'eta',
        'xi',
        'Gamma',
        'Lambda',
        'Sigma',
        'Psi',
        'Delta',
        'Xi',
        'Upsilon',
        'Omega',
        'Theta',
        'Pi',
        'Phi',
    ];
}
