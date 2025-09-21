# FAQ

## Q: Untuk apa Pydantic?

A: Pydantic adalah library Python yang digunakan untuk validasi data, parsing, dan serialisasi. Di kode MCP Todo Server ini, Pydantic digunakan untuk mendefinisikan model `TodoItem`, yang memastikan bahwa data todo (seperti `id` sebagai integer, `title` sebagai string, dan `date` sebagai string opsional) sesuai dengan tipe yang diharapkan. Ini membantu mencegah error tipe data, melakukan konversi otomatis (misal dari string ke int jika memungkinkan), dan memudahkan serialisasi ke JSON untuk response API. Secara keseluruhan, Pydantic membuat kode lebih aman dan mudah dipelihara.

## Q: Apakah tidak masalah jika tidak menggunakan Pydantic?

A: Ya, tidak masalah jika tidak menggunakan Pydantic. Anda bisa menggantinya dengan struktur data Python standar seperti dictionary (`dict`) atau class biasa tanpa Pydantic. Misalnya, `TodoItem` bisa diganti dengan class sederhana atau dict. Namun, tanpa Pydantic, Anda kehilangan fitur validasi otomatis, type checking yang ketat, dan kemudahan serialisasi, yang bisa membuat kode lebih rentan terhadap bug (misal salah tipe data) dan lebih sulit untuk diperluas. Untuk project kecil seperti ini, dict cukup, tapi Pydantic direkomendasikan untuk aplikasi yang lebih kompleks atau production-ready.

## Q: Untuk apa @mcp.tool()?

A: `@mcp.tool()` adalah dekorator dari library FastMCP yang digunakan untuk mendaftarkan fungsi sebagai "tool" dalam protokol MCP (Model Context Protocol). Dengan dekorator ini, fungsi seperti `add_todo`, `list_todos`, dll., bisa dipanggil oleh MCP clients (seperti AI assistants atau tools eksternal) melalui protokol MCP. Dekorator ini memungkinkan fungsi tersebut diekspos sebagai API yang bisa diakses remotely, bukan hanya sebagai fungsi Python lokal.

## Q: Bagaimana jika tidak ada @mcp.tool()?

A: Jika tidak ada dekorator `@mcp.tool()`, fungsi tetap bisa dipanggil secara normal di dalam kode Python (misal dari fungsi lain di file yang sama). Namun, fungsi tersebut tidak akan terdaftar sebagai tool MCP, sehingga tidak bisa diakses oleh MCP clients eksternal. Artinya, AI atau tools lain tidak bisa menggunakan fungsi tersebut melalui protokol MCP, dan server hanya akan memiliki tools yang didekorasi. Untuk membuat server MCP yang berguna, setidaknya satu fungsi harus didekorasi dengan `@mcp.tool()`.

## Q: Apa maksud dari mcp.run(transport="stdio")?

A: `mcp.run(transport="stdio")` adalah perintah untuk menjalankan server MCP menggunakan transport "stdio". Ini berarti server akan menggunakan standard input/output (stdin/stdout) sebagai cara komunikasi dengan MCP clients. Server akan membaca pesan dari stdin dan mengirim response ke stdout, memungkinkan integrasi dengan tools seperti terminal atau AI assistants yang berkomunikasi melalui console.

## Q: Kenapa perlu mcp.run(transport="stdio")?

A: `mcp.run()` diperlukan untuk memulai server MCP dan membuatnya aktif. Tanpa baris ini, server tidak akan berjalan, dan tools MCP tidak akan tersedia untuk dipanggil. Ini adalah entry point utama yang menjalankan event loop untuk menangani request dari clients. Untuk development dan testing, "stdio" cocok karena sederhana dan tidak memerlukan setup jaringan tambahan.

## Q: Apa maksud transport di sini?

A: "Transport" di sini merujuk pada metode atau protokol komunikasi yang digunakan oleh server MCP untuk berinteraksi dengan clients. FastMCP mendukung berbagai transport, seperti "stdio" (untuk komunikasi lokal via terminal), "http" (untuk web API), atau lainnya. Transport menentukan bagaimana data dikirim dan diterima antara server dan client.

## Q: Apa yang dimaksud dengan stdio?

A: "Stdio" adalah singkatan dari "standard input/output". Ini merujuk pada stream input (stdin) dan output (stdout) di sistem operasi, biasanya melalui terminal atau console. Dalam konteks MCP, menggunakan "stdio" berarti server membaca command/request dari stdin dan menulis response ke stdout, membuatnya cocok untuk integrasi dengan command-line tools atau AI yang berjalan di terminal.

## Q: Kenapa harus stdio?

A: "Stdio" dipilih karena sederhana dan cocok untuk development, testing, dan integrasi lokal. Ini tidak memerlukan setup server jaringan atau port tambahan, sehingga mudah dijalankan di terminal. Untuk project demo seperti ini, stdio memungkinkan komunikasi langsung dengan AI tools (seperti GitHub Copilot) tanpa kompleksitas HTTP atau WebSocket. Ini juga aman untuk testing karena terisolasi di proses lokal.

## Q: Apakah tidak ada transport lain?

A: Ya, ada transport lain yang didukung oleh FastMCP, tergantung versi dan konfigurasi. Contohnya:
- **HTTP**: Untuk menjalankan server sebagai web API, memungkinkan akses remote via HTTP requests (misal `transport="http"`).
- **WebSocket**: Untuk komunikasi real-time via WebSocket protocol.
- **SSE (Server-Sent Events)**: Untuk streaming data dari server ke client.
- Transport kustom: Bisa dikonfigurasi sesuai kebutuhan.

Pilihan transport tergantung pada use case; stdio untuk local/testing, HTTP untuk production dengan akses jaringan.
