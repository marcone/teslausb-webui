# TeslaUSB UI

## Dev

1. Installl [Nodejs](https://nodejs.org/).
2. Into `ui` folder, run `npm install` to install dependencies.
3. Set env variables:
      * PROXT_TARGET=http://xxx.xxx.xxx.xxx  PI's web page url which is used inside dev server to load resource from PI
      * PORT=xxxx  dev server's port
4. Run `npm run serve` to start dev server.

```
PROXY_TARGET=http://192.168.1.100 PORT=3000 npm run serve
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Build

```
npm run build
```

## Icon

```
<VeuiIcon name="icon-name" />
```

### Use preset icons

Find available icons [here](https://veui.dev/components/icon).

Import icon first then use.

```
import 'veui-theme-dls-icons/play';
```

### Use custom icons

IconData: https://github.com/Justineo/vue-awesome#registering-custom-icons

```
import {Icon} from 'veui';

Icon.register(iconData);
```
