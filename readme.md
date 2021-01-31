# SCOPin rock: Polarizing microscope simulator

![SCOPin rock logo](./release/images/SCOPin_rock_logo.png)

This Web application simulates polarizing microscope view of the thin section of rock samples.

Deployed web application is [here](https://microscope.fumipo-theta.com).

## Application

The web browser corresponding to ES6 is required. Please view by the latest version Google Chrome, Safari, Firefox, or Microsoft Edge.

*Internet Explorer does not correspond*.

## Usage

### Gesture to operate the view

1. Touch
    * Rotate by swipe
    * Change magnification by pinch in/out
2. Mouse or touchpad
    * Rotate by drag
    * Change magnification by scroll


### Change mode of the microscope

Switch open Nicol and crossed Nicols by a toggle button.

## For development

### Pre-requirements

* install Node.js
  * ver. 15.4 or later is recommended.
* install yarn

### Install packages

```console
yarn install
```

### Testing

```console
yarn test
```

### Build

```console
yarn build
```

The build products are output under the `release` directory.
The entry point of the application is `release/index.html`.

You can switch build mode as below.

Windows (powershell):

```console
$env:NODE_ENV="development"; npm run build
$env:NODE_ENV="production"; npm run build
```

Mac & Linux

```console
NODE_ENV=development npm run build
NODE_ENV=production npm run build
```

### Launch dev server

```console
yarn start
```

Then access to http://localhost:8081/release/ .
If you use Google Chrome, and testing with fetching image packages from remote server, please access via http://lvh.me:8081/release/ to avoid CORS problem.

### Launch storybook

```
yarn storybook
```

Then access to http://localhost:9001 .

### Prepare thin-section image package

Procedure to preparation is documented [here](./docs/operation/procedure_to_prepare_sample_images.md) (now only in Japanese).
After preparation, you should locate them somewhere and configure the application setting.
The location of the image packages can be configure in [src/js/config/config.js](./src/js/config/config.js).
The example is available in [example_image_package_root](./example_image_package_root) directory.

### Deployment flow

This application use Service Worker for caching files to reduce data transfer size.
Therefore, update the version of the Service Worker is necessary to update the code of the client devices.

The deployment procedure is below.

1. Edit source code
2. Update service worker version
3. Build and deploy changes
4. Clear cache of CDN if it is necessary
