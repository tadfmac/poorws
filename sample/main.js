var ws = new poorws("ws://hoge.net/");

ws.onStatusChange = function(status){
	$("#status").text(status);
};

$("#sendmes").click(function(){
	ws.send("testes");
});

ws.onMessage = function(mes){
	console.log("ws.onMessage() called.");
	var str = JSON.parse(mes.data);
	console.log(str);
};