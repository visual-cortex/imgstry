# Imgstry

## Development Notes
  If you get this error `Pre-built binaries not installable for canvas@X.X.X and node@Y.Y.Y` when running `npm i`, that means that the `canvas` package cannot find a prebuilt version compatible with the current `node` version. The required dependencies must be installed manually in order to install all packages:
  ```
    choco install -y python2 gtk-runtime microsoft-build-tools libjpeg-turbo
  ```

## Documentation
