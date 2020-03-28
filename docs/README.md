[imgstry](README.md) › [Globals](globals.md)

# imgstry

Imgstry
=======

[![npm version](https://badge.fury.io/js/imgstry.svg)](https://badge.fury.io/js/imgstry)
![ci](https://github.com/visual-cortex/imgstry/workflows/ci/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/58e446d2b05ef9317064/maintainability)](https://codeclimate.com/github/visual-cortex/imgstry/maintainability)
<a href="https://codeclimate.com/github/visual-cortex/imgstry/test_coverage"><img src="https://api.codeclimate.com/v1/badges/58e446d2b05ef9317064/test_coverage" /></a>

Development Notes
-----------------

If you get this error `Pre-built binaries not installable for canvas@X.X.X and node@Y.Y.Y` when running `npm i`, that means that the `canvas` package cannot find a prebuilt version compatible with the current `node` version. The required dependencies must be installed manually in order to install all packages:

```
    choco install -y python2 gtk-runtime microsoft-build-tools libjpeg-turbo
```

Documentation
-------------

Dive in [here](docs/globals.md).
