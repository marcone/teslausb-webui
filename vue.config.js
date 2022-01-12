const veuiLoaderOptions = require('veui-theme-dls/veui-loader-options');
const path = require('path');

const proxyTarget = process.env.PROXY_TARGET;

async function before(app, server, compiler) {
    app.get('/cgi-bin/videolist.sh', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.sendFile(path.resolve(__dirname, 'mock/videolist.txt'));
    });
}

module.exports = {
    devServer: {
        // before,
        proxy: {
            '/*.txt': { target: proxyTarget },
            '/*.log': { target: proxyTarget },
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
