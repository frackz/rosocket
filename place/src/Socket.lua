local HttpService = game:GetService("HttpService")
local ApplicationJson = Enum.HttpContentType.ApplicationJson

local Socket = { Sockets = {} }

type Connection = {
    OnMessage: (callback: (message : string) -> nil) -> nil,
    OnOpen: (callback: () -> nil) -> nil,
    OnError: (callback: (error : string) -> nil) -> nil,
    OnClose: (callback: (reason : string) -> nil) -> nil,

    SendMessage: (message : string) -> nil,
    Close: () -> nil
}

type ConnectionFailure = {

}

--- Connect to a websocket using a URL.
function Socket:Connect(url : string, host : string): Connection | ConnectionFailure
    local Response = HttpService:PostAsync(host .. "/connect", HttpService:JSONEncode({
        url = url,
    }), ApplicationJson)

    print(Response)
end

--- Send a HTTP request through a host (Using axios). Which can act as a proxy.
function Socket:Send(data : table, host : string)
    local Response = HttpService:PostAsync(host .. "/send", HttpService:JSONEncode({
        
    }), ApplicationJson)
end

return Socket