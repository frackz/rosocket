local HttpService = game:GetService("HttpService")
local ApplicationJson = Enum.HttpContentType.ApplicationJson

local Socket = { Sockets = {}, Host = nil, Timeout = 0.8 }

type Connection = {
    OnMessage: (callback: (message : string) -> nil) -> nil,
    OnOpen: (callback: () -> nil) -> nil,
    OnError: (callback: (error : string) -> nil) -> nil,
    OnClose: (callback: (reason : string) -> nil) -> nil,

    SendMessage: (message : string) -> boolean,
    Close: () -> nil
}

type Response = {
    Success: boolean,
    StatusCode: number,
    StatusMessage: string,
    Headers: table,
    Body: any
}

coroutine.resume(coroutine.create(function()
    while wait(Socket.Timeout) do
        local Response = HttpService:GetAsync(Socket.Host.. "/messages")

        if Response then
            Response = HttpService:JSONDecode(Response)
            for id, socket in pairs(Socket.Sockets) do
                local data = Response[id]

                for _, msg in pairs(data) do
                    for _, v in pairs(socket.events[msg.type]) do
                        v(msg.data)
                    end
                end
            end
        end
    end
end))

--- Set the host URL. THIS IS A REQUIREMENT
function Socket:SetHost(host: string)
    self.Host = host
end

--- Set the message looking timeout.
function Socket:SetTimeout(timeout: number)
    self.Timeout = timeout
end

--- Connect to a websocket using a URL.
function Socket:Connect(url : string): Connection | nil
    local Response = HttpService:PostAsync(self.Host .. "/connect", HttpService:JSONEncode({
        url = url,
    }), ApplicationJson)

    if Response then
        Response = HttpService:JSONDecode(Response)

        if Response.success then
            local data = { events = {
                message = {},
                open = {},
                error = {},
                close = {}
            }}

            local id = Response.id

            function data.OnMessage(callback) table.insert(data.events.message, callback) end
            function data.OnOpen(callback) table.insert(data.events.open, callback) end
            function data.OnError(callback) table.insert(data.events.error, callback) end
            function data.OnClose(callback) table.insert(data.events.close, callback) end

            function data.SendMessage(message: any)
                local Resp = HttpService:PostAsync(Socket.Host .. "/send", HttpService:JSONEncode({ type = "socket", id = id, message = message }), ApplicationJson)

                if Resp then
                    Resp = HttpService:JSONDecode(Resp)
                    return Resp.success, Resp.msg
                end

                return false
            end

            function data.Close()
                local Resp = HttpService:PostAsync(Socket.Host .. "/close", HttpService:JSONEncode({ id = id }), ApplicationJson)

                if Resp then
                    Resp = HttpService:JSONDecode(Resp)
                    return Resp.success, Resp.msg
                end

                return false
            end

            self.Sockets[id] = data
            return data
        end

        return nil, error(Response.msg)
    end
end

--- Send a HTTP request using Axios - this can act as a proxy
function Socket:Send(data): Response | nil
    local Response = HttpService:PostAsync(Socket.Host .. "/send", HttpService:JSONEncode({
        type = "request",
        data = data
    }), ApplicationJson)

    if Response then
        Response = HttpService:JSONDecode(Response)

        if Response.success then
            local Status = Response.status
            return {
                Success = Status.code >= 200 and Status.code <= 299,
                StatusCode = Status.code,
                StatusMessage = Status.message,
                Headers = Response.headers,
                Body = Response.body
            } :: Response
        end
    end

    return nil
end

return Socket