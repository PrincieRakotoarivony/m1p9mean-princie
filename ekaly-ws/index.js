const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

/* app.set('json replacer', function (key, value) {
    if (this[key] instanceof Date) {
      value = moment(this[key]).format("YYYY-MM-DD HH:mm:ss");
    }
    return value;
}); */

const url = "mongodb+srv://m1p9mean-912:m1p9mean-912@cluster0.lpbgv.mongodb.net/ekaly?retryWrites=true&w=majority";
//const url = "mongodb://localhost:27017/ekaly"
mongoose.connect(url, {useUnifiedTopology: true});

function use_routes(routes){
    Object.keys(routes)
    .forEach((key) => {
        app.use(`/${key}`, routes[key]);
    });
}
  
use_routes(routes);
app.get('/', function (req, res){
    res.json({message: 'Welcome to Ekaly'});
})

const port = process.env.PORT || 3000;
app.listen(port, function (){
    console.log(`Listening on port ${port}`);
});