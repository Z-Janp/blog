'use strict'
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');//cookie解析中间件
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);//初始化
const port = process.env.PORT || 3000;
const app = express();
const dbUrl = 'mongodb://localhost/article';

mongoose.connect(dbUrl);
//配置模板引擎要处理的文件类型 
app.set('views', './app/views');
app.set('view engine', 'jade');
// parse application/json 
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser 
//表单数据格式化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());//session依赖cookie
app.use(session({
    secret: 'Janp',//是防止session不被盗取和篡改,参数做参数签名时所需要的签名密钥
    resave: true,//即使 session 没有被修改，也保存 session 值，默认为 true。
    saveUninitialized: false,//是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    cookie: { maxAge: 60000 * 60 },
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
//定义静态资源目录
app.use(express.static(path.join(__dirname, 'static')));
//配置路由模块，方便维护
require('./config/routes.js')(app);

//日期格式化
app.locals.moment = require('moment');

app.listen(port);
//生产环境配置
if (app.get('env') === 'development') {
    app.set('showStackError', true);//输出报错信息
    app.locals.pretty = true;//output pretty html
}