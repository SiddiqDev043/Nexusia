# Architecture & Flow (Expanded)

## Ringkasan
Aplikasi Next.js (app router) untuk chat/servers dengan OTP auth, real-time messaging via socket, dan file upload (`uploadthing`). Dokumen ini menjelaskan routing, komponen utama, lifecycle hooks, dan langkah run/setup singkat.

---

## Run / Setup singkat
- Install dependencies:

```bash
npm install
# or
pnpm install
```

- Environment:
  - Pastikan `DATABASE_URL` dan kredensial LiveKit / uploadthing di `.env`.

- Menjalankan (development):

```bash
npm run dev
# atau
pnpm dev
```

- Database (prisma):

```bash
npx prisma migrate dev
npx prisma db seed
```

- Jika ingin build:

```bash
npm run build
npm start
```

---

## Struktur Routing (singkat)
- `/(auth)` — halaman auth: sign-in, sign-up
- `/(setup)` — onboarding
- `/(main)` — area chat: server list, server/[serverId], channels, conversations
- `unauthorized` — fallback halaman
- API: `app/api/*` (auth, channels, messages, members, servers, livekit, uploadthing)

---

## Komponen Utama & Hooks
- `components/chat/*`
  - `ChatHeader` — tampilan info server/kanal
  - `ChatMessages` — daftar pesan, handle grouping dan rendering file/media
  - `ChatInput` — input pesan, file attach, tombol video
  - `ChatVideoButton` — integrasi LiveKit
- `components/providers/*`
  - `SocketProvider` — sediakan koneksi socket ke anak komponen
  - `QueryProvider` — React Query provider
  - `ModalProvider` — modal global
- `components/modals/*` — modal untuk create/edit/delete server/channel, message file preview
- Hooks:
  - `useChatSocket` — inisialisasi socket, subscribe events, reconnect
  - `useChatQuery` — fetch/paginate pesan dan state channels
  - `useChatScroll` — auto-scroll behavior ketika pesan baru

---

## Lifecycle Hooks & Alur Kunci
- On App / Main mount:
  - `QueryProvider` aktif
  - `SocketProvider` (dalam `socket-init.tsx`) inisialisasi koneksi WebSocket / LiveKit
  - Fetch daftar `servers` dan `channels` via `api/servers` & `api/channels`

- On Server page (`/server/[serverId]`) mount:
  - `useChatQuery` fetch channel list dan pesan awal
  - `useChatSocket` join channel room, subscribe `message:new`, `member:join`, `member:leave`

- On ChatMessages mount:
  - listen untuk `message:new` -> append ke list -> `useChatScroll` scroll ke bawah

- On ChatInput send:
  - POST ke `api/messages` (atau websocket send), optimistically update UI
  - If file: upload via `uploadthing` endpoint then send message with file metadata

- On unmount (leaving server/page):
  - `useChatSocket` leave room and cleanup listeners

---

## API Interaction (singkat)
- Auth flow: `api/auth/request-otp` -> `api/auth/verify-otp` -> `api/auth/complete`
- Profile creation: `api/profile/create`
- Channels: `api/channels` and `api/channels/[channelId]`
- Messages: `api/messages` (send, fetch, paginate)
- Servers: `api/servers/*` (create, invite-code, leave, join)
- LiveKit: `api/livekit/route.ts` to create tokens/sessions
- Upload: `api/uploadthing/route.ts` + `app/uploadthing/core.ts`

---

## Diagram Mermaid (komponen + hooks + lifecycle)

```mermaid
flowchart TD
  subgraph Client
    A[User]
    APP[App Root (providers)]
    SocketInit[socket-init.tsx]
    MainPage[(Main Page)]
    ServerPage[/server/[serverId]/page.tsx]
    ChatHeader[ChatHeader]
    ChatMessages[ChatMessages]
    ChatInput[ChatInput]
    ModalProvider[ModalProvider]
  end

  subgraph Hooks
    H1[useChatSocket]
    H2[useChatQuery]
    H3[useChatScroll]
  end

  subgraph API
    AuthAPI[api/auth/*]
    ServersAPI[api/servers/*]
    ChannelsAPI[api/channels/*]
    MessagesAPI[api/messages]
    UploadAPI[api/uploadthing/*]
    LivekitAPI[api/livekit]
  end

  A --> APP
  APP --> SocketInit
  APP --> ModalProvider
  APP --> MainPage
  MainPage --> ServerPage
  ServerPage --> ChatHeader
  ServerPage --> ChatMessages
  ServerPage --> ChatInput

  ChatMessages --> H3
  ChatMessages --> H2
  ChatInput --> H2
  ChatInput --> H1

  SocketInit --> H1
  H1 --> MessagesAPI
  H2 --> ChannelsAPI
  H2 --> ServersAPI
  ChatInput -.-> MessagesAPI
  ChatInput -.-> UploadAPI
  ChatHeader -.-> LivekitAPI

  %% lifecycle notes
  classDef lifecycle fill:#f9f,stroke:#333,stroke-width:1px;
  SocketInit:::lifecycle
  H1:::lifecycle
  H2:::lifecycle

  click H1 "#useChatSocket" "useChatSocket lifecycle"
  click H2 "#useChatQuery" "useChatQuery lifecycle"
```

---

Dokumentasi ini menyertakan diagram Mermaid yang bisa dirender di viewer Markdown (VS Code, GitHub, atau mermaid.live). Jika Anda ingin, saya bisa:
- Mengekspor diagram menjadi PNG dan memasukkan ke PDF/DOCX dalam workspace.
- Memperluas diagram hingga setiap komponen file spesifik.

Catatan: saya sudah menyiapkan diagram dan dokumen; langkah ekspor image/PDF akan saya coba berikutnya jika Anda izinkan saya menginstall atau menjalankan tool rendering (mis. `mmdc` atau `puppeteer`) di environment ini.
