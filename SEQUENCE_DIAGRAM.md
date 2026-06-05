# Sequence Diagram — Message Send & Real-time Delivery (Mermaid)

Below is a Mermaid sequence diagram showing the end-to-end flow when a user sends a message (text or image) and how it is delivered in real time.

```mermaid
sequenceDiagram
    participant Sender as Sender (Browser)
    participant Frontend as Frontend (React)
    participant Store as useChatStore
    participant API as Backend API (/api/message/send/:id)
    participant Cloud as Cloudinary
    participant DB as MongoDB
    participant SocketServer as Socket.IO Server
    participant Recipient as Recipient (Browser)

    Sender->>Frontend: Type message / pick image → Click Send
    Frontend->>Store: sendMessage({ text, image })
    Store->>API: POST /api/message/send/:receiverId { text, image (data URL) }
    API->>Cloud: upload(image data URL)
    Cloud-->>API: secure_url
    API->>DB: save Message (senderId, receiverId, text, image: secure_url)
    DB-->>API: saved message
    API->>SocketServer: getReceiverSocketId(receiverId)
    alt receiver online
        SocketServer->>Recipient: emit "new-message" (saved message)
        Recipient->>Store: socket handler appends new message
        Store->>Frontend: ChatContainer re-renders (real-time update)
    else receiver offline
        note right of DB: Message stored; delivered later when recipient connects or fetches
    end
    API-->>Store: HTTP response (saved message to sender)
    Store->>Frontend: append message to sender UI (immediate sender feedback)
```

Notes:
- Event names: "new-message" (payload: saved Message object), "online-users" (array of userIds).
- Socket connection is established by useAuthStore.connectSocket() and mirrored to useChatStore so chat code can subscribe.
- Images are typically sent as base64 data URLs from the browser or via multipart/form-data; server uploads to Cloudinary and stores the returned secure_url in DB.

Want a PNG/SVG export of this diagram or an ASCII-art version for the terminal? Let me know which format to generate.