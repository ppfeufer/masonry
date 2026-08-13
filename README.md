# Masonry - Cascading grid layout library

**Cascading grid layout library**

______________________________________________________________________

<!-- mdformat-toc start --slug=github --maxlevel=6 --minlevel=2 -->

- [What is Masonry?](#what-is-masonry)
- [Install](#install)
  - [Download](#download)
- [Usage](#usage)
  - [With jQuery](#with-jquery)
  - [With Vanilla JavaScript](#with-vanilla-javascript)
  - [With HTML](#with-html)
- [Development](#development)

<!-- mdformat-toc end -->

______________________________________________________________________

## What is Masonry?<a name="what-is-masonry"></a>

Masonry is a JavaScript grid layout library. It works by placing elements in optimal
position based on available vertical space, sort of like a mason fitting stones in a
wall. You've probably seen it in use all over the Internet.

## Install<a name="install"></a>

### Download<a name="download"></a>

Download the latest release from [GitHub](https://github.com/ppfeufer/masonry/releases/latest/download/masonry.zip).

## Usage<a name="usage"></a>

### With jQuery<a name="with-jquery"></a>

```js
$('.grid').masonry({
    // options...
    itemSelector: '.grid-item',
    columnWidth: 200
});
```

### With Vanilla JavaScript<a name="with-vanilla-javascript"></a>

```js
// vanilla JS
// init with element
const grid = document.querySelector('.grid');
const msnry = new Masonry(grid, {
    // options...
    itemSelector: '.grid-item',
    columnWidth: 200
});

// init with selector
const msnry = new Masonry('.grid', {
    // options...
});
```

### With HTML<a name="with-html"></a>

Add a `data-masonry` attribute to your element. Options can be set in JSON in the value.

```html
<div class="grid" data-masonry='{"itemSelector": ".grid-item", "columnWidth": 200}'>
    <div class="grid-item"></div>
    <div class="grid-item"></div>
    ...
</div>
```

## Development<a name="development"></a>

To rebuild the distributable files in `dist/` from the current `masonry.js` source and its bundled browser dependencies, run:

```bash
npm install
npm run build
```

This will:

- create `dist/masonry.js` by concatenating the required browser-ready dependency files and the local `masonry.js`
- create `dist/masonry.min.js`
- create `dist/masonry.min.js.map`
