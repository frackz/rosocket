local HttpService = game:GetService("HttpService")
local ApplicationJson = Enum.HttpContentType.ApplicationJson

local Socket = { Sockets = {} }

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
    while wait(50 / 1000) do
        local Response = HttpService:GetAsync('' .. "/messages")
        if Response then
            Response = HttpService:JSONDecode(Response)
            for k, d in pairs(Socket.Sockets) do
                local data = Response[k]
                for _, v2 in pairs(data) do
                    for _, v in pairs(d.events[v2.type]) do
                        v(v2.data)
                    end
                end
            end
        end
    end
end))

--- Connect to a websocket using a URL.
function Socket:Connect(url : string, host : string): Connection | nil
    local Response = HttpService:PostAsync(host .. "/connect", HttpService:JSONEncode({
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

            function data:OnMessage(callback)
                table.insert(self.events.message, callback)
            end

            function data:OnOpen(callback)
                table.insert(self.events.open, callback)
            end

            function data:OnError(callback)
                table.insert(self.events.error, callback)
            end

            function data:OnClose(callback)
                table.insert(self.events.close, callback)
            end

            function data:SendMessage(message: any)
                local Resp = HttpService:PostAsync(host .. "/send", HttpService:JSONEncode({
                    type = "socket",
                    id = id,
                    message = message
                }), ApplicationJson)

                if Resp then
                    Resp = HttpService:JSONDecode(Resp)
                    if Resp.success then
                        return true
                    else
                        return false, error(Resp.msg)
                    end
                end

                return false
            end

            function data:Close()
                local Resp = HttpService:PostAsync(host .. "/close", HttpService:JSONEncode({
                    id = id,
                }), ApplicationJson)

                if Resp then
                    Resp = HttpService:JSONDecode(Resp)
                    if Resp.success then
                        return true
                    else
                        return false, error(Resp.msg)
                    end
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
function Socket:Send(data, host : string): Response | nil
    local Response = HttpService:PostAsync(host .. "/send", HttpService:JSONEncode({
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