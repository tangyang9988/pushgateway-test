module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://172.16.0.15:8088/',
                target: 'http://172.20.0.91:9001/',
                // target: 'http://172.20.0.77:9001/',
                secure: false
            }
        }
    }
}