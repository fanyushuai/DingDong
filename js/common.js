var ip = null;
var port = null;
mui.ajax({
    url: '../manifest.json',
    async: false,
    dataType:"json",
    success: function(data) {
        ip = data.ip;
        port = data.port;
    }
});