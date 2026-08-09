/* globals define */

/*!
 * Masonry Plugin for jQuery (modernized fork by Peter Pfeufer)
 *
 * @version 0.0.1
 * @author Peter Pfeufer
 * @license GPL-3.0 or later
 * @link https://github.com/ppfeufer/stickyjs
 *
 * Description: Cascading grid layout library
 *
 * Original Plugin:
 * Author: David DeSandro
 * GitHub: https://github.com/desandro/masonry
 */

/**
 * Bridget v3.0.1
 * MIT license
 */
(function (window, factory) {
    'use strict';

    // module definition
    if (typeof module === 'object' && module.exports) { // jshint ignore:line
        // CommonJS
        module.exports = factory( // jshint ignore:line
            window,
            require('jquery') // jshint ignore:line
        );
    } else {
        // browser global
        window.jQueryBridget = factory(
            window,
            window.jQuery
        );
    }

}(window, function factory (window, jQuery) {
    'use strict';

    const console = window.console;
    let logError = typeof console === 'undefined'
        ? () => {} // jshint ignore:line
        : (message) => {console.error(message);};

    function jQueryBridget (namespace, PluginClass, $) {
        $ = $ || jQuery || window.jQuery;

        if (!$) {
            return;
        }

        // add option method -> $().plugin('option', {...})
        if (!PluginClass.prototype.option) {
            // option setter
            PluginClass.prototype.option = function (opts) {
                if (!opts) {
                    return;
                }

                this.options = Object.assign(this.options || {}, opts);
            };
        }

        // make jQuery plugin
        $.fn[namespace] = function (arg0, ...args) {
            if (typeof arg0 === 'string') {
                // method call $().plugin( 'methodName', { options } )
                return methodCall(this, arg0, args);
            }

            // just $().plugin({ options })
            plainCall(this, arg0);

            return this;
        };

        // $().plugin('methodName')
        function methodCall ($elems, methodName, args) {
            let returnValue;
            let pluginMethodStr = `$().${namespace}("${methodName}")`;

            $elems.each(function (i, elem) { // jshint ignore:line
                // get instance
                let instance = $.data(elem, namespace);

                if (!instance) {
                    logError(`${namespace} not initialized.` +
                        ` Cannot call method ${pluginMethodStr}`);
                    return;
                }

                let method = instance[methodName];

                if (!method || methodName.charAt(0) === '_') {
                    logError(`${pluginMethodStr} is not a valid method`);

                    return;
                }

                // apply method, get return value
                let value = method.apply(instance, args);

                // set return value if value is returned, use only first value
                returnValue = returnValue === undefined ? value : returnValue;
            });

            return returnValue !== undefined ? returnValue : $elems;
        }

        function plainCall ($elems, options) {
            $elems.each(function (i, elem) { // jshint ignore:line
                let instance = $.data(elem, namespace);

                if (instance) {
                    // set options & init
                    instance.option(options);
                    instance._init();
                } else {
                    // initialize new instance
                    instance = new PluginClass(elem, options);

                    $.data(elem, namespace, instance);
                }
            });
        }
    }

    return jQueryBridget;
}));

/**
 * EvEmitter v2.1.1
 * MIT License
 */
(function (global, factory) {
    'use strict';

    // universal module definition
    if (typeof module === 'object' && module.exports) { // jshint ignore:line
        // CommonJS - Browserify, Webpack
        module.exports = factory(); // jshint ignore:line
    } else {
        // Browser globals
        global.EvEmitter = factory();
    }
}(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    function EvEmitter () {}

    let proto = EvEmitter.prototype;

    proto.on = function (eventName, listener) {
        if (!eventName || !listener) {
            return this;
        }

        // set events hash
        let events = this._events = this._events || {};
        // set listeners array
        let listeners = events[eventName] = events[eventName] || [];

        // only add once
        if (!listeners.includes(listener)) {
            listeners.push(listener);
        }

        return this;
    };

    proto.once = function (eventName, listener) {
        if (!eventName || !listener) {
            return this;
        }

        // add event
        this.on(eventName, listener);
        // set once flag
        // set onceEvents hash
        let onceEvents = this._onceEvents = this._onceEvents || {};
        // set onceListeners object
        let onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};

        // set flag
        onceListeners[listener] = true;

        return this;
    };

    proto.off = function (eventName, listener) {
        let listeners = this._events && this._events[eventName];

        if (!listeners || !listeners.length) {
            return this;
        }

        let index = listeners.indexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }

        return this;
    };

    proto.emitEvent = function (eventName, args) {
        let listeners = this._events && this._events[eventName];

        if (!listeners || !listeners.length) {
            return this;
        }

        // copy over to avoid interference if .off() in listener
        listeners = listeners.slice(0);
        args = args || [];

        // once stuff
        let onceListeners = this._onceEvents && this._onceEvents[eventName];

        for (let listener of listeners) {
            let isOnce = onceListeners && onceListeners[listener];

            if (isOnce) {
                // remove listener
                // remove before trigger to prevent recursion
                this.off(eventName, listener);
                // unset once flag
                delete onceListeners[listener];
            }

            // trigger listener
            listener.apply(this, args);
        }

        return this;
    };

    proto.allOff = function () {
        delete this._events;
        delete this._onceEvents;
        return this;
    };

    return EvEmitter;

}));

/**
 * getSize v3.0.0
 * MIT license
 */
(function (window, factory) {
    'use strict';

    if (typeof module === 'object' && module.exports) { // jshint ignore:line
        // CommonJS
        module.exports = factory(); // jshint ignore:line
    } else {
        // browser global
        window.getSize = factory();
    }
})(window, function factory () {
    'use strict';

    function getStyleSize (value) {
        let num = parseFloat(value);
        // not a percent like '100%', and a number
        let isValid = value.indexOf('%') === -1 && !isNaN(num);

        return isValid && num;
    }

    let measurements = [
        'paddingLeft',
        'paddingRight',
        'paddingTop',
        'paddingBottom',
        'marginLeft',
        'marginRight',
        'marginTop',
        'marginBottom',
        'borderLeftWidth',
        'borderRightWidth',
        'borderTopWidth',
        'borderBottomWidth'
    ];

    let measurementsLength = measurements.length; // eslint-disable-line no-unused-vars

    function getZeroSize () {
        let size = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        };

        measurements.forEach((measurement) => {
            size[measurement] = 0;
        });

        return size;
    }

    function getSize (elem) {
        // use querySeletor if elem is string
        if (typeof elem === 'string') {
            elem = document.querySelector(elem);
        }

        // do not proceed on non-objects
        let isElement = elem && typeof elem === 'object' && elem.nodeType;

        if (!isElement) {
            return;
        }

        let style = getComputedStyle(elem);

        // if hidden, everything is 0
        if (style.display === 'none') {
            return getZeroSize();
        }

        let size = {};

        size.width = elem.offsetWidth;
        size.height = elem.offsetHeight;

        let isBorderBox = size.isBorderBox = style.boxSizing === 'border-box';

        // get all measurements
        measurements.forEach((measurement) => {
            let value = style[measurement];
            let num = parseFloat(value);

            // any 'auto', 'medium' value will be 0
            size[measurement] = !isNaN(num) ? num : 0;
        });

        let paddingWidth = size.paddingLeft + size.paddingRight;
        let paddingHeight = size.paddingTop + size.paddingBottom;
        let marginWidth = size.marginLeft + size.marginRight;
        let marginHeight = size.marginTop + size.marginBottom;
        let borderWidth = size.borderLeftWidth + size.borderRightWidth;
        let borderHeight = size.borderTopWidth + size.borderBottomWidth;

        // overwrite width and height if we can get it from style
        let styleWidth = getStyleSize(style.width);

        if (styleWidth !== false) {
            size.width = styleWidth + (isBorderBox ? 0 : paddingWidth + borderWidth); // add padding and border unless it's already including it
        }

        let styleHeight = getStyleSize(style.height);

        if (styleHeight !== false) {
            size.height = styleHeight + (isBorderBox ? 0 : paddingHeight + borderHeight); // add padding and border unless it's already including it
        }

        size.innerWidth = size.width - (paddingWidth + borderWidth);
        size.innerHeight = size.height - (paddingHeight + borderHeight);

        size.outerWidth = size.width + marginWidth;
        size.outerHeight = size.height + marginHeight;

        return size;
    }

    return getSize;
});

/**
 * matchesSelector v2.0.2
 * MIT license
 */
(function (window, factory) {
    'use strict';

    // universal module definition
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('desandro-matches-selector/matches-selector', factory);
    } else if (typeof module == 'object' && module.exports) { // jshint ignore:line
        // CommonJS
        module.exports = factory(); // jshint ignore:line
    } else {
        // browser global
        window.matchesSelector = factory();
    }

}(window, function factory () {
    'use strict';

    const matchesMethod = (function () {
        const ElemProto = window.Element.prototype;

        // check for the standard method name first
        if (ElemProto.matches) {
            return 'matches';
        }

        // check un-prefixed
        if (ElemProto.matchesSelector) {
            return 'matchesSelector';
        }

        // check vendor prefixes
        const prefixes = ['webkit', 'moz', 'ms', 'o'];

        for (let i = 0; i < prefixes.length; i++) {
            const prefix = prefixes[i];
            const method = prefix + 'MatchesSelector';

            if (ElemProto[method]) {
                return method;
            }
        }
    })();

    return function matchesSelector (elem, selector) {
        return elem[matchesMethod](selector);
    };
}));

/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */
(function (window, factory) {
    'use strict';

    // universal module definition
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('fizzy-ui-utils/utils', [
            'desandro-matches-selector/matches-selector'
        ], function (matchesSelector) {
            return factory(window, matchesSelector);
        });
    } else if (typeof module === 'object' && module.exports) { // jshint ignore:line
        // CommonJS
        module.exports = factory( // jshint ignore:line
            window,
            require('desandro-matches-selector') // jshint ignore:line
        );
    } else {
        // browser global
        window.fizzyUIUtils = factory(
            window,
            window.matchesSelector
        );
    }

}(window, function factory (window, matchesSelector) {
    'use strict';

    const utils = {};

    utils.extend = function (a, b) {
        for (const prop in b) { // jshint ignore:line
            a[prop] = b[prop];
        }

        return a;
    };

    utils.modulo = function (num, div) {
        return ((num % div) + div) % div;
    };

    const arraySlice = Array.prototype.slice;

    utils.makeArray = function (obj) {
        if (Array.isArray(obj)) {
            // use object if already an array
            return obj;
        }

        // return empty array if undefined or null. #6
        if (obj === null || obj === undefined) {
            return [];
        }

        const isArrayLike = typeof obj === 'object' && typeof obj.length === 'number';

        if (isArrayLike) {
            // convert nodeList to array
            return arraySlice.call(obj);
        }

        // array of single index
        return [obj];
    };

    utils.removeFrom = function (ary, obj) {
        const index = ary.indexOf(obj);

        if (index !== -1) {
            ary.splice(index, 1);
        }
    };

    utils.getParent = function (elem, selector) {
        while (elem.parentNode && elem !== document.body) {
            elem = elem.parentNode;

            if (matchesSelector(elem, selector)) {
                return elem;
            }
        }
    };

    utils.getQueryElement = function (elem) {
        if (typeof elem === 'string') {
            return document.querySelector(elem);
        }

        return elem;
    };

    utils.handleEvent = function (event) {
        const method = 'on' + event.type;

        if (this[method]) {
            this[method](event);
        }
    };

    utils.filterFindElements = function (elems, selector) {
        // make array of elems
        elems = utils.makeArray(elems);

        const ffElems = [];

        elems.forEach(function (elem) {
            // check that elem is an actual element
            if (!(elem instanceof HTMLElement)) {
                return;
            }

            // add elem if no selector
            if (!selector) {
                ffElems.push(elem);
                return;
            }

            // filter & find items if we have a selector
            // filter
            if (matchesSelector(elem, selector)) {
                ffElems.push(elem);
            }

            // find children
            const childElems = elem.querySelectorAll(selector);

            // concat childElems to filterFound array
            for (let i = 0; i < childElems.length; i++) {
                ffElems.push(childElems[i]);
            }
        });

        return ffElems;
    };

    utils.debounceMethod = function (_class, methodName, threshold) {
        threshold = threshold || 100;

        // original method
        const method = _class.prototype[methodName];
        const timeoutName = methodName + 'Timeout';

        _class.prototype[methodName] = function () {
            const timeout = this[timeoutName];
            clearTimeout(timeout);

            const args = arguments;
            const _this = this;
            this[timeoutName] = setTimeout(function () {
                method.apply(_this, args);
                delete _this[timeoutName];
            }, threshold);
        };
    };

    utils.docReady = function (callback) {
        const readyState = document.readyState;

        if (readyState === 'complete' || readyState === 'interactive') {
            // do async to allow for other scripts to run. metafizzy/flickity#441
            setTimeout(callback);
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    // http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
    utils.toDashed = function (str) {
        return str.replace(/(.)([A-Z])/g, function (match, $1, $2) { // jshint ignore:line
            return $1 + '-' + $2;
        }).toLowerCase();
    };

    const console = window.console;

    /**
     * allow user to initialize classes via [data-namespace] or .js-namespace class
     * htmlInit( Widget, 'widgetName' )
     * options are parsed from data-namespace-options
     */
    utils.htmlInit = function (WidgetClass, namespace) {
        utils.docReady(function () {
            const dashedNamespace = utils.toDashed(namespace);
            const dataAttr = 'data-' + dashedNamespace;
            const dataAttrElems = document.querySelectorAll(`[${dataAttr}]`);
            const jsDashElems = document.querySelectorAll(`.js-${dashedNamespace}`);
            const elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));
            const dataOptionsAttr = `${dataAttr}-options`;
            const jQuery = window.jQuery;

            elems.forEach(function (elem) {
                const attr = elem.getAttribute(dataAttr) ||  elem.getAttribute(dataOptionsAttr);
                let options;

                try {
                    options = attr && JSON.parse(attr);
                } catch (error) {
                    // log error, do not initialize
                    if (console) {
                        console.error(`Error parsing ${dataAttr} on ${elem.className}: ${error}`);
                    }

                    return;
                }

                // initialize
                const instance = new WidgetClass(elem, options);

                // make available via $().data('namespace')
                if (jQuery) {
                    jQuery.data(elem, namespace, instance);
                }
            });

        });
    };

    return utils;
}));

/**
 * Outlayer Item
 */
(function (window, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD - RequireJS
        define([
            'ev-emitter/ev-emitter',
            'get-size/get-size'
        ], factory);
    } else if (typeof module === 'object' && module.exports) { // jshint ignore:line
        // CommonJS - Browserify, Webpack
        module.exports = factory( // jshint ignore:line
            require('ev-emitter'), // jshint ignore:line
            require('get-size') // jshint ignore:line
        );
    } else {
        // browser global
        window.Outlayer = {};
        window.Outlayer.Item = factory(
            window.EvEmitter,
            window.getSize
        );
    }
}(window, function factory (EvEmitter, getSize) {
    'use strict';

    function isEmptyObj (obj) {
        for (const prop in obj) { // jshint ignore:line
            return false;
        }

        return true;
    }

    const docElemStyle = document.documentElement.style;
    const transitionProperty = typeof docElemStyle.transition === 'string' ? 'transition' : 'WebkitTransition';
    const transformProperty = typeof docElemStyle.transform === 'string' ? 'transform' : 'WebkitTransform';
    const transitionEndEvent = {
        WebkitTransition: 'webkitTransitionEnd',
        transition: 'transitionend'
    }[transitionProperty];

    // cache all vendor properties that could have vendor prefix
    const vendorProperties = {
        transform: transformProperty,
        transition: transitionProperty,
        transitionDuration: transitionProperty + 'Duration',
        transitionProperty: transitionProperty + 'Property',
        transitionDelay: transitionProperty + 'Delay'
    };

    function Item (element, layout) {
        if (!element) {
            return;
        }

        this.element = element;
        // parent layout class, i.e. Masonry, Isotope, or Packery
        this.layout = layout;
        this.position = {
            x: 0,
            y: 0
        };

        this._create();
    }

    const proto = Item.prototype = Object.create(EvEmitter.prototype);

    proto.constructor = Item;

    proto._create = function () {
        // transition objects
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        };

        this.css({
            position: 'absolute'
        });
    };

    proto.handleEvent = function (event) {
        const method = `on${event.type}`;

        if (this[method]) {
            this[method](event);
        }
    };

    proto.getSize = function () {
        this.size = getSize(this.element);
    };

    /**
     * Apply CSS styles to element
     *
     * @param {Object} style
     */
    proto.css = function (style) {
        const elemStyle = this.element.style;

        for (const prop in style) { // jshint ignore:line
            // use vendor property if available
            const supportedProp = vendorProperties[prop] || prop;

            elemStyle[supportedProp] = style[prop];
        }
    };

    // measure position, and sets it
    proto.getPosition = function () {
        const style = getComputedStyle(this.element);
        const isOriginLeft = this.layout._getOption('originLeft');
        const isOriginTop = this.layout._getOption('originTop');
        const xValue = style[isOriginLeft ? 'left' : 'right'];
        const yValue = style[isOriginTop ? 'top' : 'bottom'];
        let x = parseFloat(xValue);
        let y = parseFloat(yValue);
        // convert percent to pixels
        const layoutSize = this.layout.size;

        if (xValue.indexOf('%') !== -1) {
            x = (x / 100) * layoutSize.width;
        }

        if (yValue.indexOf('%') !== -1) {
            y = (y / 100) * layoutSize.height;
        }

        // clean up 'auto' or other non-integer values
        x = isNaN(x) ? 0 : x;
        y = isNaN(y) ? 0 : y;
        // remove padding from measurement
        x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
        y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

        this.position.x = x;
        this.position.y = y;
    };

    // set settled position, apply padding
    proto.layoutPosition = function () {
        const layoutSize = this.layout.size;
        const style = {};
        const isOriginLeft = this.layout._getOption('originLeft');
        const isOriginTop = this.layout._getOption('originTop');

        // x
        const xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
        const xProperty = isOriginLeft ? 'left' : 'right';
        const xResetProperty = isOriginLeft ? 'right' : 'left';
        const x = this.position.x + layoutSize[xPadding];

        // set in percentage or pixels
        style[xProperty] = this.getXValue(x);
        // reset other property
        style[xResetProperty] = '';

        // y
        const yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
        const yProperty = isOriginTop ? 'top' : 'bottom';
        const yResetProperty = isOriginTop ? 'bottom' : 'top';
        const y = this.position.y + layoutSize[yPadding];

        // set in percentage or pixels
        style[yProperty] = this.getYValue(y);
        // reset other property
        style[yResetProperty] = '';

        this.css(style);
        this.emitEvent('layout', [this]);
    };

    proto.getXValue = function (x) {
        const isHorizontal = this.layout._getOption('horizontal');

        return this.layout.options.percentPosition && !isHorizontal ? ((x / this.layout.size.width) * 100) + '%' : x + 'px';
    };

    proto.getYValue = function (y) {
        const isHorizontal = this.layout._getOption('horizontal');

        return this.layout.options.percentPosition && isHorizontal ? ((y / this.layout.size.height) * 100) + '%' : y + 'px';
    };

    proto._transitionTo = function (x, y) {
        this.getPosition();

        // get current x & y from top/left
        const curX = this.position.x;
        const curY = this.position.y;

        const didNotMove = x === this.position.x && y === this.position.y;

        // save end position
        this.setPosition(x, y);

        // if did not move and not transitioning, just go to layout
        if (didNotMove && !this.isTransitioning) {
            this.layoutPosition();

            return;
        }

        const transX = x - curX;
        const transY = y - curY;
        const transitionStyle = {};

        transitionStyle.transform = this.getTranslate(transX, transY);

        this.transition({
            to: transitionStyle,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: true
        });
    };

    proto.getTranslate = function (x, y) {
        // flip cooridinates if origin on right or bottom
        const isOriginLeft = this.layout._getOption('originLeft');
        const isOriginTop = this.layout._getOption('originTop');

        x = isOriginLeft ? x : -x;
        y = isOriginTop ? y : -y;

        return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
    };

    // non transition + transform support
    proto.goTo = function (x, y) {
        this.setPosition(x, y);
        this.layoutPosition();
    };

    proto.moveTo = proto._transitionTo;

    proto.setPosition = function (x, y) {
        this.position.x = parseFloat(x);
        this.position.y = parseFloat(y);
    };

    proto._nonTransition = function (args) {
        this.css(args.to);

        if (args.isCleaning) {
            this._removeStyles(args.to);
        }

        for (const prop in args.onTransitionEnd) { // jshint ignore:line
            args.onTransitionEnd[prop].call(this);
        }
    };

    proto.transition = function (args) {
        let prop;

        // redirect to nonTransition if no transition duration
        if (!parseFloat(this.layout.options.transitionDuration)) {
            this._nonTransition(args);

            return;
        }

        const _transition = this._transn;
        // keep track of onTransitionEnd callback by css property

        for (prop in args.onTransitionEnd) { // jshint ignore:line
            _transition.onEnd[prop] = args.onTransitionEnd[prop];
        }

        // keep track of properties that are transitioning
        for (prop in args.to) { // jshint ignore:line
            _transition.ingProperties[prop] = true;

            // keep track of properties to clean up when transition is done
            if (args.isCleaning) {
                _transition.clean[prop] = true;
            }
        }

        // set from styles
        if (args.from) {
            this.css(args.from);

            // force redraw. http://blog.alexmaccaw.com/css-transitions
            const h = this.element.offsetHeight; // eslint-disable-line no-unused-vars
        }

        // enable transition
        this.enableTransition(args.to);
        // set styles that are transitioning
        this.css(args.to);

        this.isTransitioning = true;

    };

    function toDashedAll (str) {
        return str.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
        });
    }

    const transitionProps = `opacity,${toDashedAll(transformProperty)}`;

    proto.enableTransition = function (/* style */) {
        // HACK changing transitionProperty during a transition
        // will cause transition to jump
        if (this.isTransitioning) {
            return;
        }

        // make `transition: foo, bar, baz` from style object
        // HACK un-comment this when enableTransition can work
        // while a transition is happening
        // var transitionValues = [];
        // for ( var prop in style ) {
        //   // dash-ify camelCased properties like WebkitTransition
        //   prop = vendorProperties[ prop ] || prop;
        //   transitionValues.push( toDashedAll( prop ) );
        // }
        // munge number to millisecond, to match stagger
        let duration = this.layout.options.transitionDuration;

        duration = typeof duration === 'number' ? `${duration}ms` : duration;
        // enable transition styles
        this.css({
            transitionProperty: transitionProps,
            transitionDuration: duration,
            transitionDelay: this.staggerDelay || 0
        });

        // listen for transition end event
        this.element.addEventListener(transitionEndEvent, this, false);
    };

    proto.onwebkitTransitionEnd = function (event) {
        this.ontransitionend(event);
    };

    proto.onotransitionend = function (event) {
        this.ontransitionend(event);
    };

    const dashedVendorProperties = {
        '-webkit-transform': 'transform'
    };

    proto.ontransitionend = function (event) {
        // disregard bubbled events from children
        if (event.target !== this.element) {
            return;
        }

        const _transition = this._transn;
        // get property name of transitioned property, convert to prefix-free
        const propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;

        // remove property that has completed transitioning
        delete _transition.ingProperties[propertyName];

        // check if any properties are still transitioning
        if (isEmptyObj(_transition.ingProperties)) {
            // all properties have completed transitioning
            this.disableTransition();
        }

        // clean style
        if (propertyName in _transition.clean) {
            // clean up style
            this.element.style[event.propertyName] = '';
            delete _transition.clean[propertyName];
        }

        // trigger onTransitionEnd callback
        if (propertyName in _transition.onEnd) {
            const onTransitionEnd = _transition.onEnd[propertyName];

            onTransitionEnd.call(this);

            delete _transition.onEnd[propertyName];
        }

        this.emitEvent('transitionEnd', [this]);
    };

    proto.disableTransition = function () {
        this.removeTransitionStyles();
        this.element.removeEventListener(transitionEndEvent, this, false);
        this.isTransitioning = false;
    };

    /**
     * removes style property from element
     * @param {Object} style
     **/
    proto._removeStyles = function (style) {
        // clean up transition styles
        const cleanStyle = {};

        for (const prop in style) { // jshint ignore:line
            cleanStyle[prop] = '';
        }

        this.css(cleanStyle);
    };

    const cleanTransitionStyle = {
        transitionProperty: '',
        transitionDuration: '',
        transitionDelay: ''
    };

    proto.removeTransitionStyles = function () {
        // remove transition
        this.css(cleanTransitionStyle);
    };

    proto.stagger = function (delay) {
        delay = isNaN(delay) ? 0 : delay;

        this.staggerDelay = `${delay}ms`;
    };

    proto.removeElem = function () {
        this.element.parentNode.removeChild(this.element);
        // remove display: none
        this.css({display: ''});
        this.emitEvent('remove', [this]);
    };

    proto.remove = function () {
        // just remove element if no transition support or no transition
        if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
            this.removeElem();

            return;
        }

        // start transition
        this.once('transitionEnd', function () {
            this.removeElem();
        });
        this.hide();
    };

    proto.reveal = function () {
        delete this.isHidden;
        // remove display: none
        this.css({display: ''});

        const options = this.layout.options;
        const onTransitionEnd = {};
        const transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');

        onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;

        this.transition({
            from: options.hiddenStyle,
            to: options.visibleStyle,
            isCleaning: true,
            onTransitionEnd: onTransitionEnd
        });
    };

    proto.onRevealTransitionEnd = function () {
        // check if still visible
        // during transition, item may have been hidden
        if (!this.isHidden) {
            this.emitEvent('reveal');
        }
    };

    /**
     * get style property use for hide/reveal transition end
     * @param {String} styleProperty - hiddenStyle/visibleStyle
     * @returns {String}
     */
    proto.getHideRevealTransitionEndProperty = function (styleProperty) {
        const optionStyle = this.layout.options[styleProperty];

        // use opacity
        if (optionStyle.opacity) {
            return 'opacity';
        }

        // get first property
        for (const prop in optionStyle) { // jshint ignore:line
            return prop;
        }
    };

    proto.hide = function () {
        // set flag
        this.isHidden = true;
        // remove display: none
        this.css({display: ''});

        const options = this.layout.options;
        const onTransitionEnd = {};
        const transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');

        onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;

        this.transition({
            from: options.visibleStyle,
            to: options.hiddenStyle,
            // keep hidden stuff hidden
            isCleaning: true,
            onTransitionEnd: onTransitionEnd
        });
    };

    proto.onHideTransitionEnd = function () {
        // check if still hidden
        // during transition, item may have been un-hidden
        if (this.isHidden) {
            this.css({display: 'none'});
            this.emitEvent('hide');
        }
    };

    proto.destroy = function () {
        this.css({
            position: '',
            left: '',
            right: '',
            top: '',
            bottom: '',
            transition: '',
            transform: ''
        });
    };

    return Item;
}));

/**
 * Outlayer v2.1.1
 * MIT license
 */
(function (window, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD - RequireJS
        define(
            [
                'ev-emitter/ev-emitter',
                'get-size/get-size',
                'fizzy-ui-utils/utils',
                './item'
            ],
            function (EvEmitter, getSize, utils, Item) {
                return factory(window, EvEmitter, getSize, utils, Item);
            }
        );
    } else if (typeof module === 'object' && module.exports) { // jshint ignore:line
        // CommonJS - Browserify, Webpack
        module.exports = factory( // jshint ignore:line
            window,
            require('ev-emitter'), // jshint ignore:line
            require('get-size'), // jshint ignore:line
            require('fizzy-ui-utils'), // jshint ignore:line
            require('./item') // jshint ignore:line
        );
    } else {
        // browser global
        window.Outlayer = factory(
            window,
            window.EvEmitter,
            window.getSize,
            window.fizzyUIUtils,
            window.Outlayer.Item
        );
    }
}(window, function factory (window, EvEmitter, getSize, utils, Item) {
    'use strict';

    const console = window.console;
    const jQuery = window.jQuery;
    const noop = function () {};
    let GUID = 0;
    const instances = {};


    /**
     * @param {Element, String} element
     * @param {Object} options
     * @constructor
     */
    function Outlayer (element, options) {
        const queryElement = utils.getQueryElement(element);

        if (!queryElement) {
            if (console) {
                console.error(`Bad element for ${this.constructor.namespace}: ${queryElement || element}`);
            }

            return;
        }

        this.element = queryElement;

        // add jQuery
        if (jQuery) {
            this.$element = jQuery(this.element);
        }

        // options
        this.options = utils.extend({}, this.constructor.defaults);
        this.option(options);

        // add id for Outlayer.getFromElement
        const id = ++GUID;
        this.element.outlayerGUID = id; // expando
        instances[id] = this; // associate via id

        // kick it off
        this._create();

        const isInitLayout = this._getOption('initLayout');

        if (isInitLayout) {
            this.layout();
        }
    }

    Outlayer.namespace = 'outlayer';
    Outlayer.Item = Item;
    Outlayer.defaults = {
        containerStyle: {
            position: 'relative'
        },
        initLayout: true,
        originLeft: true,
        originTop: true,
        resize: true,
        resizeContainer: true,
        // item options
        transitionDuration: '0.4s',
        hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.001)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
        }
    };

    const proto = Outlayer.prototype;

    utils.extend(proto, EvEmitter.prototype);

    /**
     * set options
     * @param {Object} opts
     */
    proto.option = function (opts) {
        utils.extend(this.options, opts);
    };

    /**
     * get backwards compatible option value, check old name
     */
    proto._getOption = function (option) {
        const oldOption = this.constructor.compatOptions[option];
        return oldOption && this.options[oldOption] !== undefined ? this.options[oldOption] : this.options[option];
    };

    Outlayer.compatOptions = {
        initLayout: 'isInitLayout',
        horizontal: 'isHorizontal',
        layoutInstant: 'isLayoutInstant',
        originLeft: 'isOriginLeft',
        originTop: 'isOriginTop',
        resize: 'isResizeBound',
        resizeContainer: 'isResizingContainer'
    };

    proto._create = function () {
        // get items from children
        this.reloadItems();
        // elements that affect layout, but are not laid out
        this.stamps = [];
        this.stamp(this.options.stamp);

        // set container style
        utils.extend(this.element.style, this.options.containerStyle);

        // bind resize method
        const canBindResize = this._getOption('resize');

        if (canBindResize) {
            this.bindResize();
        }
    };

    proto.reloadItems = function () {
        // collection of item elements
        this.items = this._itemize(this.element.children);
    };


    /**
     * turn elements into Outlayer.Items to be used in layout
     * @param {Array|NodeList|HTMLElement} elems
     * @returns {Array} items - collection of new Outlayer Items
     */
    proto._itemize = function (elems) {
        const itemElems = this._filterFindItemElements(elems);
        const Item = this.constructor.Item;

        // create new Outlayer Items for collection
        const items = [];

        for (let i = 0; i < itemElems.length; i++) {
            const elem = itemElems[i];
            const item = new Item(elem, this);

            items.push(item);
        }

        return items;
    };

    proto._filterFindItemElements = function (elems) {
        return utils.filterFindElements(elems, this.options.itemSelector);
    };

    /**
     * getter method for getting item elements
     * @returns {Array} elems - collection of item elements
     */
    proto.getItemElements = function () {
        return this.items.map(function (item) {
            return item.element;
        });
    };

    /**
     * lays out all items
     */
    proto.layout = function () {
        this._resetLayout();
        this._manageStamps();

        // don't animate first layout
        const layoutInstant = this._getOption('layoutInstant');
        const isInstant = layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
        this.layoutItems(this.items, isInstant);

        // flag for initalized
        this._isLayoutInited = true;
    };

    proto._init = proto.layout;

    /**
     * logic before any new layout
     */
    proto._resetLayout = function () {
        this.getSize();
    };


    proto.getSize = function () {
        this.size = getSize(this.element);
    };

    /**
     * get measurement from option, for columnWidth, rowHeight, gutter
     * if option is String -> get element from selector string, & get size of element
     * if option is Element -> get size of element
     * else use option as a number
     *
     * @param {String} measurement
     * @param {String} size - width or height
     * @private
     */
    proto._getMeasurement = function (measurement, size) {
        const option = this.options[measurement];
        let elem;

        if (!option) {
            // default to 0
            this[measurement] = 0;
        } else {
            // use option as an element
            if (typeof option === 'string') {
                elem = this.element.querySelector(option);
            } else if (option instanceof HTMLElement) {
                elem = option;
            }

            // use size of element, if element
            this[measurement] = elem ? getSize(elem)[size] : option;
        }
    };

    /**
     * layout a collection of item elements
     * @api public
     */
    proto.layoutItems = function (items, isInstant) {
        items = this._getItemsForLayout(items);

        this._layoutItems(items, isInstant);
        this._postLayout();
    };

    /**
     * get the items to be laid out
     * you may want to skip over some items
     * @param {Array} items
     * @returns {Array} items
     */
    proto._getItemsForLayout = function (items) {
        return items.filter(function (item) {
            return !item.isIgnored;
        });
    };

    /**
     * layout items
     * @param {Array} items
     * @param {Boolean} isInstant
     */
    proto._layoutItems = function (items, isInstant) {
        this._emitCompleteOnItems('layout', items);

        if (!items || !items.length) {
            // no items, emit event with empty array
            return;
        }

        const queue = [];

        items.forEach(function (item) {
            // get x/y object from method
            const position = this._getItemLayoutPosition(item);

            // enqueue
            position.item = item;
            position.isInstant = isInstant || item.isLayoutInstant;

            queue.push(position);
        }, this);

        this._processLayoutQueue(queue);
    };

    /**
     * get item layout position
     * @returns {Object} x and y position
     */
    proto._getItemLayoutPosition = function () {
        return {
            x: 0,
            y: 0
        };
    };

    /**
     * iterate over array and position each item
     * Reason being - separating this logic prevents 'layout invalidation'
     * thx @paul_irish
     * @param {Array} queue
     */
    proto._processLayoutQueue = function (queue) {
        this.updateStagger();

        queue.forEach(function (obj, i) {
            this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
        }, this);
    };

    proto.updateStagger = function () {
        const stagger = this.options.stagger;

        if (stagger === null || stagger === undefined) {
            this.stagger = 0;

            return;
        }

        this.stagger = getMilliseconds(stagger);

        return this.stagger;
    };

    /**
     * Sets position of item in DOM
     * @param {Outlayer.Item} item
     * @param {Number} x - horizontal position
     * @param {Number} y - vertical position
     * @param {Boolean} isInstant - disables transitions
     * @param {Number} i - index of item in collection, used for stagger
     */
    proto._positionItem = function (item, x, y, isInstant, i) {
        if (isInstant) {
            // if not transition, just set CSS
            item.goTo(x, y);
        } else {
            item.stagger(i * this.stagger);
            item.moveTo(x, y);
        }
    };

    /**
     * Any logic you want to do after each layout,
     * i.e. size the container
     */
    proto._postLayout = function () {
        this.resizeContainer();
    };

    proto.resizeContainer = function () {
        const isResizingContainer = this._getOption('resizeContainer');

        if (!isResizingContainer) {
            return;
        }

        const size = this._getContainerSize();

        if (size) {
            this._setContainerMeasure(size.width, true);
            this._setContainerMeasure(size.height, false);
        }
    };

    /**
     * Sets width or height of container if returned
     *
     * @returns {Object} size
     * @param {Number} width
     * @param {Number} height
     */
    proto._getContainerSize = noop;

    /**
     * @param {Number} measure - size of width or height
     * @param {Boolean} isWidth
     */
    proto._setContainerMeasure = function (measure, isWidth) {
        if (measure === undefined) {
            return;
        }

        const elemSize = this.size;

        // add padding and border width if border box
        if (elemSize.isBorderBox) {
            measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
                elemSize.borderLeftWidth + elemSize.borderRightWidth :
                elemSize.paddingBottom + elemSize.paddingTop +
                elemSize.borderTopWidth + elemSize.borderBottomWidth;
        }

        measure = Math.max(measure, 0);

        this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
    };

    /**
     * emit eventComplete on a collection of items events
     * @param {String} eventName
     * @param {Array} items - Outlayer.Items
     */
    proto._emitCompleteOnItems = function (eventName, items) {
        const _this = this;

        function onComplete () {
            _this.dispatchEvent(eventName + 'Complete', null, [items]);
        }

        const count = items.length;

        if (!items || !count) {
            onComplete();
            return;
        }

        let doneCount = 0;

        function tick () {
            doneCount++;
            if (doneCount === count) {
                onComplete();
            }
        }

        // bind callback
        items.forEach(function (item) {
            item.once(eventName, tick);
        });
    };

    /**
     * emits events via EvEmitter and jQuery events
     *
     * @param {String} type - name of event
     * @param {Event} event - original event
     * @param {Array} args - extra arguments
     */
    proto.dispatchEvent = function (type, event, args) {
        // add original event to arguments
        const emitArgs = event ? [event].concat(args) : args;

        this.emitEvent(type, emitArgs);

        if (jQuery) {
            // set this.$element
            this.$element = this.$element || jQuery(this.element);

            if (event) {
                // create jQuery event
                const $event = jQuery.Event(event);
                $event.type = type;

                this.$element.trigger($event, args);
            } else {
                // just trigger with type if no event available
                this.$element.trigger(type, args);
            }
        }
    };


    /**
     * keep item in collection, but do not lay it out
     * ignored items do not get skipped in layout
     * @param {Element} elem
     */
    proto.ignore = function (elem) {
        const item = this.getItem(elem);

        if (item) {
            item.isIgnored = true;
        }
    };

    /**
     * return item to layout collection
     * @param {Element} elem
     */
    proto.unignore = function (elem) {
        const item = this.getItem(elem);

        if (item) {
            delete item.isIgnored;
        }
    };

    proto.stamp = function (elems) {
        elems = this._find(elems);

        if (!elems) {
            return;
        }

        this.stamps = this.stamps.concat(elems);

        // ignore
        elems.forEach(this.ignore, this);
    };

    proto.unstamp = function (elems) {
        elems = this._find(elems);

        if (!elems) {
            return;
        }

        elems.forEach(function (elem) {
            // filter out removed stamp elements
            utils.removeFrom(this.stamps, elem);

            this.unignore(elem);
        }, this);
    };

    proto._find = function (elems) {
        if (!elems) {
            return;
        }

        // if string, use argument as selector string
        if (typeof elems === 'string') {
            elems = this.element.querySelectorAll(elems);
        }

        elems = utils.makeArray(elems);

        return elems;
    };

    proto._manageStamps = function () {
        if (!this.stamps || !this.stamps.length) {
            return;
        }

        this._getBoundingRect();

        this.stamps.forEach(this._manageStamp, this);
    };

    proto._getBoundingRect = function () {
        // get bounding rect for container element
        const boundingRect = this.element.getBoundingClientRect();
        const size = this.size;

        this._boundingRect = {
            left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
            top: boundingRect.top + size.paddingTop + size.borderTopWidth,
            right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
            bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
        };
    };

    /**
     * @param {Element} stamp
     **/
    proto._manageStamp = noop;

    /**
     * get x/y position of element relative to container element
     * @param {Element} elem
     * @returns {Object} offset - has left, top, right, bottom
     */
    proto._getElementOffset = function (elem) {
        const boundingRect = elem.getBoundingClientRect();
        const thisRect = this._boundingRect;
        const size = getSize(elem);

        return {
            left: boundingRect.left - thisRect.left - size.marginLeft,
            top: boundingRect.top - thisRect.top - size.marginTop,
            right: thisRect.right - boundingRect.right - size.marginRight,
            bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
        };
    };

    proto.handleEvent = utils.handleEvent;

    /**
     * Bind layout to window resizing
     */
    proto.bindResize = function () {
        window.addEventListener('resize', this);

        this.isResizeBound = true;
    };

    /**
     * Unbind layout to window resizing
     */
    proto.unbindResize = function () {
        window.removeEventListener('resize', this);

        this.isResizeBound = false;
    };

    proto.onresize = function () {
        this.resize();
    };

    utils.debounceMethod(Outlayer, 'onresize', 100);

    proto.resize = function () {
        // don't trigger if size did not change
        // or if resize was unbound. See #9
        if (!this.isResizeBound || !this.needsResizeLayout()) {
            return;
        }

        this.layout();
    };

    /**
     * check if layout is needed post layout
     * @returns Boolean
     */
    proto.needsResizeLayout = function () {
        const size = getSize(this.element);
        // check that this.size and size are there
        // IE8 triggers resize on body size change, so they might not be
        const hasSizes = this.size && size;

        return hasSizes && size.innerWidth !== this.size.innerWidth;
    };

    proto.addItems = function (elems) {
        const items = this._itemize(elems);

        // add items to collection
        if (items.length) {
            this.items = this.items.concat(items);
        }

        return items;
    };

    proto.appended = function (elems) {
        const items = this.addItems(elems);

        if (!items.length) {
            return;
        }

        // layout and reveal just the new items
        this.layoutItems(items, true);
        this.reveal(items);
    };

    proto.prepended = function (elems) {
        const items = this._itemize(elems);

        if (!items.length) {
            return;
        }

        // add items to beginning of collection
        const previousItems = this.items.slice(0);

        this.items = items.concat(previousItems);
        // start new layout
        this._resetLayout();
        this._manageStamps();
        // layout new stuff without transition
        this.layoutItems(items, true);
        this.reveal(items);
        // layout previous items
        this.layoutItems(previousItems);
    };

    proto.reveal = function (items) {
        this._emitCompleteOnItems('reveal', items);

        if (!items || !items.length) {
            return;
        }

        const stagger = this.updateStagger();

        items.forEach(function (item, i) {
            item.stagger(i * stagger);
            item.reveal();
        });
    };

    proto.hide = function (items) {
        this._emitCompleteOnItems('hide', items);

        if (!items || !items.length) {
            return;
        }

        const stagger = this.updateStagger();

        items.forEach(function (item, i) {
            item.stagger(i * stagger);
            item.hide();
        });
    };

    proto.revealItemElements = function (elems) {
        const items = this.getItems(elems);

        this.reveal(items);
    };

    proto.hideItemElements = function (elems) {
        const items = this.getItems(elems);

        this.hide(items);
    };

    /**
     * get Outlayer.Item, given an Element
     * @param {Element} elem
     * @returns {Outlayer.Item} item
     */
    proto.getItem = function (elem) {
        // loop through items to get the one that matches
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (item.element === elem) {
                // return item
                return item;
            }
        }
    };

    /**
     * get collection of Outlayer.Items, given Elements
     * @param {Array} elems
     * @returns {Array} items - Outlayer.Items
     */
    proto.getItems = function (elems) {
        elems = utils.makeArray(elems);

        const items = [];

        elems.forEach(function (elem) {
            const item = this.getItem(elem);

            if (item) {
                items.push(item);
            }
        }, this);

        return items;
    };

    proto.remove = function (elems) {
        const removeItems = this.getItems(elems);

        this._emitCompleteOnItems('remove', removeItems);

        // bail if no items to remove
        if (!removeItems || !removeItems.length) {
            return;
        }

        removeItems.forEach(function (item) {
            item.remove();
            // remove item from collection
            utils.removeFrom(this.items, item);
        }, this);
    };

    proto.destroy = function () {
        // clean up dynamic styles
        const style = this.element.style;

        style.height = '';
        style.position = '';
        style.width = '';

        // destroy items
        this.items.forEach(function (item) {
            item.destroy();
        });

        this.unbindResize();

        const id = this.element.outlayerGUID;

        delete instances[id]; // remove reference to instance by id
        delete this.element.outlayerGUID;

        // remove data for jQuery
        if (jQuery) {
            jQuery.removeData(this.element, this.constructor.namespace);
        }

    };

    /**
     * get Outlayer instance from element
     * @param {Element} elem
     * @returns {Outlayer}
     */
    Outlayer.data = function (elem) {
        elem = utils.getQueryElement(elem);

        const id = elem && elem.outlayerGUID;

        return id && instances[id];
    };


    /**
     * create a layout class
     * @param {String} namespace
     * @param options
     */
    Outlayer.create = function (namespace, options) {
        // sub-class Outlayer
        const Layout = subclass(Outlayer);

        // apply new options and compatOptions
        Layout.defaults = utils.extend({}, Outlayer.defaults);

        utils.extend(Layout.defaults, options);

        Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
        Layout.namespace = namespace;
        Layout.data = Outlayer.data;
        // sub-class Item
        Layout.Item = subclass(Item);

        // -------------------------- declarative -------------------------- //
        utils.htmlInit(Layout, namespace);

        // -------------------------- jQuery bridge -------------------------- //
        // make into jQuery plugin
        if (jQuery && jQuery.bridget) {
            jQuery.bridget(namespace, Layout);
        }

        return Layout;
    };

    function subclass (Parent) {
        function SubClass () {
            Parent.apply(this, arguments);
        }

        SubClass.prototype = Object.create(Parent.prototype);
        SubClass.prototype.constructor = SubClass;

        return SubClass;
    }

    const msUnits = {
        ms: 1,
        s: 1000
    };

    function getMilliseconds (time) {
        if (typeof time === 'number') {
            return time;
        }

        const matches = time.match(/(^\d*\.?\d*)(\w*)/);
        let num = matches && matches[1];
        const unit = matches && matches[2];

        if (!num.length) {
            return 0;
        }

        num = parseFloat(num);

        const mult = msUnits[unit] || 1;

        return num * mult;
    }

    Outlayer.Item = Item;

    return Outlayer;
}));

/**
 * Masonry
 */
(function (window, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD
        define([
            'outlayer/outlayer',
            'get-size/get-size'
        ], factory);
    } else if (typeof module == 'object' && module.exports) { // jshint ignore:line
        // CommonJS
        module.exports = factory( // jshint ignore:line
            require('outlayer'), // jshint ignore:line
            require('get-size') // jshint ignore:line
        );
    } else {
        // browser global
        window.Masonry = factory(
            window.Outlayer,
            window.getSize
        );
    }
}(window, function factory (Outlayer, getSize) {
    'use strict';

    // create an Outlayer layout class
    const Masonry = Outlayer.create('masonry');

    // isFitWidth -> fitWidth
    Masonry.compatOptions.fitWidth = 'isFitWidth';

    const proto = Masonry.prototype;

    proto._resetLayout = function () {
        this.getSize();
        this._getMeasurement('columnWidth', 'outerWidth');
        this._getMeasurement('gutter', 'outerWidth');
        this.measureColumns();

        // reset column Y
        this.colYs = [];
        for (let i = 0; i < this.cols; i++) {
            this.colYs.push(0);
        }

        this.maxY = 0;
        this.horizontalColIndex = 0;
    };

    proto.measureColumns = function () {
        this.getContainerWidth();

        // if columnWidth is 0, default to outerWidth of first item
        if (!this.columnWidth) {
            const firstItem = this.items[0];
            const firstItemElem = firstItem && firstItem.element;

            // columnWidth fall back to item of first element
            this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || this.containerWidth;
        }

        const columnWidth = this.columnWidth += this.gutter;

        // calculate columns
        const containerWidth = this.containerWidth + this.gutter;
        let cols = containerWidth / columnWidth;
        // fix rounding errors, typically with gutters
        const excess = columnWidth - containerWidth % columnWidth;
        // if overshoot is less than a pixel, round up, otherwise floor it
        const mathMethod = excess && excess < 1 ? 'round' : 'floor';

        cols = Math[mathMethod](cols);

        this.cols = Math.max(cols, 1);
    };

    proto.getContainerWidth = function () {
        // container is parent if fit width
        const isFitWidth = this._getOption('fitWidth');
        const container = isFitWidth ? this.element.parentNode : this.element;

        // check that this.size and size are there
        // IE8 triggers resize on body size change, so they might not be
        const size = getSize(container);

        this.containerWidth = size && size.innerWidth;
    };

    proto._getItemLayoutPosition = function (item) {
        item.getSize();

        // how many columns does this brick span
        const remainder = item.size.outerWidth % this.columnWidth;
        const mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
        // round if off by 1 pixel, otherwise use ceil
        let colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);

        colSpan = Math.min(colSpan, this.cols);

        // use horizontal or top column position
        const colPosMethod = this.options.horizontalOrder ? '_getHorizontalColPosition' : '_getTopColPosition';
        const colPosition = this[colPosMethod](colSpan, item);
        // position the brick
        const position = {
            x: this.columnWidth * colPosition.col,
            y: colPosition.y
        };
        // apply setHeight to necessary columns
        const setHeight = colPosition.y + item.size.outerHeight;
        const setMax = colSpan + colPosition.col;

        for (let i = colPosition.col; i < setMax; i++) {
            this.colYs[i] = setHeight;
        }

        return position;
    };

    proto._getTopColPosition = function (colSpan) {
        const colGroup = this._getTopColGroup(colSpan);
        // get the minimum Y value from the columns
        const minimumY = Math.min.apply(Math, colGroup);

        return {
            col: colGroup.indexOf(minimumY),
            y: minimumY
        };
    };

    /**
     * @param {Number} colSpan - number of columns the element spans
     * @returns {Array} colGroup
     */
    proto._getTopColGroup = function (colSpan) {
        if (colSpan < 2) {
            // if brick spans only one column, use all the column Ys
            return this.colYs;
        }

        const colGroup = [];
        // how many different places could this brick fit horizontally
        const groupCount = this.cols + 1 - colSpan;

        // for each group potential horizontal position
        for (let i = 0; i < groupCount; i++) {
            colGroup[i] = this._getColGroupY(i, colSpan);
        }

        return colGroup;
    };

    proto._getColGroupY = function (col, colSpan) {
        if (colSpan < 2) {
            return this.colYs[col];
        }

        // make an array of colY values for that one group
        const groupColYs = this.colYs.slice(col, col + colSpan);

        // and get the max value of the array
        return Math.max.apply(Math, groupColYs);
    };

    // get column position based on horizontal index. #873
    proto._getHorizontalColPosition = function (colSpan, item) {
        let col = this.horizontalColIndex % this.cols;
        const isOver = colSpan > 1 && col + colSpan > this.cols;

        // shift to next row if item can't fit on current row
        col = isOver ? 0 : col;

        // don't let zero-size items take up space
        const hasSize = item.size.outerWidth && item.size.outerHeight;

        this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

        return {
            col: col,
            y: this._getColGroupY(col, colSpan)
        };
    };

    proto._manageStamp = function (stamp) {
        const stampSize = getSize(stamp);
        const offset = this._getElementOffset(stamp);
        // get the columns that this stamp affects
        const isOriginLeft = this._getOption('originLeft');
        const firstX = isOriginLeft ? offset.left : offset.right;
        const lastX = firstX + stampSize.outerWidth;
        let firstCol = Math.floor(firstX / this.columnWidth);
        firstCol = Math.max(0, firstCol);

        let lastCol = Math.floor(lastX / this.columnWidth);
        // lastCol should not go over if multiple of columnWidth #425
        lastCol -= lastX % this.columnWidth ? 0 : 1;
        lastCol = Math.min(this.cols - 1, lastCol);

        // set colYs to bottom of the stamp
        const isOriginTop = this._getOption('originTop');
        const stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;

        for (let i = firstCol; i <= lastCol; i++) {
            this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
        }
    };

    proto._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);

        const size = {
            height: this.maxY
        };

        if (this._getOption('fitWidth')) {
            size.width = this._getContainerFitWidth();
        }

        return size;
    };

    proto._getContainerFitWidth = function () {
        let unusedCols = 0;
        // count unused columns
        let i = this.cols;

        while (--i) {
            if (this.colYs[i] !== 0) {
                break;
            }

            unusedCols++;
        }

        // fit container to columns that have been used
        return (this.cols - unusedCols) * this.columnWidth - this.gutter;
    };

    proto.needsResizeLayout = function () {
        const previousWidth = this.containerWidth;

        this.getContainerWidth();

        return previousWidth !== this.containerWidth;
    };

    return Masonry;
}));
