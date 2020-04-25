const express = require('express');
const util = require('util');
const app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    //res.send("Hello NodeJS");
    res.render('index', {name: '홍길동'});
});

app.get('/test/:email', (req, res) => {
    //res.send("Hello NodeJS");
    res.render('index', {name: '홍길동'});
});

const server = app.listen(7000, function(){
  util.log("Express's started on port 7000");
});
