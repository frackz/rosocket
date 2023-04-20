<h1 align="center">🔌 RoSocket</h1>
<div align="center">A websocket utility for Roblox</div>

## Introduction

- Go to https://nodejs.org/en to install NodeJS on your web server.
- Download RoSocket using Code > Download ZIP
- Open Roblox Studio and open your place - insert the "place/Socket.lua" into your ServerScriptService
- Go inside "server/dist" and drag all the files into a folder on your webserver. Now start the index.js, this is where you will need your NodeJS understanding
- Remember to have your port 8000 open for traffic.

## Requirements
- Having an accessible webserver (bigger game = better server)
- Having a understanding of NodeJS

## Usage
```lua
local WebSocket = require(path)
WebSocket:SetHost('Your Webserver link / IP with port') -- The link to your webserver
WebSocket:SetTimeout(1.0) -- Depending on how big or how strong your server is

local server = WebSocket:Connect('WebSocket link')

server.OnOpen:Connect(function()
    server.Send("Hey server")
end)

server.OnMessage:Connect(function(msg)
    print("New message!!!! "..msg)
    print("I will give you a message then")
    
    server.Send("Thanks for your message")
    
    local random = math.random(1,2)
    if random == 1 then
        print("You now what??? I dont want to listen to your bs anymore")
        server.Close()
     else
        local request = WebSocket:Send({ -- You can also send HTTP requests through your webserver, which can act as a proxy. Its using axios
            method = "get",
            url = "https://raw.githubusercontent.com/frackz/rosocket/main/README.md?token=GHSAT0AAAAAACBMYPQUWYS6XWCYILU5CFNYZB6JWGA"
        })
        
        if request then
            print(request.Success)
            print(request.StatusCode)
            print(request.StatusMessage)
            print(request.Headers)
            print(request.Body)
        end
    end
end)

server.OnError:Connect(error) -- This will just connect it to the error function, which will display in the output

server.OnClose:Connect(function()
    print("Websocket closed :(")
end)

```
