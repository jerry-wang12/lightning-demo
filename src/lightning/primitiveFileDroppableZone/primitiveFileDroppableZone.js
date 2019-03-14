import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';

export default class LightningPrimitiveFileDroppableZone extends LightningElement {
    @track state = {};

    @api
    get disabled() {
        return this.state.disabled || false;
    }
    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
    }

    @api
    get multiple() {
        return this.state.multiple || false;
    }
    set multiple(value) {
        this.state.multiple = normalizeBoolean(value);
    }

    constructor() {
        super();

        this.template.addEventListener('dragover', this.allowDrop.bind(this));
        this.template.addEventListener(
            'dragleave',
            this.handleDragLeave.bind(this)
        );
        this.template.addEventListener('drop', this.handleOnDrop.bind(this));
    }

    connectedCallback() {
        this.classList.add('slds-file-selector__dropzone');
    }

    setDragOver(dragOver) {
        this.classList.toggle('slds-has-drag-over', dragOver);
    }

    handleDragLeave() {
        this.setDragOver(false);
    }

    handleOnDrop(event) {
        event.preventDefault();

        this.setDragOver(false);

        if (this.disabled) {
            event.stopPropagation();
            return;
        }

        if (!this.meetsMultipleCriteria(event)) {
            event.stopPropagation();
        }
    }

    allowDrop(event) {
        event.preventDefault();
        if (!this.disabled) {
            this.setDragOver(true);
        }
    }

    meetsMultipleCriteria(dragEvent) {
        const files = dragEvent.dataTransfer.files;
        return !(files.length > 1 && !this.multiple);
    }
}
