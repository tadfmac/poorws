// poorws.js
// simple webSocket wrapper
// 2015.03.16 by D.F.Mac.
// 2015.11.15 fix bug

var poorws = class Poorws{
  constructor(url, options){
    this.ws = null;
    this.host = null;
    this.onMessage = null;
    this.onOpen = null;
    this.onClose = null;
    this.onError = null;
    this.onMessage = null;
    this.onStatusChange = null;
    this.polling = false;
    this.pollingTimer = null;
    this.expire = 20000;
    this.interval = 5000;
    if(typeof url == null){
      console.log("poorws:first argument must be url");
      return;
    }else{
      this.host = url;
    }
    if(typeof options !== "undefined"){
      if(typeof options.polling !== "undefined"){
        this.polling = options.polling;
      }
      if(typeof options.interval !== "undefined"){
        this.interval = options.interval;
      }
      if(typeof options.expire !== "undefined"){
        this.expire = options.expire;
      }
    }
    this.wsconnect();
  }

  // 非同期なのでPromiseなどで処理しないとコネクション張られる前にsendメソッドなどを呼ばれてエラーを吐く
  wsconnect(){
    if(navigator.onLine != false){
      if(this.ws == null || this.ws.readyState >= 2){
        this.ws = new WebSocket(this.host);
        this.ws.onopen = function (){
          console.log("poorws:ws.onopen");
          if(this.onOpen != null){
            this.onOpen();
          }
          if(this.onStatusChange != null){
            this.onStatusChange(this.ws.readyState);
          }
        }.bind(this);
        this.ws.onclose = function(){
          console.log("poorws:ws.onclose");
          if(this.onClose != null){
            this.onClose();
          }
          if(this.onStatusChange != null){
            this.onStatusChange(this.ws.readyState);
          }
        }.bind(this);
        this.ws.onerror = function(error){
          console.log("poorws:ws.onerror");
          if(this.onError != null){
            this.onError(error);
          }
        }.bind(this);
        this.ws.onmessage = function(event){
          console.log("poorws:ws.onmessage: "+event.data);
          if(this.polling == true){
            if(event.data == "ack"){
              if(this.pollingTimer != null){
                console.log("clear");
                clearTimeout(this.pollingTimer);
                this.pollingTimer = null;
              }
            }
          }
          if(this.onMessage != null){
            if(event.data != "ack"){
              this.onMessage(event);
            }
          }
        }.bind(this);
      }
      if(this.ws.readyState == 1){
        if(this.polling == true){
          this.ws.send("ping");
          if(this.pollingTimer == null){
            console.log("set");
            this.pollingTimer = setTimeout(function(){
              this.polling();
            }.bind(this), this.expire);
          }
        }
      }
    }else{
      console.log("poorws:network offline");
      if((this.ws != null)&&(this.ws.readyState == 1)){
        this.ws.close();
        if(this.onStatusChange != null){
          this.onStatusChange(this.ws.readyState);
        }
      }
    }
  }

  send(message){
    if((this.ws != null)&&(this.ws.readyState == 1)){
      this.ws.send(message);
      console.log("poorws:send message: " + message);
    }else{
      console.log("poorws:send() error!!!!!");
    }
  }

  close(){
    if((this.ws != null)&&(this.ws.readyState == 1)){
      this.ws.close();
    }else{
      console.log("poorws:close() error!!!!!");
    }
  }

  polling(){
    console.log("poorws:polling: expired");
    this.ws.close();
    if(this.onStatusChange != null){
      this.onStatusChange(this.ws.readyState);
    }
    this.pollingTimer = null;
  }
}

