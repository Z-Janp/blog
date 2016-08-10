
(function () {
    //局部滚动
    var myScroll;
    function loaded() {
        myScroll = new IScroll('#wrapper', { mouseWheel: true, preventDefault: false });
    }
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    //时间处理
    function timeDispose(number) {
        var minute = parseInt(number / 60, 10);
        var second = parseInt(number % 60, 10);
        minute = minute >= 10 ? minute : "0" + minute;
        second = second >= 10 ? second : "0" + second;
        return minute + ":" + second;
    }
    $.ajax({
        url: '/api/request/music',
        type: 'get',
        success: function (data) {
            var inserthtml = '';
            for (var i = 0, len = data.length; i < len; i++) {
                inserthtml += '<li class="react" data-index="' + i + '"><div></div><span>' + data[i].songName + '&nbsp;</span><span class="list-art-name">' + data[i].artName + '</span></li>';
            }
            $('#wrapper>.songcont').html(inserthtml);
            player.init(data);
            //待dom加载完毕初始化滚动
            loaded();
        },
        error: function (error) {
            console.log(error);
        }
    });
    /*
    27906003 谁是大英雄
    114037   夏日倾情
    31341931 赌神
    25714352 空白格
    113289 合久必婚
    193535 友情岁月
    190563 每天爱你多一些
     */
    var _audio = document.getElementById("audio");
    var _$audio = $('#audio');
    var _audio_duration = null;
    var player = {
        data: null,
        curIedex: 0,
        playcur: null,
        regex: /\[(\d{2})\:(\d{2})\.(\d{2,4})\](.+)/,
        curTime: '',
        _$lyric_wrap: $('.lyric_wrap'),
        lyricLineHeight: 0,
        init: function (songs) {
            player.data = songs;
            player.playcur = $('#wrapper>.songcont>.react');
            player.playAppoint(0);
            player.playMode('loop');
        },
        play: function () {
            $('.pic>.picimg').addClass('playing').removeClass('pause');
            _audio.play();
        },
        playAudio: function () {
            if (_audio.paused) {
                $(".ply").addClass("pause");
                player.play();
            } else {
                $(".ply").removeClass("pause");
                $('.pic>.picimg').addClass('pause');
                _audio.pause();
            }
        },
        playAppoint: function (index) {
            var detail = player.data[index];
            _audio.src = detail.songUrl;
            $('.pic').find('.picimg').prop('src', detail.imgUrl);
            $('.tag').find('.song-name').html(detail.songName);
            $('.tag').find('.art-name').html(detail.artName);
            $('#wrapper>.songcont>.react').eq(index).addClass('playcur');
            player.play();
            if (detail.lyric && !(detail.lyric instanceof Object)) {
                detail.lyric = player.parseLyric(detail.lyric);
            }
            if (detail.lyric) {
                var lry = '';
                for (var item in detail.lyric) {
                    lry += '<p>' + detail.lyric[item].lyric + '</p>';
                }
                player._$lyric_wrap.html(lry);
                player.lyricLineHeight = player._$lyric_wrap.find('p').height();
                (function () {
                    var lrcScroll;
                    lrcScroll = new IScroll('.lrc', { mouseWheel: true, preventDefault: false });
                })();
            } else {
                player._$lyric_wrap.html('<p>未找到歌词~</p>');
            }
        },
        autoPlay: function () {
            if (_audio.paused) {
                _audio.load(); // iOS 9   需要额外的 load 一下
                player.play(); // iOS 7/8 仅需要 play 一下
            }
        },
        playPrev: function () {
            player.playcur.eq(player.curIedex).removeClass('playcur');
            if (player.curIedex === 0) {
                player.curIedex = player.data.length - 1;
            } else {
                player.curIedex--;
            }
            if (_audio.paused) {
                $(".ply").addClass("pause");
            } else {
                _audio.pause();
            }
            player.playAppoint(player.curIedex);
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
            if (_audio.paused) {
                $(".ply").addClass("pause");
            } else {
                _audio.pause();
            }
            player.playAppoint(player.curIedex);
        },
        playMode: function (mode) {
            switch (mode) {
                case 'loop':
                    _$audio.on('ended', function () {
                        player.playNext();
                    });
                    break;
                case 'single':
                    _$audio.on('ended', function () {
                        _audio.load();
                        _audio.play();
                    });
                    break;
                case 'shuffle':
                    _$audio.on('ended', function () {
                        var index = parseInt((player.data.length - 1) * Math.random());
                        player.playcur.eq(player.curIedex).removeClass('playcur');
                        player.curIedex = index;
                        _audio.pause();
                        player.playAppoint(index);
                    });
                    break;
                default: break;
            }
        },
        parseLyric: function (lrc) {
            var lyrics = lrc.split("\n");
            var lrcObj = {};
            for (var i = 0; i < lyrics.length; i++) {
                var matches = player.regex.exec(lyrics[i]);
                if (matches) {
                    var m = parseFloat(matches[1]) >= 10 ? parseFloat(matches[1]) : '0' + parseFloat(matches[1]);
                    var s = parseFloat(matches[2]) >= 10 ? parseFloat(matches[2]) : '0' + parseFloat(matches[2]);
                    var f = parseFloat(matches[3]);
                    var time = m + ':' + s;//m * 60 + s;//minute + ":" + second
                    var lyric = matches[4];
                    lrcObj[time] = {
                        lyric: lyric,
                        index: i
                    };
                } else {
                    //未匹配
                    //console.log(line);
                }
            }
            return lrcObj;
        }
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
    //播放列表操作
    $('#wrapper>.songcont').on('click', 'li', function () {
        var index = parseInt(this.dataset.index, 10);
        var curIedex = player.curIedex;
        if (index !== curIedex) {
            player.playcur.eq(curIedex).removeClass('playcur');
            if (_audio.paused) {
                $(".ply").addClass("pause");
            }
            player.curIedex = index;
            player.playAppoint(this.dataset.index);
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
    //手机端自动播放
    $(document).one('touchstart', player.autoPlay);
    //监听播放器的状态
    _$audio.on('timeupdate', function () {
        if (_audio_duration > 0) {
            $('.cur').width(_audio.currentTime * 100 / _audio_duration + '%');
            var curTime = timeDispose(_audio.currentTime);
            //限定1s刷新一次
            if (player.curTime !== curTime) {
                var lrc = player.data[player.curIedex].lyric;
                if (lrc[curTime]) {
                    player._$lyric_wrap.find('.on').removeClass('on');
                    var p = player._$lyric_wrap.find("p:nth-child(" + (lrc[curTime].index + 1) + ")");
                    p.addClass("on");
                    player._$lyric_wrap.css({
                        "transform": "translate(0,-" + lrc[curTime].index * player.lyricLineHeight + "px)",
                        "-ms-transform": "translate(0,-" + lrc[curTime].index * player.lyricLineHeight + "px)",
                        "-moz-transform": "translate(0,-" + lrc[curTime].index * player.lyricLineHeight + "px)",
                        "-webkit-transform": "translate(0,-" + lrc[curTime].index * player.lyricLineHeight + "px)",
                        "-o-transform": "translate(0,-" + lrc[curTime].index * player.lyricLineHeight + "px)"
                    });
                }
                player.curTime = curTime;
                $('.curTime').html(curTime);
            }
        }
    });
    _$audio.on('progress', function () {
        var timeRanges = _audio.buffered;
        // 获取已缓存的时间
        if (timeRanges.length > 0) {
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
    //调整播放进度
    $('.probg').on('click', function (ev) {
        var seektime = ev.offsetX / $(this).width() * _audio.duration;
        if ('fastSeek' in audio) {
            _audio.fastSeek(seektime);
            if (!_audio.paused) {
                _audio.play();
            }
        } else {
            _audio.currentTime = seektime;
            setTimeout(function () {
            }, 150);
            if (!_audio.paused) {
                _audio.play();
            }
        }
    });
})();