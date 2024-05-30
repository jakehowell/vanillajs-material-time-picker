export default function _element(type = 'div', classes = '', attributes = {}, text = null){
    const element = document.createElement(type);

    if (classes.length) {
        if (typeof classes === 'string') {
            element.classList.add(classes);
        }
        if (typeof classes === 'object') {
            classes.forEach((className) => {
                element.classList.add(className);
            });
        }
    }

    if (attributes && Object.keys(attributes).length) {
        for (const attr in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
                element.setAttribute(attr, attributes[attr]);
            }
        }
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}