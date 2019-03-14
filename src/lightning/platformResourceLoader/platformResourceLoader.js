function getDocument(cmp) {
    // Detect LWC type via duck-typing.
    if (
        cmp &&
        cmp.template &&
        cmp.template.host &&
        cmp.template.host.ownerDocument
    ) {
        const doc = cmp.template.host.ownerDocument;
        return doc;
    }
    throw new TypeError(
        'The first parameter of loadScript() and loadStyle() must be an LWC component.'
    );
}

function findLinkByUrl(root, url) {
    return root.querySelector(`link[href='${url}']`);
}

function findScriptByUrl(doc, url) {
    return doc.querySelector(`script[src='${url}']`);
}

function createStyle(doc, url) {
    const link = doc.createElement('link');
    link.href = url;
    link.charset = 'utf-8';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    return link;
}

function createScript(doc, url) {
    const script = doc.createElement('script');
    script.src = url;
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    return script;
}

function promiseStyle(doc, link, skipload) {
    return new Promise((resolve, reject) => {
        link.addEventListener('load', resolve);
        link.addEventListener('error', err => {
            err.stopPropagation();
            reject(err.message);
        });
        if (!skipload) {
            doc.head.appendChild(link);
        }
    });
}

function promiseScript(doc, script, skipload) {
    return new Promise((resolve, reject) => {
        script.addEventListener('load', () => {
            handleScriptLoad(script, resolve);
        });
        script.addEventListener('error', evt => {
            handleScriptError(evt, reject);
        });
        if (!skipload) {
            doc.head.appendChild(script);
        }
    });
}

function handleScriptLoad(script, resolve) {
    script._ltngRequireLoaded = true;
    resolve();
}

function handleScriptError(evt, reject) {
    evt.stopPropagation();
    reject(evt.message);
}

function handleExistingScript(script, url) {
    if (!script._ltngRequireCreated) {
        throw new Error(
            'platformResourceLoader encountered an existing <script> element for ' +
                url +
                ' that was not created by an ltng:require or platformResourceLoader instance. Unable to determine when the script would complete loading!'
        );
    }

    return new Promise((resolve, reject) => {
        if (script._ltngRequireLoaded) {
            // Another ltng:require/platformResourceLoader loaded this dependency resolve()
            resolve();
        } else {
            // Another ltng:require/platformResourceLoader is loading this dependency wire up a listener for this instance's load and resolve
            script.addEventListener('load', () => {
                handleScriptLoad(script, resolve);
            });
            script.addEventListener('error', evt => {
                handleScriptError(evt, reject);
            });
        }
    });
}

/**
 * Utility function to load a CSS file via a link tag.
 * @param {LightningElement} self - The current component. Stylesheets are added in the component markup.
 * @param {String} url - The path to the CSS file.
 * @return {Promise} - A promise resolved once the CSS file has been loaded.
 */
export function loadStyle(self, url) {
    const doc = getDocument(self);
    // Let the element handle relative to absolute mapping (link.href).
    const link = createStyle(doc, url);
    // Prevent duplicate styles in the same document scope.
    const existingLink = findLinkByUrl(doc, link.href);
    return promiseStyle(doc, existingLink || link, !!existingLink);
}

/**
 * Utility function to load a JS file via a script tag.
 * @param {LightningElement} self - The current component. Scripts are added to the head section of the document.
 * @param {String} url - The path to the JS file.
 * @return {Promise} - A promise resolved once the JS file has been loaded.
 */
export function loadScript(self, url) {
    const doc = getDocument(self);
    // Let the element handle relative to absolute mapping (script.src).
    const script = createScript(doc, url);
    // Prevent duplicate scripts in the same document scope.
    const existingScript = findScriptByUrl(doc, script.src);
    if (existingScript) {
        return handleExistingScript(existingScript, url);
    }
    // add this to tell that it was created by ltng:require/platformResourceLoader (aura or lwc version)
    script._ltngRequireCreated = true;
    return promiseScript(doc, script, !!existingScript);
}
