/**
 * Created by Лев on 15.04.2018.
 */

var express = require('express'),
    bodyParser = require('body-parser');
var fs = require("fs");
var secureRandom=require('secure-random');
var app = express();
var url1='mongodb://127.0.0.1:27017/names';
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

const uuidv4 = require('uuid/v4');
sha3_256 = require('js-sha3').sha3_256;

var createHmac = require('create-hmac');

app.use(bodyParser.json());//to parse json
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
var names=[];
//["Stone","Scissors","Paper","Lizard","Spock"]
var resultMass=["Gamer Win","Draw","Robot Win"];

var compRes;//result of comp(number of word)
var secret_key;//key
app.get('/buttons',function(req,res){
    //console.log("Get 1");

    res.send(names);
})
app.get('/hash',function(req,res){//return us the result of comp in hash
    function robotAnswer(){
        function robotChoose(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        var max=names.length;
        compRes=robotChoose(0,max);
        secret_key=secureRandom(20, {type: 'Buffer'}).toString('hex');
        var hmac = createHmac('sha256', Buffer.from(secret_key));
        hmac.update(names[compRes]);
        var hash=hmac.digest().toString('hex');
        return hash;
    }
    var result=robotAnswer();
    res.send(JSON.stringify(result));
})

app.get('/battle',function(req,res){//battle & return us result of it and pre-hashed string
    function battle(roboAnswer,gamerAnswer)//2 id in rulesArray;
    {
        var go=0;//nobody win
        var step=names.length/2;
        if(roboAnswer>gamerAnswer){
            if(roboAnswer-gamerAnswer<step){
                go=-1;//robot win
            }
            else{
                go=1;//gamer win
            }
        }
        if(roboAnswer<gamerAnswer){
            if(gamerAnswer-roboAnswer<step){
                go=1;//gamer win
            }
            else
            {
                go=-1;//robot win
            }
        }
        return go;
    }
    var gamerWord=req.query.choose;//this is a word
    var gamerId=names.indexOf(gamerWord);
    var bResult=battle(compRes,gamerId);
    var winner=resultMass[bResult+1];
    var result={winner:winner,sKey:secret_key,compWord:names[compRes]};
    res.send(result);
})
function readTextFile() {
    fs.readFile("task.txt", "utf8",
        function(error,data){
            if(error) throw error; // если возникла ошибка
            console.log(data);  // выводим считанные данные
            names=data.split(',');
            console.log(names);
        });
}
readTextFile();
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});