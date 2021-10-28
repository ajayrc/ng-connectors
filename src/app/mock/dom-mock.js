const MockElement = function(idAttr, hasParent) {
    return new Object({
        id: idAttr,
        offsetTop: 0,
        classList: {
            add: () => {}
        },
        checked: true,
        appendChild: function(element) { return element ? true : null},
        getAttribute: function(attrName) { return this[attrName] },
        setAttribute: function(attrName, attrValue) { this[attrName] = attrValue },
        getBoundingClientRect: () => {
            return {
                x: 0,
                y: 0,
                bottom: 0,
                height: 100,
                left: 0,
                right: 0,
                top: 0,
                width: 200,
                toJSON: () => {
                }
            };
        },
        offsetParent: hasParent ? new MockElement(this.id + "_parent"): null
    })
};

export default MockElement;
