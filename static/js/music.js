
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
    // $.ajax({
    //     url: '/api/request/music',
    //     type: 'get',
    //     success: function (data) {
    //         var inserthtml = '';
    //         for (var i = 0, len = data.length; i < len; i++) {
    //             inserthtml += '<li class="react" data-index="' + i + '"><div></div><span>' + data[i].songName + '&nbsp;</span><span class="list-art-name">' + data[i].artName + '</span></li>';
    //         }
    //         $('#wrapper>.songcont').html(inserthtml);
    //         player.init(data);
    //         //待dom加载完毕初始化滚动
    //         loaded();
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     }
    // });

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
    var data = [
        {
            "songUrl":'http://m10.music.126.net/20170521124149/ddd76c1b9b548ac44d86808b638b1d9c/ymusic/5a4f/5d18/9634/784d61d0141a1a8bfa0c0f616bb54649.mp3',
            "imgUrl":"http://p1.music.126.net/D_e8zPgwkKCk1uSF-HSgbw==/18806046883327256.jpg",
            "songName":"独家记忆",
            "artName":"陈小春",
            "lyric":"[00:00.00] 作曲 : 陶昌廷\n[00:01.00] 作词 : 易家扬\n[00:24.880]忘记分开后的第几天起\n[00:30.030]喜欢一个人 看下大雨\n[00:35.680]没联络 孤单就像连锁反应\n[00:41.600]想要快乐都没力气\n[00:47.190]\n[00:49.530]雷雨世界像场灾难电影\n[00:54.680]让现在的我 可怜到底\n[01:00.160]对不起 谁也没有时光机器\n[01:06.110]已经结束的 没有商量的余地\n[01:14.280]\n[01:15.280]我希望你 是我独家的记忆\n[01:21.110]摆在心底\n[01:23.560]不管别人说的多么难听\n[01:29.130]现在我拥有的事情\n[01:32.900]是你 是给我一半的爱情\n[01:37.790]\n[01:38.490]我喜欢你 是我独家的记忆\n[01:44.500]谁也不行\n[01:47.020]从我这个身体中拿走你\n[01:52.590]在我感情的封锁区\n[01:56.390]有关于你 绝口不提 没问题\n[02:06.560]\n[02:28.830]雷雨世界像场灾难电影\n[02:33.490]让现在的我 可怜到底\n[02:39.240]对不起 谁也没有时光机器\n[02:46.010]已经结束的 没有商量的余地\n[02:53.770]我希望你 是我独家的记忆\n[02:53.970]\n[02:59.500]摆在心底\n[03:02.160]不管别人说的多么难听\n[03:07.900]现在我拥有的事情\n[03:11.890]是你 是给我一半的爱情\n[03:16.770]\n[03:17.470]我喜欢你 是我独家的记忆\n[03:23.440]谁也不行\n[03:26.200]从我这个身体中拿走你\n[03:31.900]在我感情的封锁区\n[03:36.580]有关于你 绝口不提 没关系\n[03:44.930]\n[03:44.430]我希望你 是我独家的记忆\n[03:50.240]摆在心底\n[03:52.980]不管别人说的多么难听\n[03:58.610]现在我拥有的事情\n[04:02.590]是你 是给我一半的爱情\n[04:07.530]\n[04:08.230]我喜欢你 是我独家的记忆\n[04:14.180]谁也不行\n[04:16.830]从我这个身体中拿走你\n[04:22.480]在我感情的封锁区\n[04:29.370]有关于你 绝口不提 没限期\n[04:40.950]\n"
        },{
            "songUrl":'http://m10.music.126.net/20170521124019/ca10090c957b5c730c57aefec14201d3/ymusic/933b/2df2/0e93/1a505d800a4eca57b62a63d8afdd752d.mp3',
            "imgUrl":"http://p1.music.126.net/G-C-qam5WcATpN_7zkhxWA==/34084860473101.jpg",
            "songName":"每天爱你多一些",
            "artName":"张学友",
            "lyric":"[00:00.00] 作曲 : 桑田佳佑\n[00:01.00] 作词 : 林振强\n[00:15.630] 无求甚么 无寻甚么\n[00:23.570] 突破天地 但求夜深\n[00:28.60] 奔波以后 能望见你\n[00:32.960] 你可否知道么\n[00:37.950] 平凡亦可 平淡亦可\n[00:42.560] 自有天地 但求日出\n[00:47.280] 清早到后 能望见你\n[00:52.70] 那已经很好过\n[00:57.450] 当身边的一切如风 是你让我找到根蒂\n[01:08.410] 不愿离开 只愿留低 这情是永不枯萎\n[01:17.690] 而每过一天 每一天 这醉者\n[01:22.920] 便爱你多些 再多些 至满泻\n[01:27.539] 我发觉我最爱与你编写\n[01:31.910] 哦噢 以后明天的深夜\n[01:36.870] 而每过一天 每一天 这醉者\n[01:41.680] 便爱你多些 再多些 至满泻\n[01:46.490] 我最爱你与我这生一起\n[01:51.180] 哦噢 哪惧明天风高路斜\n[02:00.50] 呜~~~\n[02:10.509] 名是甚么 财是甚么\n[02:18.10] 是好滋味 但如在生\n[02:22.840] 朝朝每夜 能望见你\n[02:27.640] 那更加的好过\n[02:33.50] 当身边的一切如风 是你让我找到根蒂\n[02:44.0] 不愿离开 只愿留低 情是永不枯萎\n[02:53.210] 而每过一天 每一天 这醉者\n[02:58.360] 便爱你多些 再多些 至满泻\n[03:03.210] 我发觉我最爱与你编写\n[03:07.610] 哦噢 以后明天的深夜\n[03:12.600] 而每过一天 每一天 这醉者\n[03:17.480] 便爱你多些 再多些 至满泻\n[03:22.40] 我最爱你与我这生一起\n[03:26.510] 哦噢 哪惧明天风高路斜\n[03:32.350] 哦噢噢 而每过一天 每一天 这醉者\n[03:41.300] 便爱你多些 再多些 至满泻\n[03:46.60] 我发觉我最爱与你编写\n[03:50.460] 哦噢 以后明天的深夜\n[03:55.370] 而每过一天 每一天 这情深者\n[04:00.490] 便爱你多些 然后再多一些\n[04:05.50] 我最爱你与我这生一起\n[04:09.250] 哦噢 哪惧明天风高路斜\n[04:17.670] 呜~~~~\n"
        },{
            "songUrl":'http://m10.music.126.net/20170521124107/f933a35e099e98f0d5aa6b63fde3ae1f/ymusic/344b/c23a/71f9/5c29810e09d2978a0c61dac103b60f7d.mp3',
            "imgUrl":"http://p1.music.126.net/4EKzVVjcVOwq_QamSKLR5w==/65970697682613.jpg",
            "songName":"她来听我的演唱会",
            "artName":"张学友",
            "lyric":"[00:00.00] 作曲 : 黄明洲\n[00:01.00] 作词 : 梁文福\n[00:24.000]她来听我的演唱会\n[00:31.000]在十七岁的初恋第一次约会\n[00:39.000]男孩为了她彻夜排队\n[00:46.000]半年的积蓄买了门票一对\n[00:53.000]我唱得她心醉 我唱得她心碎\n[01:01.000]三年的感情一封信就要收回\n[01:09.000]她记得月台汽笛声声在催\n[01:13.000]播我的歌陪着人们流泪\n[01:19.000]嘿 陪人们流泪\n[01:30.000]她来听我的演唱会\n[01:36.000]在二十五岁恋爱是风光明媚\n[01:44.000]男朋友背着她送人玫瑰\n[01:51.000]她不听电话夜夜听歌不睡\n[01:59.000]我唱得她心醉 我唱得她心碎\n[02:07.000]成年人分手后都像无所谓\n[02:15.000]和朋友一起买醉卡拉OK\n[02:18.000]唱我的歌陪着画面流泪\n[02:23.000]嘿 陪着流眼泪\n[02:49.000]我唱得她心醉 我唱得她心碎\n[02:57.000]在三十三岁真爱那么珍贵\n[03:05.000]年轻的女孩求她让一让位\n[03:09.000]让男人决定跟谁远走高飞\n[03:14.000]嘿 谁在远走高飞\n[03:19.000]我唱得她心醉 我唱得她心碎\n[03:28.000]她努力不让自己看来很累\n[03:36.000]岁月在听我们唱无怨无悔\n[03:39.000]在掌声里唱到自己流泪\n[03:44.000]嘿 唱到自己流泪\n[03:52.000]她来听我的演唱会\n[03:59.000]在四十岁后听歌的女人很美\n[04:07.000]小孩在问她为什么流泪\n[04:14.000]身边的男人早已渐渐入睡\n[04:22.000]她静静听着我们的演唱会\n"
        }
    ];
    var inserthtml = '';
    for (var i = 0, len = data.length; i < len; i++) {
        inserthtml += '<li class="react" data-index="' + i + '"><div></div><span>' + data[i].songName + '&nbsp;</span><span class="list-art-name">' + data[i].artName + '</span></li>';
    }
    $('#wrapper>.songcont').html(inserthtml);
    player.init(data);
    //待dom加载完毕初始化滚动
    loaded();
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