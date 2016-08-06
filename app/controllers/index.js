const Article = require('../models/article.js');
const Category = require('../models/category.js');
exports.index = (req, res) => {
    Category
        .find({}, { 'name': 1, 'articles': 1, _id: 0 })
        .populate({ path: 'articles', select: '_id title', options: { sort: { 'meta.createAt': -1 } } })
        .exec((err, categories) => {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'blog',
                categories: categories
            })
        })
};
exports.search = (req, res) => {
    const q = req.body.search;
    const regexp = new RegExp(q + '.*', 'i');
    console.log(q);
    Article
        .find({ "$or": [{ 'title': regexp }, { 'content': regexp }] })
        .exec((err, articles) => {
            res.json({ success: true, articles: articles });
        })
}
exports.pageNotfound = (req, res) => {
    console.log('404 handler, URL' + req.originalUrl);
    res.status(404);
    res.render('404', {
        status: 404,
        title: '您欲访问的页面未找到'
    });
};
exports.showResume = (req, res) => {
    res.render('resume');
}
exports.showMusic = (req, res) => {
    var Songs = [{
        songUrl: 'http://m2.music.126.net/qVgoSa4HGtKYTZw-NuRBhQ==/2900511674279376.mp3',
        imgUrl: 'http://p3.music.126.net/k_fcxMCLHEJk4X70mxxQSA==/2912606302143493.jpg',
        songName: '赌神',
        artName: '卢冠廷',
        lyric: ''
    }, {
            songUrl: 'http://m2.music.126.net/VylJ56H9uv5MyM2eAOeHaw==/3275445139217868.mp3',
            imgUrl: 'http://p3.music.126.net/i2YqeMpR2DPuj15M-B1skA==/5816416510959096.jpg',
            songName: '你还要我怎样',
            artName: '薛之谦',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/xzD20CfWhcZe8ei0u4kgNQ==/5654788301713969.mp3',
            imgUrl: 'http://p4.music.126.net/Tti3Cp2KTd0wmwDTSXMq8g==/5661385371479175.jpg',
            songName: 'Oh Father',
            artName: 'Bodhi Jones',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/-j_ZP0B2f9PyBniGwXyN5g==/6636652186643852.mp3',
            imgUrl: 'http://p3.music.126.net/nP48IWjEbgXmvmbMRD7HPg==/2540971374328644.jpg',
            songName: '17岁',
            artName: '刘德华',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/MvmE1RzkW7pTjN4lgsEe-w==/5913173534292763.mp3',
            imgUrl: 'http://p3.music.126.net/cEzneoBlhD5eeOyoc664fA==/3383197279803332.jpg',
            songName: '谁是大英雄',
            artName: '张学友',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/x7coPl5xrTypO90Zs88RmQ==/1285329092878032.mp3',
            imgUrl: 'http://p3.music.126.net/uYCTBhoRY8BF_-0jZ_5YAg==/1718536674223651.jpg',
            songName: '夏日倾情',
            artName: '黎明',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/KReV3o3WB8L4VJR6mvl-5g==/2153943278813262.mp3',
            imgUrl: 'http://p3.music.126.net/s2rrkEZ6S7UVAJI-D1M4lA==/2258396883454110.jpg',
            songName: '空白格',
            artName: '杨宗纬',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/DJkwzBtOvA9wIfouQLtWRg==/1190771092888605.mp3',
            imgUrl: 'http://p4.music.126.net/-yYvrC0SLv1dD_bDnEUE7g==/96757023261526.jpg',
            songName: '友情岁月',
            artName: '郑伊健',
            lyric: ''
        }, {
            songUrl: 'http://m2.music.126.net/qcvkgzbRrqBCLsgRnI2xHw==/1143492092895642.mp3',
            imgUrl: 'http://p3.music.126.net/G-C-qam5WcATpN_7zkhxWA==/34084860473101.jpg',
            songName: '每天爱你多一些',
            artName: '张学友',
            lyric: ''
        }];
    res.render('music', {
        song: Songs
    });
}