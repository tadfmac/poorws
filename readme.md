# poorws.js

This is a very simple WebSocket Client wrapper.

## usage

### initialization

```index.html
<script src="js/poorws.js"></script>
```

```js
var ws = new poorws("SERVER URL");
```

### handle on connection status changed

```js
ws.onStatusChange = function(status){
	$("#status").text(status);
};
```

### send

```js
$("#sendmes").click(function(){
	ws.send("testes");
});
```

### onMessage

```js
ws.onMessage = function(mes){
	var str = JSON.parse(mes.data);
	console.log(str);
};
```

That's all!
Enjoy! :D


