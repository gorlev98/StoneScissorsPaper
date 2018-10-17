/**
 * Created by Лев on 15.04.2018.
 */
"use strict";
function lock(){
    var names=[];
    var choose="Stone";
    function robotAnswer(){
        var answer_promise=new Promise(function(resolve,reject){
            var oReq = new XMLHttpRequest();
            //console.log("oReq created");
            function cleanUp() {
                oReq.removeEventListener('load', handler);
            }
            function handler() {
                var text = JSON.parse(this.responseText);
                //console.log(text);
                document.getElementById('robo_answer').innerText=text;
            }
            oReq.addEventListener('load', handler);
            //console.log("Event listener added");
            oReq.open('GET', '/hash');
            //console.log("Try to GET /hash");
            oReq.send();
            //console.log("hash get finished");
        })
    }
    function buttonNames(){
        var button_promise=new Promise(function(resolve,reject){
            var oReq = new XMLHttpRequest();
            //console.log("oReq created");
            function cleanUp() {
                oReq.removeEventListener('load', handler);
            }
            function handler() {
                var text = JSON.parse(this.responseText);
                names=text;
                constructBattlePole();
            }
            oReq.addEventListener('load', handler);
            //console.log("Event listener added");
            oReq.open('GET', '/buttons');
            //console.log("Try to GET /hash");
            oReq.send();
            //console.log("hash get finished");
        })
    }
    function battleButtonPressed() {
            var calculation_promise=new Promise(function(resolve,reject){
            var oReq = new XMLHttpRequest();
            //console.log("oReq created");
            function cleanUp() {
                oReq.removeEventListener('load', handler);
            }
            function handler(){
                var text = JSON.parse(this.responseText);
                document.getElementById('key_string').innerText=text.sKey;
                document.getElementById('robotCT').innerText=text.compWord;
                document.getElementById('gamerCT').innerText=choose;//return text
                document.getElementById('result').innerText=text.winner;
                document.getElementById('robo_answer_prev').innerText= document.getElementById('robo_answer').innerText;
                func_variable.robotAnswer();
            }
            oReq.addEventListener('load', handler);
            var body="choose="+choose;
            oReq.open('GET', '/battle?'+body);
            oReq.setRequestHeader('Content-Type', 'application/json');
            oReq.send();
        })
    }
    function constructBattlePole(){
        var div1=document.getElementById('poleConstruct');
        for(var i=0;i<names.length;i++){
            var element=document.createElement('div');
            element.innerHTML= element.innerHTML+'<input name="Choose" type="radio" id='+i+' onclick="func_variable.change('+i+')">'+names[i];
            div1.appendChild(element);
        }
        var button=document.createElement('div');;
        button.innerHTML = '<button class="btn btn-danger" id="go_button" onclick="func_variable.battle()">Battle</button></div>';
        div1.appendChild(button);
        document.getElementById(0).checked=true;
    }
    function changeAnswer(i){
        choose=names[i];
    }
    buttonNames();
    return {battle: battleButtonPressed,robotAnswer:robotAnswer,change:changeAnswer};
}


