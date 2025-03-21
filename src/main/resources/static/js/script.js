'use strict';

var lottoButton = document.querySelector('#lottoButton');
var lottoplusButton = document.querySelector('#lottoplusButton');
var textBox = document.querySelector('.TextBox');

var stompClient = null;

function initializeWebSocket() {
    var socket = new SockJS('/wss');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
}

function onConnected(frame) {
    console.log("Connected: " + frame);

    stompClient.subscribe('/topic/public', onMessageReceived);
}

function onError(error) {
    console.error("Error: " + error);
}

function sendMessage(content) {
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/requestNum', {}, JSON.stringify({content: content}));
    } else {
        console.error("Not connected yet. Unable to send message.");
    }
}

function onMessageReceived(message) {
    var msg = JSON.parse(message.body);

    if (msg && msg.content) {
        var numbers = msg.content.split('\n').map(str => str.trim()).filter(Boolean);
        textBox.innerHTML = '';
        if (numbers.length % 7 == 0) {
               for (let i = 0; i < numbers.length; i += 7) {
                   var group = numbers.slice(i, i + 7);
                   var pElement = document.createElement("p");
                   group.forEach(function(number) {
                       var span = document.createElement("span");
                        // REMOVE THE LETTER
                        var numericValue = number.slice(1);
                        span.textContent = numericValue;
                        span.style.backgroundColor = (number.charAt(0) === 'M') ? 'white' : 'red';
                        span.style.color = (number.charAt(0) === 'M') ? 'black' : 'white';
                       pElement.appendChild(span);
                   });
                   textBox.appendChild(pElement);
               }
           } else {
               for (let i = 0; i < numbers.length; i += 6) {
                   var group = numbers.slice(i, i + 6);
                   var pElement = document.createElement("p");
                   group.forEach(function(number) {
                   var span = document.createElement("span");
                       // REMOVE THE LETTER
                       var numericValue = number.slice(1);
                       span.textContent = numericValue;
                       span.style.backgroundColor = (number.charAt(0) === 'M') ? 'white' : 'red';
                       span.style.color = (number.charAt(0) === 'M') ? 'black' : 'white';
                       pElement.appendChild(span);
                   });
                   textBox.appendChild(pElement);
               }
           }

    } else {
        console.error("Invalid message format", msg);
    }
}

function requestLottoData() {
    //Six Numbers per Ticket
    sendMessage("scrape_lotto");
}

function requestEurojackpotData() {
    //Seven Numbers per Ticket
    sendMessage("scrape_eurojackpot");
}

function requestLottoPlusData() {
    //Six Numbers per Ticket
    sendMessage("scrape_lotto_plus");
}

document.querySelector('#lottoButton').addEventListener('click', function(event) {
    if (!stompClient) {
        initializeWebSocket();
    }
    requestLottoData();
});

document.querySelector('#lottoplusButton').addEventListener('click', function(event) {
    if (!stompClient) {
        initializeWebSocket();
    }
    requestLottoPlusData();
});

document.querySelector('#eurojackpotButton').addEventListener('click', function(event) {
    if (!stompClient) {
        initializeWebSocket();
    }
    requestEurojackpotData();
});
