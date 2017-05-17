var request = require('sync-request')
var cheerio = require('cheerio')
// 定义一个类
var log = function() {
    console.log.apply(console, arguments)
}
class Room {
    constructor() {
        // 实时城市/房间/增长率
        this.city = ''
        this.RoomData = ''
    }
}
var RoomFromDiv = function(room) {
    // 创建一个房价类的实例并且获取数据
    var e = cheerio.load(room)
    var Rooms = new Room()
    Rooms.city = e('.select-text').text()
    Rooms.RoomData = e('#targetNum').text()

    return Rooms
}
var RoomFromUrl = function(url) {
    // 用 GET 方法获取 url 链接的内容
    var r = request('GET', url)
    var body = r.getBody('utf-8')
    var e = cheerio.load(body)
    var RoomDivs = e('body')
    var rooms = []
    var d = e(RoomDivs).html()
    var m = RoomFromDiv(d)
    rooms.push(m)
    return rooms
}
var saveRoom = function(room) {
    // 数据带有缩进的格式, 第三个参数表示缩进的空格数
    var s = JSON.stringify(room, null, 2)
    // 把 json 格式字符串写入到 文件 中
    var fs = require('fs')
    var path = 'data.txt'
    fs.writeFileSync(path, s)
}
var AllCitys = function () {
    var t = [
        'beijing',
        'dongguan',
        'foshan',
        'guangzhou',
        'hangzhou',
        'qingdao',
        'shenzhen',
        'shanghai',
        'suzhou',
        'zhuhai',
        'zhongshan'
    ]
    return t
}
var __main = function() {
    var t = AllCitys()
    var rooms = []
    for (var i = 0; i < t.length; i++) {
        var city = t[i]
        log(city)
        var url = `http://${city}.qfang.com/fangjia/area`
        var room = RoomFromUrl(url)
        rooms = rooms.concat(room)
    }
    saveRoom(rooms)
}
__main()
