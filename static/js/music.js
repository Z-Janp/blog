
(function () {
    var myScroll;
    function loaded() {
        myScroll = new IScroll('#wrapper', { mouseWheel: true });
    }
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    window.addEventListener('load', loaded, false);
    document.body.addEventListener('touchstart', function () { });
    //时间处理
    function timeDispose(number) {
        var minute = parseInt(number / 60, 10);
        var second = parseInt(number % 60, 10);
        minute = minute >= 10 ? minute : "0" + minute;
        second = second >= 10 ? second : "0" + second;
        return minute + ":" + second;
    }
    /*
    27906003 谁是大英雄
    114037   夏日倾情
    31341931 赌神
    25714352 空白格
    113289 合久必婚
    193535 友情岁月
    190563 每天爱你多一些
     */
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
    var _audio = document.getElementById("audio");
    var _$audio = $('#audio');
    var _audio_duration = null;
    var player = {
        data: Songs,
        curIedex: 0,
        playcur: $('.songlist').find('.react'),
        init: function () {
            player.play(0);
            player.playMode('loop');
        },
        playAudio: function () {
            if (_audio.paused) {
                $(".ply").addClass("pause");
                _audio.play();
            } else {
                $(".ply").removeClass("pause");
                _audio.pause();

            }
        },
        play: function (index) {
            var detail = player.data[index];
            _audio.src = detail.songUrl;
            $('.pic').find('.picimg').prop('src', detail.imgUrl);
            $('.tag').find('.song-name').html(detail.songName);
            $('.tag').find('.art-name').html(detail.artName);
            $('.songlist').find('.react').eq(index).addClass('playcur');
            _audio.play();
        },
        playPrev: function () {
            player.playcur.eq(player.curIedex).removeClass('playcur');
            if (player.curIedex === 0) {
                player.curIedex = player.data.length - 1;
            } else {
                player.curIedex--;
            }
            _audio.pause();
            player.play(player.curIedex);
        },
        playNext: function () {
            player.playcur.eq(player.curIedex).removeClass('playcur');
            if (player.curIedex === -1) {
                player.curIedex = 0;
            } else if (player.curIedex === (player.data.length) - 1) {
                player.curIedex = 0;
            } else {
                player.curIedex++;
            }
            _audio.pause();
            player.play(player.curIedex);
        },
        playMode: function (mode) {
            switch (mode) {
                case 'loop':
                    _audio.onended = function () {
                        console.log(player.curIedex);
                        player.playNext();
                    };
                    break;
                case 'single':
                    _audio.onended = function () {
                        _audio.load();
                        _audio.play();
                    };
                    break;
                case 'shuffle':
                    _audio.onended = function () {
                        var index = parseInt((player.data.length - 1) * Math.random());
                        player.playcur.eq(player.curIedex).removeClass('playcur');
                        player.curIedex = index;
                        _audio.pause();
                        player.play(index);
                    };
                    break;
                default: break;
            }
        },
    };
    $('.ply').on('click', player.playAudio);
    $('.prev').on('click', player.playPrev);
    $('.next').on('click', player.playNext);
    $('.mode').find('.icon').on('click', function () {
        _$this = $(this);
        var mode = '';
        _$this.toggleClass(function () {
            if (_$this.hasClass('icon-loop')) {
                mode = 'single';
                return 'icon-loop icon-single';
            } else if (_$this.hasClass('icon icon-single')) {
                mode = 'shuffle';
                return 'icon-single icon-shuffle';
            } else {
                mode = 'loop';
                return 'icon-shuffle icon-loop';
            }
        });
        player.playMode(mode);
    });
    $('#wrapper>.songcont').on('click', 'a', function () {
        var index = parseInt(this.dataset.index, 10);
        var curIedex = player.curIedex;
        if (index !== curIedex) {
            player.playcur.eq(curIedex).removeClass('playcur');
            player.curIedex = index;
            player.play(this.dataset.index);
        }
    });
    $('.list .icon-list').on('click', function (ev) {
        $('.songlist').addClass('fadeInUpBig');
        this.dataset.action = 'show';
        ev.stopPropagation();
    })
    $('.songlist>.clolist').on('click', function () {
        var _$songlist = $('.songlist');
        _$songlist.removeClass('fadeInUpBig').addClass('fadeOutDownBig');
        setTimeout(function () {
            _$songlist.removeClass('fadeOutDownBig');
        }, 500);
        document.querySelectorAll('.list>.icon-list')[0].dataset.action = 'hide';

    });
    $('#player').on('click', function () {
        if (document.querySelectorAll('.list>.icon-list')[0].dataset.action === 'show') {
            $('.songlist>.clolist').click();
        }
    });
    player.init();
    _$audio.on('timeupdate', function () {
        if (_audio_duration > 0) {
            $('.cur').width(_audio.currentTime * 100 / _audio_duration + '%');
            $('.curTime').html(timeDispose(_audio.currentTime));
        }
    });
    _$audio.on('progress', function () {
        var timeRanges = _audio.buffered;
        // 获取以缓存的时间
        if (timeRanges.length) {
            var timeBuffered = timeRanges.end(timeRanges.length - 1);
            // 获取缓存进度，值为0%到100%
            var duration = _audio.duration;
            if (duration > 0) {
                $('.rdy').width((timeBuffered / duration) * 100 + '%');
            }
        }
    });
    _$audio.on('loadedmetadata', function () {
        _audio_duration = _audio.duration;
        $('.tolTime').html(timeDispose(_audio_duration));
    });
    $('.probg').on('click', function (ev) {
        _audio.pause();
        var seektime = ev.offsetX / $(this).width() * _audio.duration;
        if ('fastSeek' in audio) {
            _audio.fastSeek(seektime);
            _audio.play();
        } else {
            _audio.currentTime = seektime;
            setTimeout(function () {
                _audio.play();
            }, 150);
        }
    });
})();