local WebSocket = require(script.Parent.Socket)

local host = ''

function TestRequest()
    local Request = WebSocket:Send({
        method = "get",
        url = "https://raw.githubusercontent.com/frackz/fivecord/main/src/Socket.js"
    }, host)

    if Request then
        print(Request.StatusCode)
    end
end

function TestSocket()
    local Resp = WebSocket:Connect('wss://socketsbay.com/wss/v2/1/demo/', host)
    
    Resp:SendMessage('asd')

    Resp:OnOpen(function()
        print("OPENED")
    end)

    Resp:OnMessage(function(msg)
        print(Resp:Close())
    end)

    Resp:OnClose(function()
        print("CLOSE")
    end)
end

TestRequest()
TestSocket()