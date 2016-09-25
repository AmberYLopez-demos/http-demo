var http = require('http');
var cheerio = require('cheerio');//能够解析html
var url = 'http://www.imooc.com/learn/348';


function filterChapters(html) {
    var $ = cheerio.load(html);//把源码加载进来
    var chapters = $('.chapter');

    var courseDate = [];
    chapters.each(function (item) {
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').text();
        var videos = chapter.find('.video').children('li');
        var chapterDate = {
            chapterTitle: chapterTitle,
            videos: []
        };
        videos.each(function (item) {
            var video = $(this).find('.J-media-item');
            var videoTitle = video.text();
            var id = video.attr('href').split('/video/')[1];

            chapterDate.videos.push({
                title: videoTitle,
                id: id
            })
        });
        courseDate.push(chapterDate);
    });
    return courseDate;
}

function printCourseInfo(courseData) {
    courseData.forEach(function (item) {
        var chapterTitle = item.chapterTitle;
        console.log(chapterTitle + '\n');
        item.videos.forEach(function (video) {
            console.log('[' + video.id + ']' + video.title + '\n');
        })
    })
}
http.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    });
    res.on('end', function () {
        var courseDate = filterChapters(html);
        printCourseInfo(courseDate);
    })
}).on('error', function () {
    console.log('获取数据出错.');
});