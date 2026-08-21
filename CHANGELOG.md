# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog] and this project adheres to [Semantic Versioning].

<!--
GitHub MD Syntax:
https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax

Highlighting:
https://docs.github.com/assets/cb-41128/mw-1440/images/help/writing/alerts-rendered.webp

> [!NOTE]
>
> Highlights information that users should take into account, even when skimming.

> [!TIP]
>
> Optional information to help a user be more successful.

> [!IMPORTANT]
>
> Crucial information necessary for users to succeed.

> [!WARNING]
>
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
>
> Advised about risks or negative outcomes of certain actions.
-->

## [In Development] - Unreleased

<!--
Section Order:

### Added
### Fixed
### Changed
### Deprecated
### Removed
### Security
### Miscellaneous
-->

<!-- Your changes go here -->

### Changed

- Build config updated

## [1.1.1] - 2026-08-21

### Added

- Example files

### Fixed

- Uncaught TypeError: `$(...).masonry` is not a function

### Changed

- Build config updated

## [1.1.0] - 2026-08-20

### Added

- Duplicate load protection to prevent multiple instances of the Masonry library from being loaded on the same page, which could lead to unexpected behavior and performance issues.

## [1.0.0] - 2026-08-20

### Fixed

- Repository link in main JS comment header was incorrect and has been updated to point to the correct repository

## [0.0.2] - 2026-08-09

### Added

- `maxColumnHeightDifference` as an option in an effort to make the masonry layout
  more flexible and allow for a more even distribution of items across columns.

### Changed

- Convert the factory to an arrow function

## [0.0.1] - 2026-08-09

### Changed

- Initial release

<!-- Links to be updated upon release -->

[0.0.1]: https://github.com/ppfeufer/masonry/commits/v0.0.1 "v0.0.1"
[0.0.2]: https://github.com/ppfeufer/masonry/compare/v0.0.1...v0.0.2 "v0.0.2"
[1.0.0]: https://github.com/ppfeufer/masonry/compare/v0.0.2...v1.0.0 "v1.0.0"
[1.1.0]: https://github.com/ppfeufer/masonry/compare/v1.0.0...v1.1.0 "v1.1.0"
[1.1.1]: https://github.com/ppfeufer/masonry/compare/v1.1.0...v1.1.1 "v1.1.1"
[in development]: https://github.com/ppfeufer/masonry/compare/v1.1.1...HEAD "In Development"
[keep a changelog]: http://keepachangelog.com/ "Keep a Changelog"
[semantic versioning]: http://semver.org/ "Semantic Versioning"
