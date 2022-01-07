const veuiLoaderOptions = require('veui-theme-dls/veui-loader-options');

const proxyTarget = process.env.PROXY_TARGET;

if (!process.env.VEUI_LOCALE) {
    process.env.VEUI_LOCALE = 'en-US';
}

module.exports = {
    devServer: {
        proxy: {
            '/cgi-bin/': { target: proxyTarget },
            '/TeslaCam/': { target: proxyTarget }
        }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            },
        },
    },
    transpileDependencies: ['veui'],
    configureWebpack: {
        plugins: [
            require('unplugin-vue-components/webpack')({
                resolvers: [require('unplugin-vue-components/resolvers').VeuiResolver({})]
            }),
        ],
    },
    chainWebpack
};

function chainWebpack(config) {
    config.module
        .rule('veui')
        .test(/\.vue$/)
        .pre()
        .use('veui-loader')
        .loader('veui-loader')
        .tap(() => veuiLoaderOptions);
}
