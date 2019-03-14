import labelAlignText from '@salesforce/label/LightningRichTextEditor.alignText';
import labelBold from '@salesforce/label/LightningRichTextButton.bold';
import labelBullet from '@salesforce/label/LightningRichTextButton.bullet';
import labelCenterAlign from '@salesforce/label/LightningRichTextButton.centerAlign';
import labelComposeText from '@salesforce/label/LightningRichTextAssist.composeText';
import labelFont from '@salesforce/label/LightningRichTextEditor.font';
import labelFontSize from '@salesforce/label/LightningRichTextEditor.fontSize';
import labelFormatBackground from '@salesforce/label/LightningRichTextEditor.formatBackground';
import labelFormatBody from '@salesforce/label/LightningRichTextEditor.formatBody';
import labelFormatFont from '@salesforce/label/LightningRichTextEditor.formatFont';
import labelFormatText from '@salesforce/label/LightningRichTextEditor.formatText';
import labelIndent from '@salesforce/label/LightningRichTextButton.indent';
import labelInsertContent from '@salesforce/label/LightningRichTextEditor.insertContent';
import labelItalic from '@salesforce/label/LightningRichTextButton.italic';
import labelLeftAlign from '@salesforce/label/LightningRichTextButton.leftAlign';
import labelLink from '@salesforce/label/LightningRichTextButton.link';
import labelImage from '@salesforce/label/LightningRichTextButton.image';
import labelLinkCancel from '@salesforce/label/LightningRichTextEditor.linkCancel';
import labelLinkInput from '@salesforce/label/LightningRichTextEditor.linkInput';
import labelLinkSave from '@salesforce/label/LightningRichTextEditor.linkSave';
import labelNumber from '@salesforce/label/LightningRichTextButton.number';
import labelOutdent from '@salesforce/label/LightningRichTextButton.outdent';
import labelRemoveFormatting from '@salesforce/label/LightningRichTextEditor.removeFormatting';
import labelRightAlign from '@salesforce/label/LightningRichTextButton.rightAlign';
import labelStrike from '@salesforce/label/LightningRichTextButton.strike';
import labelUnderline from '@salesforce/label/LightningRichTextButton.underline';
import { LightningElement, unwrap, track, api } from 'lwc';
import lightningQuill from 'lightning/quillLib';
import { normalizeBoolean, getRealDOMId } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import { getFormFactor } from 'lightning/configProvider';
import IMEHandler from './ime';

const { Quill, inputRichTextLibrary } = lightningQuill;
const TOOLBAR_CATEGORIES = {
    FORMAT_TEXT: 'FORMAT_TEXT',
    FORMAT_BACKGROUND: 'FORMAT_BACKGROUND',
    FORMAT_BODY: 'FORMAT_BODY',
    FORMAT_FONT: 'FORMAT_FONT',
    ALIGN_TEXT: 'ALIGN_TEXT',
    INSERT_CONTENT: 'INSERT_CONTENT',
    REMOVE_FORMATTING: 'REMOVE_FORMATTING',
};

const ALLOWED_IMAGE_FORMATS = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
];

const CREATE_LINK_PANEL_WIDTH = 320,
    DEFAULT_FONT_NAME_VALUE = 'default',
    DEFAULT_FONT_SIZE_VALUE = '12px',
    DEFAULT_CATEGORY = 'FORMAT_TEXT',
    SF_DEFAULT_FORMATS = ['table', 'image', 'link', 'header'],
    BUTTON_CLASSNAMES = 'slds-button slds-button_icon-border-filled',
    TOOLBAR_SELECTOR =
        '.slds-rich-text-editor__toolbar > ul li .slds-button, .overflow-menu > ul > li .slds-button';

const i18n = {
    alignText: labelAlignText,
    bold: labelBold,
    bullet: labelBullet,
    centerAlign: labelCenterAlign,
    composeText: labelComposeText,
    font: labelFont,
    fontSize: labelFontSize,
    formatBackground: labelFormatBackground,
    formatBody: labelFormatBody,
    formatFont: labelFormatFont,
    formatText: labelFormatText,
    indent: labelIndent,
    insertContent: labelInsertContent,
    italic: labelItalic,
    leftAlign: labelLeftAlign,
    link: labelLink,
    image: labelImage,
    linkCancel: labelLinkCancel,
    linkInput: labelLinkInput,
    linkSave: labelLinkSave,
    number: labelNumber,
    outdent: labelOutdent,
    removeFormatting: labelRemoveFormatting,
    rightAlign: labelRightAlign,
    strike: labelStrike,
    underline: labelUnderline,
};

function defaults() {
    return [
        {
            category: TOOLBAR_CATEGORIES.FORMAT_TEXT,
            label: i18n.formatText,
            buttons: [
                {
                    label: i18n.bold,
                    iconName: 'utility:bold',
                    format: 'bold',
                },
                {
                    label: i18n.italic,
                    iconName: 'utility:italic',
                    format: 'italic',
                },
                {
                    label: i18n.underline,
                    iconName: 'utility:underline',
                    format: 'underline',
                },
                {
                    label: i18n.strike,
                    iconName: 'utility:strikethrough',
                    format: 'strike',
                },
            ],
        },
        {
            category: TOOLBAR_CATEGORIES.FORMAT_BACKGROUND,
            label: i18n.formatBackground,
            buttons: [],
        },
        {
            category: TOOLBAR_CATEGORIES.FORMAT_BODY,
            label: i18n.formatBody,
            buttons: [
                {
                    label: i18n.bullet,
                    iconName: 'utility:richtextbulletedlist',
                    format: 'list',
                    value: 'bullet',
                },
                {
                    label: i18n.number,
                    iconName: 'utility:richtextnumberedlist',
                    format: 'list',
                    value: 'ordered',
                },
                {
                    label: i18n.indent,
                    iconName: 'utility:richtextindent',
                    format: 'indent',
                    value: '+1',
                },
                {
                    label: i18n.outdent,
                    iconName: 'utility:richtextoutdent',
                    format: 'indent',
                    value: '-1',
                },
            ],
        },
        {
            category: TOOLBAR_CATEGORIES.ALIGN_TEXT,
            label: i18n.alignText,
            buttons: [
                {
                    label: i18n.leftAlign,
                    iconName: 'utility:left_align_text',
                    format: 'align',
                    value: '',
                },
                {
                    label: i18n.centerAlign,
                    iconName: 'utility:center_align_text',
                    format: 'align',
                    value: 'center',
                },
                {
                    label: i18n.rightAlign,
                    iconName: 'utility:right_align_text',
                    format: 'align',
                    value: 'right',
                },
            ],
        },
        {
            category: TOOLBAR_CATEGORIES.INSERT_CONTENT,
            label: i18n.insertContent,
            buttons: [
                {
                    label: i18n.link,
                    iconName: 'utility:link',
                    format: 'link',
                },
                {
                    label: i18n.image,
                    iconName: 'utility:image',
                    format: 'image',
                },
            ],
        },
        {
            category: TOOLBAR_CATEGORIES.REMOVE_FORMATTING,
            label: i18n.removeFormatting,
            buttons: [
                {
                    label: i18n.removeFormatting,
                    iconName: 'utility:remove_formatting',
                    format: 'clean',
                },
            ],
        },
    ];
}

const FONT_LIST = [
    {
        label: 'Salesforce Sans',
        value: 'default',
    },
    {
        label: 'Arial',
        class: 'sans-serif',
        value: 'sans-serif',
    },
    {
        label: 'Courier',
        class: 'courier',
        value: 'courier',
    },
    {
        label: 'Verdana',
        class: 'verdana',
        value: 'verdana',
    },
    {
        label: 'Tahoma',
        class: 'tahoma',
        value: 'tahoma',
    },
    {
        label: 'Garamond',
        class: 'garamond',
        value: 'garamond',
    },
    {
        label: 'Times New Roman',
        class: 'serif',
        value: 'serif',
    },
];

const ALLOWED_SIZES = [
    {
        label: '8',
        value: '8px',
    },
    {
        label: '9',
        value: '9px',
    },
    {
        label: '10',
        value: '10px',
    },
    {
        label: '11',
        value: '11px',
    },
    {
        label: '12',
        value: '12px',
    },
    {
        label: '14',
        value: '14px',
    },
    {
        label: '16',
        value: '16px',
    },
    {
        label: '18',
        value: '18px',
    },
    {
        label: '20',
        value: '20px',
    },
    {
        label: '22',
        value: '22px',
    },
    {
        label: '24',
        value: '24px',
    },
    {
        label: '26',
        value: '26px',
    },
    {
        label: '28',
        value: '28px',
    },
    {
        label: '36',
        value: '36px',
    },
    {
        label: '48',
        value: '48px',
    },
    {
        label: '72',
        value: '72px',
    },
];

const keyCodes = {
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
};

const bindings = {
    // This will overwrite the default binding also named 'tab'
    // which would normally indent
    tab: {
        key: 9,
        shiftKey: false,
        handler() {
            // this will stop quill from preventingDefault
            // and stopping propigation on this event
            // so it will be handled normally
            return true;
        },
    },

    // names are not used, unique to avoid collision
    lightningOutdent: {
        key: 219, // [
        shortKey: true,
        handler() {
            this.quill.format('indent', '-1');
        },
    },

    lightningIndent: {
        key: 221, // ]
        shortKey: true,
        handler() {
            this.quill.format('indent', '+1');
        },
    },
};

// Map for converting the size in <font size=x />
// to an actual pixel value
const FONT_SIZE_MAP = {
    1: '9px',
    2: '11px',
    3: '14px',
    4: '16px',
    5: '22px',
    6: '28px',
    7: '48px',
};

/**
 * Converts a CSS style value to an integer
 * Ex. "100px" -> 100
 * @param {HTMLElement} element - Element from which to retrieve the style
 * @param {String} style - The CSS style to retrieve from the element
 * @return {Integer} - Converted integer value
 */
function getStyleAsInt(element, style) {
    return parseInt(element.style[style], 10);
}

/**
 * A WYSIWYG editor with a customizable toolbar for entering rich text
 */
export default class LightningInputRichText extends LightningElement {
    /*
        Public attributes:
            value               {String}  - The HTML content in the rich text editor
            label               {String}  - Text label for the rich text editor
            labelVisible        {Boolean} - Specifies whether the label is visible or not. The default is false
            placeholder         {String}  - Text that is displayed when the field is empty
            disabledCategories  {List}    - A comma-separated list of button categories to remove from the toolbar
            formats             {List}    - A whitelist of formats. By default, the list is computed based on enabled categories.
                                            The 'table' format is always enabled to support copying and pasting of tables if formats are not provided.
                                            If formats are provided, omitting a format from the list removes the corresponding button
            variant             {String}  - The variant changes the appearance of the toolbar. Accepted variants include bottom-toolbar
            messageWhenBadInput {String}  - Error message that's displayed when valid is false
            customButtons       {Object}
            shareWithEntityId   {String}  - Entity ID to share the image with
            valid               {Boolean} - Specifies whether the editor content is valid. If invalid, the slds-has-error class is added. This value defaults to true
            disabled            {Boolean} - Specifies whether the editor is disabled. This value defaults to false

        Tracked variables:
            valid
            disabled
            linkPanelOpen
            selectedFontValue
            selectedSizeValue
            textColor - Default text color is defined by colorpicker
    */

    @track _valid = true;
    @track _disabled = false;
    @track linkPanelOpen = false;
    @track selectedFontValue = DEFAULT_FONT_NAME_VALUE;
    @track selectedSizeValue = DEFAULT_FONT_SIZE_VALUE;
    @track quillNotReady = true;
    @track textColor;

    /**
     * The label of the rich text editor.
     * @type {string}
     */
    @api label;

    /**
     * If present, the label on the rich text editor is visible.
     * @type {boolean}
     * @default false
     */
    @api labelVisible = false;

    /**
     * Text that is displayed when the field is empty, to prompt the user for a valid entry.
     * @type {string}
     *
     */
    @api placeholder;

    /**
     * A comma-separated list of button categories to remove from the toolbar.
     * @type {list}
     *
     */
    @api disabledCategories = '';

    /**
     * A whitelist of formats. By default, the list is computed based on enabled categories.
     * The 'table' format is always enabled to support copying and pasting of tables if formats are not provided.
     * @type {list}
     */
    @api formats = '';

    /**
     * The variant changes the appearance of the toolbar. Accepted variant is bottom-toolbar which causes
     * the toolbar to be displayed below the text box.
     * @type {string}
     *
     */
    @api variant;

    /**
     * Error message to be displayed when invalid input is detected.
     * @type {string}
     *
     */
    @api messageWhenBadInput;

    /**
     * Reserved for internal use. Custom buttons to add to the toolbar.
     * @type {object}
     *
     */
    @api customButtons;

    /**
     * Entity ID to share the image with.
     * @type {string}
     *
     */
    @api shareWithEntityId;

    /**
     * The HTML content in the rich text editor.
     * @type {string}
     *
     */
    @api
    get value() {
        return this.internalValue;
    }
    set value(val) {
        // Change internalValue and paste into editor only if
        // the contents are different from the previously saved value
        if (val && this.internalValue !== val) {
            this.internalValue = inputRichTextLibrary.cleanInput(val);
            if (!this.internalValue) {
                // eslint-disable-next-line no-console
                console.warn(
                    'No html sanitizer found for rich text, make sure to sanitize rich text before using lightning-input-rich-text. Using raw html value'
                );
                this.internalValue = val;
            }
            if (this.quill) {
                this.quill.clipboard.dangerouslyPasteHTML(this.internalValue);
            }
        }
    }

    /**
     * Specifies whether the editor content is valid. If invalid, the slds-has-error class is added. This value defaults to true.
     * @type {boolean}
     * @default true
     */
    @api
    get valid() {
        return this._valid;
    }
    set valid(value) {
        this._valid = normalizeBoolean(value);
        if (this.quill) {
            const rteElement = this.template.querySelector(
                '.slds-rich-text-editor'
            );
            const editorElement = this.quill.root;
            if (!this.valid) {
                rteElement.classList.add('slds-has-error');
                editorElement.setAttribute(
                    'aria-describedby',
                    this.errorMessageId
                );
            } else {
                rteElement.classList.remove('slds-has-error');
                editorElement.removeAttribute('aria-describedby');
            }
        }
    }

    /**
     * If present, the editor is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * Sets focus on the rich text editor.
     */
    @api
    focus() {
        // Focus on inputRichText should activate editor.
        if (!this.quill) {
            this.activateEditor();
        }
        this.quill.root.focus();
    }

    /**
     * Removes focus from the rich text editor.
     */
    @api
    blur() {
        if (this.quill) {
            this.quill.root.blur();
        }
    }

    quill; // Quill api
    initialRender = true; // Guard for intializing during first render cycle
    internalValue; // Editor contents to send in the change event
    linkValue = 'http://'; // Value to show in the input of link insertion panel
    fontMenus = {
        fontList: FONT_LIST,
        sizeList: ALLOWED_SIZES,
    };

    get showLinkValue() {
        return this.linkValue;
    }

    get isBottomToolbar() {
        return this.variant === 'bottom-toolbar';
    }

    get isColorpickerVisible() {
        return this.formats.indexOf('color') > -1;
    }

    get isFontMenusVisible() {
        if (
            this.disabledCategories.indexOf(TOOLBAR_CATEGORIES.FORMAT_FONT) !==
            -1
        ) {
            return false;
        }
        // If custom formats are specified,
        // hide the fonts menus if font is not a part
        // of the custom formats
        if (this.formats.length > 0) {
            if (this.formats.indexOf('font') === -1) {
                return false;
            }
        }
        return true;
    }

    get menuDropdownAlignment() {
        if (this.isBottomToolbar) {
            return 'bottom-left';
        }
        return null;
    }

    get errorMessage() {
        return this.messageWhenBadInput;
    }

    get i18n() {
        return i18n;
    }

    get labelId() {
        return this.uniqueLabelId;
    }

    get errorMessageId() {
        const msg = this.template.querySelector('[data-error-message]');
        return getRealDOMId(msg);
    }

    get toolbarAriaLabel() {
        return this.disabled ? 'disabled' : '';
    }

    get renderLabel() {
        return this.labelVisible || this.label;
    }

    get computedLabel() {
        return this.label ? this.label : this.i18n.composeText;
    }

    get computedLabelClass() {
        const classnames = classSet('slds-form-element__label');
        return classnames
            .add({ 'slds-assistive-text': !this.labelVisible })
            .toString();
    }

    /**
     * Compute the complete set of buttons to be displayed and
     * add appropriate class names to each button
     *  - If the formats attribute is specified:
     *      Filter out buttons which do not match the specified formats
     *  - Merge the custom buttons with this filtered button set
     *  - Remove an entire category if:
     *      a. There are no remaining buttons in that category
     *      b. If it is a disabled category
     *  - Add the right class names to each remaining button
     * @returns {Object} Filtered set categories and buttons
     */
    get computedCategories() {
        // If custom formats are specified,
        // filter out the buttons which do not match
        // the specified custom formats, within each category
        const customFormats = !!this.formats.length;
        const formatList = this.formats;
        let categories = defaults();
        if (customFormats) {
            categories.forEach(cat => {
                cat.buttons = cat.buttons.filter(button =>
                    formatList.includes(button.format)
                );
            });
        }

        // Merge custom buttons after filtering out default buttons which
        // do not match custom formats, so that the custom buttons may be
        // included even when the custom formats do not specify them
        categories = this.mergeCustomToolbarButtons(categories);

        // only keep categories that have buttons and not disabled
        categories = categories.filter(
            cat =>
                cat.buttons &&
                cat.buttons.length > 0 &&
                !this.disabledCategories.includes(cat.category)
        );

        // Add additional attributes to each button
        categories.forEach(cat => {
            cat.buttons.forEach(button => {
                // add classes
                if (button.format) {
                    button.computedClass = `${BUTTON_CLASSNAMES} ql-${
                        button.format
                    }`;
                } else {
                    button.computedClass = BUTTON_CLASSNAMES;
                }

                // add key for iterations
                button.key = button.label + button.value;
            });
        });

        return categories;
    }

    /**
     * Merge the provided custom buttons with the existing set
     * If custom buttons are provided:
     *      Check if the custom button's category exists in the existing set
     *          If yes, add the button(s) into that category
     *          If no, add that entire category along with button(s) into the existing set
     *      If custom buttons' categories are not specified, add buttons to the default category
     * @param {Array} buttonSet - Set of filtered buttons;
     * If custom formats are provided, this set consists of default
     * buttons with those buttons removed, which do not match the format
     * Else, it is the default set of buttons
     * @returns {Array} Returns the merged set of buttons
     */
    mergeCustomToolbarButtons(buttonSet) {
        if (this.customButtons) {
            let existingCategory = false;
            this.customButtons.forEach(customButton => {
                existingCategory = false;
                buttonSet.forEach(cat => {
                    // If the custom button is of an existing category,
                    // add the custom button to the existing button set under that category
                    // If a category for the custom button was not given
                    // add the custom button into the default (Format Text) category
                    if (
                        !existingCategory &&
                        (cat.category === customButton.category ||
                            (!customButton.category &&
                                cat.category === DEFAULT_CATEGORY))
                    ) {
                        existingCategory = true;
                        cat.buttons = cat.buttons.concat(
                            unwrap(customButton.buttons)
                        );
                    }
                });
                // If the user button is not part of an existing category,
                // append the button info along with category information
                // to the complete set of buttons
                if (!existingCategory) {
                    buttonSet = buttonSet.concat(unwrap(customButton));
                }
            });
        }
        return buttonSet;
    }

    /**
     * If it is a bottom-toolbar variant, add the appropriate
     * slds class to the toolbar
     */
    setupToolbar() {
        if (this.isBottomToolbar) {
            const toolbar = this.template.querySelector(
                '.slds-rich-text-editor__toolbar'
            );
            toolbar.classList.add('slds-rich-text-editor__toolbar_bottom');
        }
    }

    /**
     * For initial set up of buttons
     * We set the tabindex of every button to -1,
     * except the first button, which is set to 0
     *
     * This is so that tabbing through buttons is disabled
     * Instead ,users will be able to tab onto one button and use
     * arrow keys to navigate to other buttons
     */
    setupButtons() {
        const buttonList = this.template.querySelectorAll(TOOLBAR_SELECTOR);
        if (buttonList.length > 0) {
            this.setButtonTabindex(buttonList, 0);
        }
    }

    /**
     * Helper function to set tabindexes of all buttons to -1,
     * and to set the tabindex of the specified index to 0
     * @param {Array} buttonList - List of buttons to iterate through
     * @param {Number} index - Index of button whose tabindex to set to 0
     */
    setButtonTabindex(buttonList, index) {
        buttonList.forEach(button => {
            button.setAttribute('tabindex', -1);
        });

        buttonList[index].setAttribute('tabindex', 0);
    }

    /**
     * Attach custom handlers to the custom buttons
     * If custom buttons have been provided:
     *      Compare the custom button's format and the rendered
     *      toolbar button's quill class
     *      If they match, attach the provided custom handler as
     *      an onclick handler for that button
     */
    attachCustomButtonHandlers() {
        if (this.customButtons) {
            const renderedButtons = this.template.querySelectorAll(
                TOOLBAR_SELECTOR
            );
            this.customButtons.forEach(cat => {
                cat.buttons.forEach(button => {
                    renderedButtons.forEach(renderedButton => {
                        if (
                            renderedButton.classList.contains(
                                'ql-' + button.format
                            )
                        ) {
                            // Pass in the inputRichText component so that the handler
                            // has access to the quill instance
                            renderedButton.addEventListener(
                                'click',
                                button.handler
                            );
                        }
                    });
                });
            });
        }
    }

    /**
     * Add slds classes to the editor generated on initialization of Quill
     * @param {HTMLElement} qlEditor - Editor element generated from the
     * initialization of Quill
     */
    addInitialClassesAndAttributesToEditor(qlEditor) {
        qlEditor.classList.add('slds-rich-text-area__content');
        qlEditor.classList.add('slds-grow');
        qlEditor.classList.add('slds-text-color_weak');

        this.setAriaAttributesOnEditor(qlEditor);
    }

    /**
     * Add appropriate aria attributes based on values of label and labelVisible
     * @param {HTMLElement} qlEditor - Editor element on which to set aria attributes
     */
    setAriaAttributesOnEditor(qlEditor) {
        if (this.labelVisible || this.label) {
            qlEditor.setAttribute('aria-labelledby', this.uniqueLabelId);
        } else {
            qlEditor.setAttribute('aria-label', this.i18n.composeText);
        }
    }

    /**
     * Compute the list of formats to be passed in to the Quill configuration
     * If the formats attributes is specified, use that list
     * If formats are not specified:
     *      a. We set the formats of the buttons as the
     *         list of formats to pass into the Quill config
     *      b. Add font menus to list if it is not a disabled category
     * Add the Salesforce default formats to the filtered list - these are
     * on by default
     * @returns {Array} Final list of formats to pass into the Quill config
     */
    computeFormats() {
        let computedFormats = [];
        // If custom formats are specified, don't do anything
        // we will use this list in the quill config
        if (this.formats.length > 0) {
            return this.formats;
        }

        // If custom formats are not specified, we should set the
        // formats of the buttons as the formats list in the quill config
        // Visible buttons have already been calculated by the time
        // this stage is reached
        this.computedCategories.forEach(cat => {
            cat.buttons.forEach(button => {
                if (button.format) {
                    // to make sure we don't have duplicates
                    if (computedFormats.indexOf(button.format) === -1) {
                        computedFormats.push(button.format);
                    }
                }
            });
        });
        // add font separately
        if (this.isFontMenusVisible) {
            computedFormats.push('font');
            computedFormats.push('size');
        }
        computedFormats = computedFormats.concat(SF_DEFAULT_FORMATS);
        return computedFormats;
    }

    /**
     * This is for conversion from <font size="">
     * to a quill size format. The font tag size is defined as
     * an integer between 1-7 with 3 being "normal" or default
     * there is no specified meaning to these sizes, so this is
     * a fairly arbitrary mapping based on experiments in the inspector
     * with font tags and slds
     * @param {Number} fontSize - Refers to the value of the size attribute
     * in a font tag
     * @returns {Number} - Value that corresponds to the right pixel size
     * in the FONT_SIZE_MAP to be rendered
     */
    getNormalizedFontSize(fontSize) {
        const size = fontSize || 3;
        const relativeSize = /^[+-]\d/.test(size)
            ? Number(size) + 3
            : Number(size);
        let normalizedSize = relativeSize > 7 ? 7 : relativeSize;
        normalizedSize = relativeSize < 1 ? 1 : normalizedSize;
        return normalizedSize;
    }

    /**
     * Add matchers to quill so that particular tags can be converted from
     * one to another
     * Conversions:
     *      <font>    -> <span>
     *      <strike>  -> <s>
     *      <tt>      -> <code>
     *      <acronym> -> <abbr>
     *      <table>   -> {tableBlot}
     *      text-decoration
     *          underline    -> <underline>
     *          line-through -> <strike>
     */
    addTagMatchers() {
        // Convert font tags to spans
        this.quill.clipboard.addMatcher('font', (node, delta) => {
            let size = node.getAttribute('size');

            // map <font> integers to px sizes
            if (size) {
                size = FONT_SIZE_MAP[this.getNormalizedFontSize(size)];
            }
            // size may still be undefined, that means it won't be applied
            // so this is fine
            const nodeFormats = {
                font: node.getAttribute('face'), // trust the defined font face
                size,
                color: node.getAttribute('color'), // color is css compatible
            };
            return delta.compose(
                new Quill.Delta().retain(delta.length(), nodeFormats)
            );
        });

        // convert <strike> to <s>
        this.quill.clipboard.addMatcher('strike', (node, delta) => {
            return delta.compose(
                new Quill.Delta().retain(delta.length(), { strike: true })
            );
        });

        // convert <tt> to <code>
        this.quill.clipboard.addMatcher('tt', (node, delta) => {
            return delta.compose(
                new Quill.Delta().retain(delta.length(), { code: true })
            );
        });

        // convert <acronym> to <abbr>
        this.quill.clipboard.addMatcher('acronym', (node, delta) => {
            const title = node.getAttribute('title');
            return delta.compose(
                new Quill.Delta().retain(delta.length(), {
                    abbr: title ? title : true,
                })
            );
        });

        this.quill.clipboard.addMatcher(
            'span[style*=text-decoration]',
            (node, delta) => {
                const computedStyle = getComputedStyle(node) || node.style;

                const underline = computedStyle.textDecoration.match(
                    /underline/
                );
                const strike = computedStyle.textDecoration.match(
                    /line-through/
                );
                return delta.compose(
                    new Quill.Delta().retain(delta.length(), {
                        underline: underline ? true : false,
                        strike: strike ? true : false,
                    })
                );
            }
        );

        // This matcher detects tables, and if tables are disabled, returns a normal
        // delta, otherwise it applies the table format
        this.quill.clipboard.addMatcher('table', node => {
            if (this.formats.indexOf('table') === -1) {
                // convert creates a delta from html, in this case the html
                // *inside* the <table>
                return this.quill.clipboard.convert(node.innerHTML); // eslint-disable-line lwc/no-inner-html
            }
            const tableBlot = Quill.import('formats/table');
            return new Quill.Delta().insert({
                table: tableBlot.value(node),
            });
        });
    }

    /**
     * Initialize a new Quill instance and attach the required
     * handlers for various events
     *      1. Compute information required for configuring Quill
     *      2. Initialize Quill by passing in the computed configuration
     *      3. Add slds classes to editor element generated on init of Quill
     *      4. Add handlers for various events:
     *          a. on text change - dispatch change event
     *          b. on selection change update font and size menu values
     *          c. on double click, open link insertion panel if target is anchor
     *          d. attach custom handler for clicking on link insert button
     */
    initializeQuill() {
        // Passing in the proxy object causes Quill to error out on
        // initialization - so unwrap the editor and toolbar elements
        const container = unwrap(this.template.querySelector('.editor'));
        const toolbar = unwrap(
            this.template.querySelector('.slds-rich-text-editor__toolbar')
        );
        const computedFormats = this.computeFormats();
        const placeholder = this.placeholder;

        // Quill Configuration: https://quilljs.com/docs/configuration/
        const quillConfig = {
            modules: {
                toolbar,
                keyboard: {
                    bindings,
                },
            },
            formats: computedFormats,
            placeholder,
        };

        this.quill = new Quill(container, quillConfig);
        const editor = this.quill.root;

        this.addInitialClassesAndAttributesToEditor(this.quill.root);

        const imeHandler = new IMEHandler(this);
        imeHandler.initializeEmptyCharHack();

        // If the editor is 'blank' it still contains a new
        // line (<p><br></p>); check if it is in fact blank
        // If so, we just use an empty string for the value
        // If not blank, clean the editor's contents
        // Fire a change event with the cleaned content as the value
        this.quill.on('text-change', () => {
            let cleanedContent = '';

            if (!this.quill.editor.isBlank()) {
                const editorContents = this.quill.scroll.domNode.innerHTML; // eslint-disable-line lwc/no-inner-html
                cleanedContent = inputRichTextLibrary.cleanOutput(
                    editorContents
                );
            }

            // make sure we don't send the hacky empty characters back to the user
            cleanedContent = imeHandler.clearEmptyChars(cleanedContent);

            this.internalValue = cleanedContent;
            this.dispatchChangeEvent();
        });

        // Update the font, font size menu display values and button pressed state
        // depending on where the cursor is at the time
        this.quill.on('selection-change', range => {
            let format = null;
            if (range) {
                // If no range, nothing is selected
                format = this.quill.getFormat(range);
                this.updateFontMenu(format);
                this.updateSizeMenu(format);
            }
            this.updateButtonPressedState(range);
        });

        // Update button pressed state depending on what the user is typing.
        this.quill.on('scroll-optimize', () => {
            requestAnimationFrame(() => {
                const range = this.quill.selection.getRange()[0];
                this.updateButtonPressedState(range);
            });
        });

        // If user double clicks on a link node in the editor,
        // open the link insertion panel with the href value
        // populated in the input
        this.quill.scroll.domNode.addEventListener('dblclick', clickEvt => {
            const linkNode = this.getEnclosingLinkNode(clickEvt.target);
            if (linkNode) {
                this.expandSelectionToNode(linkNode);
                this.openLinkPanel(linkNode.getAttribute('href'));
            }
        });

        this.quill.getModule('toolbar').addHandler('link', () => {
            this.linkButtonClickHandler();
        });

        this.quill.getModule('toolbar').addHandler('image', () => {
            this.imageButtonClickHandler();
        });

        // Add tag matchers
        this.addTagMatchers();

        // Set initial value passed in to the editor
        if (this.internalValue) {
            this.quill.clipboard.dangerouslyPasteHTML(this.internalValue);
        }

        // When the editor is focused, set the slds-has-focus class and
        // dispatch focus event to execute onfocus method thats passed in
        editor.addEventListener('focus', () => {
            const rteElement = this.template.querySelector(
                '.slds-rich-text-editor'
            );
            rteElement.classList.add('slds-has-focus');
            this.dispatchEvent(new CustomEvent('focus'));
        });

        // When the editor is blurred, remove the slds-has-focus class and
        // dispatch blur event to execute onblur method thats passed in
        editor.addEventListener('blur', () => {
            const rteElement = this.template.querySelector(
                '.slds-rich-text-editor'
            );
            rteElement.classList.remove('slds-has-focus');
            this.dispatchEvent(new CustomEvent('blur'));
        });

        // If a file was pasted and is of the image formats supported,
        // proceed to upload the image and insert into the editor
        editor.addEventListener('paste', pasteEvt => {
            const clipboardData = pasteEvt.clipboardData;
            if (
                clipboardData &&
                clipboardData.files &&
                clipboardData.files.length &&
                clipboardData.types.indexOf('text/html') === -1
            ) {
                const pastedFile = clipboardData.files[0];
                if (ALLOWED_IMAGE_FORMATS.indexOf(pastedFile.type) > -1) {
                    pasteEvt.preventDefault();
                    pasteEvt.stopPropagation();
                    inputRichTextLibrary.uploadAndInsertSelectedFile(
                        this.quill,
                        pastedFile,
                        this.shareWithEntityId
                    );
                }
            }
        });
    }

    // Set Editor state to Disabled:
    // Disable Buttons, Comboboxes and the Editor
    /**
     * Set editor's state depending on the disabled attribute value
     * If disabled is set to true:
     *      a. Disable each button
     *      b. Disable the editor
     * If disabled is false:
     *      a. Ensure buttons are not disabled
     *      b. Enable the editor
     * Note: Font and font size menus are disabled directly
     *       based on the disabled attribute
     */
    setEditorAndButtonState() {
        const buttonList = this.template.querySelectorAll(TOOLBAR_SELECTOR);
        if (this.disabled) {
            buttonList.forEach(button => {
                button.setAttribute('disabled', true);
            });
            if (this.quill) {
                this.quill.disable();
            }
        } else {
            buttonList.forEach(button => {
                button.removeAttribute('disabled');
            });
            if (this.quill) {
                this.quill.enable();
            }
        }
    }

    /**
     * Set appropriate error classes based on the valid attribute value
     * If valid attribute is false:
     *      a. Set the slds error class on the editor element
     *      b. Unhide the element containing the error message
     *      c. Set aria-describedby to point to error message element
     */
    setEditorValidityState() {
        // Checking validity to append error class
        if (!this.valid) {
            // Add the error class on the editor
            const rteElement = this.template.querySelector(
                '.slds-rich-text-editor'
            );
            rteElement.classList.add('slds-has-error');
            // Set editor's aria-describedby to point to error message element
            const editorElement = this.quill.root;
            editorElement.setAttribute('aria-describedby', this.errorMessageId);
        }
    }

    /**
     * Actions to be taken on rerender if the link insertion panel is open or closed
     * If the create link panel is opened:
     *      1. Correctly position the create link panel and set focus to its input
     *      2. Attach a document click handler to handle close on click out on the
     *         create link panel
     * If the create link panel is closed:
     *      Remove the document click handler
     */
    handleLinkPanelOpen() {
        const that = this;
        // Position the create link panel
        if (this.linkPanelOpen) {
            const createLinkPanel = this.template.querySelector(
                '.slds-popover__body'
            );
            const buttonList = this.template.querySelectorAll(TOOLBAR_SELECTOR);
            this.calculateLinkPanelPositioning(createLinkPanel, buttonList);
            this.template.querySelector('.link-input').focus();

            // Stop propagation of this event or the document click handler
            // will get executed immediately and close the create link panel
            // Attach document click handler for close on click out of the
            // create link panel
            window.event.stopPropagation();
            this._documentClickHandler = function(e) {
                that.documentClickHandler(that, e);
            };
            document.addEventListener('click', this._documentClickHandler);
        } else {
            // Remove the document click handler when the link panel is closed
            document.removeEventListener('click', this._documentClickHandler);
        }
    }

    /**
     * Generate a unique id for the errormessage and label
     */
    connectedCallback() {
        this.classList.add('slds-form-element__control');
    }

    get uniqueLabelId() {
        const label = this.template.querySelector('[data-label]');
        return getRealDOMId(label);
    }

    activateEditor(e) {
        // Initialize the Quill instance on initial render
        if (this.initialRender) {
            this.setupToolbar();
            this.setupButtons();
            this.attachCustomButtonHandlers();
            this.initializeQuill();
            this.setEditorValidityState();
            this.initialRender = false;
            this.setEditorAndButtonState();
            this.handleLinkPanelOpen();
            this.quillNotReady = false;
            if (e) {
                const shouldFocus =
                    e.target.classList.contains('standin') ||
                    e.target.tagName === 'lightning-formated-rich-text';
                if (shouldFocus) {
                    this.quill.setSelection(this.quill.getLength());
                }
            }
        }
    }

    /**
     * On the first render cycle:
     *      1. Set up button tabindexes to be accessible
     *      2. Attach custom handlers for custom buttons
     *      3. Initialize the Quill instance
     * On every rerender:
     *      1. Set editor's disabled state based on disabled attribute
     *      2. Set editor's valid state based on the valid attribute
     *      3. Handle cases when create link panel is opened or closed
     */
    renderedCallback() {
        this.setEditorAndButtonState();
        this.handleLinkPanelOpen();
    }

    /* *******************************
        Keyboard Button Navigation
    ******************************** */

    /**
     * Move to the next button on the toolbar
     * Wrap around to the first button if currently on last
     * Move to next button by:
     *      1. Setting tabindex to 0 on the new button and -1 on the rest
     *      2. Setting focus on the new button
     * @param {Array} buttonList - Array of toolbar button elements
     * @param {Number} currentIndex - Index on which focus is on currently
     */
    moveToNextButton(buttonList, currentIndex) {
        // Determine next index to move to
        let newIndex = currentIndex + 1;
        if (newIndex === buttonList.length) {
            newIndex = 0;
        }

        // Set tabindex 0 on new button moved to and -1 on rest
        this.setButtonTabindex(buttonList, newIndex);

        buttonList[newIndex].focus();
    }

    /**
     * Move to the previous button on the toolbar
     * Wrap around to the last button if currently on first
     * Move to previous button by:
     *      1. Setting tabindex to 0 on the new button and -1 on the rest
     *      2. Setting focus on the new button
     * @param {Array} buttonList - Array of toolbar button elements
     * @param {Number} currentIndex - Index on which focus is on currently
     */
    moveToPreviousButton(buttonList, currentIndex) {
        // Determine previous index to move to
        let newIndex = currentIndex - 1;
        if (newIndex === -1) {
            newIndex = buttonList.length - 1;
        }

        // Set tabindex 0 on new button moved to and -1 on rest
        this.setButtonTabindex(buttonList, newIndex);

        buttonList[newIndex].focus();
    }

    /**
     * Navigate the toolbar buttons based on the keyboard input:
     *      1. Determine the current button by capturing event's target
     *      2. If user pressed the right arrow, move to the next button in toolbar
     *      3. If user pressed the left arrow, move to the previous button in toolbar
     * @param {Event} evt - Keyboard event to retrieve target and keyCode from
     */
    navigateToolbar(evt) {
        this.activateEditor();
        const event = evt || window.event;
        const target = event.target;
        const buttonList = Array.prototype.slice.call(
            this.template.querySelectorAll(TOOLBAR_SELECTOR)
        );

        if (target && target.classList.contains('slds-button')) {
            const currentIndex = buttonList.indexOf(target);
            if (currentIndex === -1) {
                return; // somehow the button that caught the event is not in the toolbar; ignore
            }

            if (event.keyCode === keyCodes.right) {
                this.moveToNextButton(buttonList, currentIndex);
            }
            if (event.keyCode === keyCodes.left) {
                this.moveToPreviousButton(buttonList, currentIndex);
            }
        }
    }

    /* ***********************************
         Inline image insertion handling
       *********************************** */

    /**
     * 1. Load the browser's native file selector
     * 2. Upload the selected file
     * 3. Insert the uploaded image into the editor
     */
    imageButtonClickHandler() {
        this.loadNativeFileSelector(fileList => {
            inputRichTextLibrary.uploadAndInsertSelectedFile(
                this.quill,
                fileList[0],
                this.shareWithEntityId
            );
        });
    }

    /**
     * 1. Load the browser's native file selector
     *     a. File selector will only show files of certain file types
     *     b. Supported file types - png, jpg, jpeg, gif
     * 2. Execute callback with the file list as param after a file has been selected
     * @param {Function} callback - Callback to be executed after file selection
     */
    loadNativeFileSelector(callback) {
        const container = document.createDocumentFragment();
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.accept = this.ALLOWED_IMAGE_FORMATS;
        input.onchange = function() {
            callback(this.files);
        };

        container.appendChild(input);
        input.click();
    }

    /* ***************************
         Link insertion handling
       *************************** */

    /**
     * Custom handler for onclick of link insertion button
     * 1. Get the text selected by user to insert a link on
     * 2. Get the formatting already present on the selected text
     * 3. If selected text already has a link format on it:
     *     a. If length of selected text is 0
     *         i.  Expand the selection length to the enclosing anchor node
     *         ii. Open create link panel with href value populated in input
     *     b. If length of selected text is more than 0
     *         i. Remove the link formatting from that selection
     * 4. If selected text does not have a link format on it:
     *     a. Open create link panel with 'http://' populated in input
     */
    linkButtonClickHandler() {
        const quillApi = this.quill;
        const selection = quillApi.getSelection();
        const format = quillApi.getFormat();
        quillApi.focus();

        if (format.link) {
            if (selection.length === 0) {
                // when cursor is on a link with no selection, show edit panel
                const nodeOnCursor = quillApi.getLeaf(selection.index)[0]
                    .domNode;
                const linkNode = this.getEnclosingLinkNode(nodeOnCursor);
                this.expandSelectionToNode(linkNode);
                this.openLinkPanel(linkNode.getAttribute('href'));
            } else {
                // when a link is selected, unlink it
                quillApi.format('link', false);
            }
        } else {
            this.openLinkPanel();
        }
    }

    /**
     * Update the link value to be saved as user types in create link panel input
     * @param {Event} event - Keyboard event to detect value of input
     */
    handleLinkValueChange(event) {
        event.stopPropagation();
        // When pressing ESC after some input, a change evt gets fired too
        // During this case, detail doesn't exist and there is no change in value
        if (event.detail) {
            this.linkValue = event.detail.value;
        }
    }

    /**
     * Open the create link panel with the value of link already set
     * on the selection or the default value if no value is set
     * @param {String} value - Value to populate in create link panel input
     */
    openLinkPanel(value) {
        this.linkValue = value ? value : 'http://';
        this.linkPanelOpen = true;
    }

    /**
     * Setting linkPanelOpen will trigger a rerender cycle,
     * causing the create link panel to close is value is set to false
     */
    closeLinkPanel() {
        this.linkValue = 'http://';
        this.linkPanelOpen = false;
    }

    /**
     * Set the text selection's format to link type,
     * with the href value being the value typed in by
     * the user in the create link panel input box
     */
    saveLink() {
        const quillApi = this.quill;
        const selection = quillApi.getSelection();
        quillApi.setSelection(selection);
        quillApi.format('link', this.linkValue);
        this.closeLinkPanel();
    }

    /**
     * Close create link panel without saving
     */
    cancelLink() {
        this.closeLinkPanel();
    }

    /**
     * Calculate and position the create link panel correctly based on the editor's bounds
     * 1. Attempt to align the panel's center with the insert link button's center
     * 2. If panel's right edge goes past the editor's right edge, align both the right edges
     * 3. If panel's left edge goes past the editor's left edge, align both the left edges
     * 4. Vertically position the panel based on the toolbar's position
     * @param {HTMLElement} createLinkPanel -
     */
    calculateLinkPanelPositioning(createLinkPanel) {
        const linkButton = this.template.querySelector('.ql-link');
        const toolbar = this.template.querySelector('.ql-toolbar');
        createLinkPanel.style.position = 'absolute';
        createLinkPanel.style.width = CREATE_LINK_PANEL_WIDTH + 'px';

        // Horizontal Positioning of Create Link Panel:

        // Align the center of the panel with the center of the button
        const linkButtonCenter =
            linkButton.offsetLeft + linkButton.offsetWidth / 2;
        createLinkPanel.style.left =
            linkButtonCenter - CREATE_LINK_PANEL_WIDTH / 2 + 'px';

        const createLinkPanelLeft = getStyleAsInt(createLinkPanel, 'left');
        const createLinkPanelWidth = getStyleAsInt(createLinkPanel, 'width');

        // If panel is going out of the editor/toolbar on the right, position the right
        // of the panel to the right of the editor/toolbar
        if (createLinkPanelLeft + createLinkPanelWidth > toolbar.offsetWidth) {
            const diff =
                createLinkPanelLeft +
                createLinkPanelWidth -
                toolbar.offsetWidth;
            createLinkPanel.style.left = createLinkPanelLeft - diff + 'px';
        }

        // If panel is going out of the editor/toolbar on the left, position the left
        // of the panel to the left of the editor/toolbar
        if (getStyleAsInt(createLinkPanel, 'left') < toolbar.offsetLeft) {
            createLinkPanel.style.left = toolbar.offsetLeft + 'px';
        }

        // Vertical Positioning of Create Link Panel
        if (this.variant === 'bottom-toolbar') {
            createLinkPanel.style.top =
                toolbar.offsetTop - createLinkPanel.offsetHeight + 'px';
        } else {
            createLinkPanel.style.top =
                toolbar.offsetTop + toolbar.offsetHeight + 'px';
        }
    }

    /**
     * Get the enclosing link node.
     * Search upward through parentNode.
     *
     * @param {Object} node - node of which to find enclosing node
     * @returns {Object} returns the enclosing link node
     */
    getEnclosingLinkNode(node) {
        const quillApi = this.quill;
        const endNode = quillApi.scroll.domNode;
        let currentNode = node;
        while (currentNode && currentNode !== endNode) {
            if (currentNode.tagName === 'A') {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return null;
    }

    /**
     * Expand selection to the whole node
     * when selection only covers the node partially
     *
     * @param {Object} node - node of which to expand selection
     */
    expandSelectionToNode(node) {
        const quillApi = this.quill;
        const blot = quillApi.constructor.find(node);
        if (blot) {
            quillApi.focus();
            quillApi.setSelection(quillApi.getIndex(blot), blot.length());
        }
    }

    /**
     * Handle the ENTER and ESC keys appropriately:
     *  1. Handle ENTER key to save the input value
     *  2. Handle ESC key to close the create link panel
     *
     * @param {Event} evt Keyboard event to detect and handle the key pressed
     */
    linkKeyboardPress(evt) {
        this.activateEditor();
        let handled = false;
        if (evt.keyCode === keyCodes.enter) {
            this.saveLink();
            handled = true;
        } else if (evt.keyCode === keyCodes.escape) {
            this.closeLinkPanel();
            handled = true;
        }

        // If the events are handled,
        // let them die here
        if (handled) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    /**
     * Event handler for click - for close on click out
     * @param {Object} self - Reference of the inputRichText component
     * @param {Event} e - Click event
     */
    documentClickHandler(self, e) {
        const createLinkPanel = self.root.querySelector('.slds-popover');
        const event = e || window.event;
        const target = event.target || event.srcElement;
        const clickedInside = createLinkPanel.contains(target);
        if (createLinkPanel && !clickedInside) {
            self.closeLinkPanel();
        }
    }

    /**
     * Set the format of the text to font selected from the font dropdown
     * If user selects the default font, we do not set a font name when
     * formatting the text
     * Set the selected font so the font menu displays the right value
     * @param {Event} fontChangeEvt - Event fired by dropdown combobox
     */
    selectFont(fontChangeEvt) {
        fontChangeEvt.stopPropagation();
        const selectFont = fontChangeEvt.detail.value;
        let formatFont = selectFont;
        if (formatFont === DEFAULT_FONT_NAME_VALUE) {
            // We don't want quill to set the font name to 'default'
            formatFont = '';
        }
        const quillApi = this.quill;
        quillApi.focus();
        quillApi.format('font', formatFont);
        this.selectedFontValue = selectFont;
    }

    /**
     * Set the format of the text to font size selected from the dropdown
     * @param {Event} sizeChangeEvt - Event fired by dropdown combobox
     */
    selectSize(sizeChangeEvt) {
        sizeChangeEvt.stopPropagation();
        const selectSize = sizeChangeEvt.detail.value;
        const quillApi = this.quill;
        quillApi.focus();
        quillApi.format('size', selectSize);
        this.selectedSizeValue = selectSize;
    }

    /**
     * Update the value shown by the font dropdown based on cursor location
     * @param {Object} format - Format of the selected text
     */
    updateFontMenu(format) {
        const newFont =
            format && format.font ? format.font : DEFAULT_FONT_NAME_VALUE;
        this.selectedFontValue = newFont;
    }

    /**
     * Update the value shown by the font size dropdown based on cursor location
     * @param {Object} format - Format of the selected text
     */
    updateSizeMenu(format) {
        const newSize =
            format && format.size ? format.size : DEFAULT_FONT_SIZE_VALUE;
        this.selectedSizeValue = newSize;
    }

    /**
     * Whenever the color changes, it will trigger quill API color change
     * @param {Object} event - change event with text color from colorpicker.
     */
    handleColorUpdate(event) {
        const quillApi = this.quill;
        this.textColor = event.detail.color;
        quillApi.format('color', this.textColor);
    }

    /**
     * Whenever the quill state changes, update each button's pressed state based on the format of given range.
     * @param {Object} range - text range from quill.
     */
    updateButtonPressedState(range) {
        const buttonList = this.template.querySelectorAll(TOOLBAR_SELECTOR);
        const formats = range ? this.quill.getFormat(range) : {};
        buttonList.forEach(button => {
            if (button) {
                const { format } = button.dataset;
                const value = button.getAttribute('value');
                let isActive = false;
                if (value === null) {
                    isActive = !!formats[format];
                } else if (value === '' && format === 'align') {
                    isActive = !formats[format];
                } else {
                    isActive = formats[format] === value;
                }
                button.classList.toggle('slds-is-selected', isActive);
                button.setAttribute('aria-pressed', isActive);
            }
        });
    }

    /**
     * Check if the current device is desktop or not.
     * @returns {boolean} true if its desktop, false otherwise.
     */
    get isDesktop() {
        return getFormFactor() === 'DESKTOP';
    }

    /**
     * Fire a change event by passing the contents of the
     * editor as the value
     */
    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this.internalValue,
                },
            })
        );
    }
}
