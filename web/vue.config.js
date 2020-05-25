module.exports = {
    devServer: {
        host: 'localhost',  // localhost || 本机ip
        port: '8088',       // 端口号
        open: true,         // 是否自动打开浏览器
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