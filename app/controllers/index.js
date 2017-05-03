const Article = require('../models/article.js');
const Category = require('../models/category.js');
const api = require('../../node_modules/musicapi');

exports.index = (req, res) => {
    Category
        .find({}, { 'name': 1, 'articles': 1, _id: 0 })
        .sort({'meta.updateAt': -1 })
        .populate({
            path: 'articles',
            select: '_id title meta',
            options: {
                sort: { 'meta.createAt': -1 },
                find: { 'status': 1 }
            }
        })
        .exec((err, categories) => {
            if (err) {
                console.log(err);
            }
            res.render('blog', {
                title: 'blog',
                categories: categories
            })
        })
};

exports.pageNotfound = (req, res) => {
    console.log('404 handler, URL' + req.originalUrl);
    res.status(404);
    res.render('404', {
        status: 404,
        title: '您欲访问的页面未找到'
    });
};
exports.showAbout = (req, res) => {
    res.render('about');
}
exports.showResume = (req, res) => {
    res.render('resume');
}
exports.showMusic = (req, res) => {
    res.render('music');
    //api.search('年度之歌', callback);
    //api.id(2497699, 'album', callback);
    //api.id(16705, 'artist', callback);
    //api.id(325145, 'mv', callback);
}
exports.sentMusic = (req, res) => {
    'use strict'
    const songID = [31341931, 114037, 113289, 63914, 190563, 27906003, 25714352, 65487, 187672, 188647, 63650, 95377];
    const songs = [];
    const callback = function (err, songres, body) {
        if (err) {
            console.error(err);
        };
        if (songres.statusCode === 200) {
            const resbody = JSON.parse(body);
            api.id(resbody.songs[0].id, 'lyc', function (err, lycres, lycbody) {
                if (err) {
                    console.log(err);
                }
                const lycjson = JSON.parse(lycbody);
                const lyr = lycjson.uncollected || lycjson.nolyric ? '' : lycjson.lrc.lyric;
                let artname = '',
                    i,
                    len = resbody.songs[0].artists.length;
                if (len > 1) {
                    for (i = 0; i < len; i++) {
                        artname += resbody.songs[0].artists[i].name + '/'
                    }
                    artname = artname.slice(0, -1);
                } else {
                    artname = resbody.songs[0].artists[0].name;
                }
                const song = {
                    songUrl: resbody.songs[0].mp3Url,
                    imgUrl: resbody.songs[0].album.blurPicUrl,
                    songName: resbody.songs[0].name,
                    artName: artname,
                    lyric: lyr
                };
                songs.push(song);
                if (songID.length === songs.length) {
                    res.json(songs);
                }
                //console.log(songs);
            }, { lv: -1 });
        };
    };
    for (let i = 0, len = songID.length; i < len; i++) {
        api.id(songID[i], 'song', callback);
    }
}