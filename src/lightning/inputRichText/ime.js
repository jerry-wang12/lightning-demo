import { isIE11, isChrome } from 'lightning/utilsPrivate';

const EMPTY_CHARACTER = '\u200B';
const emptyCharMatcher = new RegExp(EMPTY_CHARACTER, 'g');

function isNonCharacterKey(keyCode) {
    return keyCode && keyCode < 48;
}

/**
 * Issue: the first couple letters are entered directly without being considered
 *   as part of IME. This has to do with quill trying to create the first text
 *   node and breaking the IME. This only happens to Chrome and IE11.
 * Workaround: on compositionstart, insert empty characters at the beginning of
 *   every line. Remove all the empty chars when selection is changed.
 *
 * We use a class here to store the state of the hack instead of creating private
 * attributes in the component.
 *
 * @param {Object} rte - input rich text LWC instantce
 */
export default class IMEHandler {
    inputRichText;
    isEmptyCharInserted = false;

    constructor(inputRichText) {
        this.inputRichText = inputRichText;
    }

    initializeEmptyCharHack() {
        const quill = this.inputRichText.quill;
        const editorElement = quill.root;

        let shouldInsertEmptyChar = false;

        if (isChrome) {
            const handleInsertEmptyChar = event => {
                if (isNonCharacterKey(event.keyCode)) {
                    return;
                }

                // Find all the paragraphs that have no text and make sure
                // they have an empty char
                const children = editorElement.querySelectorAll('p, li');
                for (let i = 0; i < children.length; i += 1) {
                    const child = children[i];
                    if (child.textContent.length === 0) {
                        child.textContent = EMPTY_CHARACTER;
                    }
                }
                this.isEmptyCharInserted = true;
            };
            editorElement.addEventListener(
                'compositionstart',
                handleInsertEmptyChar
            );

            shouldInsertEmptyChar = true;
        } else if (isIE11) {
            const handleInsertEmptyChar = () => {
                // Insert empty character into the editor when there is no content
                // This is to make sure it works in accordance to the hack applied
                // for W-3946761.
                // Using the workaround for Chrome here would cause IE11 to freeze.
                // IE11 also doesn't need every empty line to have empty char.
                if (quill.editor.isBlank()) {
                    const child = editorElement.querySelector('p');
                    child.textContent = EMPTY_CHARACTER;
                    this.isEmptyCharInserted = true;
                }
            };
            ['focus', 'keydown'].forEach(eventName => {
                editorElement.addEventListener(
                    eventName,
                    handleInsertEmptyChar
                );
            });

            shouldInsertEmptyChar = true;
        }

        if (shouldInsertEmptyChar) {
            quill.on('selection-change', () => {
                if (this.isEmptyCharInserted) {
                    this.clearEmptyCharIfTrulyEmpty(quill);
                }
            });
        }
    }

    clearEmptyCharIfTrulyEmpty() {
        const quill = this.inputRichText.quill;
        const text = quill.getText().replace(/\n/, '');
        // if the text is only the empty char that means the editor
        // should be empty
        if (!quill.hasFocus() && text === EMPTY_CHARACTER) {
            quill.setText('');
            this.isEmptyCharInserted = false;
        }
    }

    clearEmptyChars(html) {
        if (this.isEmptyCharInserted) {
            return html.replace(emptyCharMatcher, '');
        }
        return html;
    }
}
