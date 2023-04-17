local HttpService = game:GetService("HttpService")

local Socket = { Sockets = {}, Host = nil, Timeout = 0.8, Types = {
    open = 'OnOpen',
    message = 'OnMessage',
    error = 'OnError',
    close = 'OnClose'
}}

type Connection = {
    OnOpen: RBXScriptSignal,
    OnMessage: RBXScriptSignal,
    OnError: RBXScriptSignal,
    OnClose: RBXScriptSignal,

    Send: (message : string) -> boolean,
    Close: () -> nil
}

type Response = {
    Success: boolean,
    StatusCode: number,
    StatusMessage: string,
    Headers: table,
    Body: any
}

local function Request(route: string, method: string, body: table)
    local request = HttpService:RequestAsync({
        Url = Socket.Host .. '/' .. route,
        Method = method,
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = if body then HttpService:JSONEncode(body or {}) else nil
    })

    local body = HttpService:JSONDecode(request.Body)

    return body, request.StatusCode == 200 and (body.success == nil or body.success == true)
end

local function Event(): BindableEvent
    local event = Instance.new('BindableEvent')
    return event
end

coroutine.resume(coroutine.create(function()
    while wait(Socket.Timeout) do
        local Response, Success = Request('messages', 'GET')

        if not Success then
            return
        end

        for id, socket in pairs(Socket.Sockets) do
            local data = Response[id]
            
            for _, msg in pairs(data) do
                local type, data = msg.type, msg.data
                local event = socket.Run[Socket.Types[type]] :: BindableEvent

                event:Fire(data)
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
    if not self.Host then
        return error("Need to set a host. Use: ...:SetHost('host here')")
    end

    local Response, Success = Request('connect', 'POST', {
        url = url
    })

    if Success then
        local id = Response.id
        local events = { OnOpen = Event(), OnMessage = Event(), OnError = Event(), OnClose = Event() }

        local data = {
            OnOpen = events.OnOpen.Event, OnMessage = events.OnMessage.Event, OnError = events.OnError.Event, OnClose = events.OnClose.Event,
            
            Run = events
        }

        function data.Send(message: any)
            local Response, Success = Request('send', 'POST', {
                type = "socket",
                id = id,
                message = message
            })

            if not Success then
                return false, Response.msg
            end

            return true
        end

        function data.Close()
            local Response, Success = Request('close', 'POST', {
                id = id,
            })

            if not Success then
                return false, Response.msg
            end

            return true
        end

        self.Sockets[id] = data
        return data
    end

    return nil, error(Response.msg or 'Invalid error')
end

--- Send a HTTP request using Axios - this can act as a proxy
function Socket:Send(data): Response | nil
    if not self.Host then
        return error("Need to set a host. Use: ...:SetHost('host here')")
    end

    local Response, Success = Request('send', 'POST', {
        type = "request",
        data = data
    })

    if Success then
        local Status = Response.status
        return {
            Success = Status.code >= 200 and Status.code <= 299,
            StatusCode = Status.code,
            StatusMessage = Status.message,
            Headers = Response.headers,
            Body = Response.body
        } :: Response
    end

    return nil
end

return Socket