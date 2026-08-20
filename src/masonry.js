/* globals define */

/*!
 * Masonry Plugin for jQuery (modernized fork by Peter Pfeufer)
 *
 * @version 1.1.0
 * @author Peter Pfeufer
 * @license GPL-3.0 or later
 * @link https://github.com/ppfeufer/masonry
 *
 * Description: Cascading grid layout library
 *
 * Original Plugin:
 * Author: David DeSandro
 * GitHub: https://github.com/desandro/masonry
 */

/**
 * Masonry
 */
((window, factory) => {
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
})(window, (Outlayer, getSize) => {
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
        const minimumY = Math.min.apply(Math, colGroup);
        let col = colGroup.indexOf(minimumY);

        // get column error margin
        const maxColumnHeightDifference = this._getOption('maxColumnHeightDifference');

        if (maxColumnHeightDifference && maxColumnHeightDifference > 0) {
            // find first column within margin
            for (let c = 0, n = colGroup.length; c < n; c++) {
                if (colGroup[c] <= minimumY + maxColumnHeightDifference) {
                    col = c;

                    break;
                }
            }
        }

        return {
            col: col,
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
});
