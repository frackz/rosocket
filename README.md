<h1 align="center">RoSocket</h1>
<div align="center">A websocket utility for Roblox</div>

## Introduction

- Go to https://nodejs.org/en to install NodeJS on your web server.
- Click here to download the most recent version of RoSocket: https://github.com/frackz/rosocket/releases


## Requirements
- Having an accessible webserver (bigger game = better server)

## Usage
```lua
local WebSocket = require(path)
WebSocket:SetHost('Your Webserver link') -- The link to your webserver
WebSocket:SetTimeout(1.0) -- Depending on how big or how strong your server is

local server = WebSocket:Connect('WebSocket link')

server.OnOpen:Connect(function()
    server.Send("Hey server")
end)

server.OnMessage:Connect(function(msg)
    print("New message!!!! "..msg)
    print("I will give you a message then")
    
    server.Send("Thanks for your message")
    
    if math.random(1,10) == 5 then
        print("You now what??? I dont want to listen to your bs anymore")
        server.Close()
    end
end)

server.OnError:Connect(error) -- This will just connect it to the error function, which will display in the output

server.OnClose:Connect(function()
    print("Websocket closed :(")
end)

```
