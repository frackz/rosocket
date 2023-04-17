local WebSocket = require(script.Parent.Socket)

WebSocket:SetHost('https://anguishedoutlandishcoin.bertil123.repl.co')
WebSocket:SetTimeout(0.5) -- If you have a large game, maybe its good to tick this up

function TestRequest()
    local Request = WebSocket:Send({
        method = "get",
        url = "https://raw.githubusercontent.com/frackz/fivecord/main/src/Socket.js"
    })

    if Request then
        print(Request.StatusCode)
    end
end

function TestSocket()
    local Resp = WebSocket:Connect('wss://socketsbay.com/wss/v2/1/demo/')
    
    Resp.OnMessage:Connect(function(msg)
        print(msg)
    end)

    Resp.Send('asd')
end

TestSocket()