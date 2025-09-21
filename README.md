# MCP Todo List Server

## Pengantar

MCP Todo List Server adalah server sederhana yang dibangun menggunakan Model Context Protocol (MCP) dengan FastMCP. Server ini memungkinkan Anda mengelola daftar tugas (todo) melalui berbagai tools yang tersedia. Data todo disimpan di memori (tidak persistent), cocok untuk pengembangan dan testing.

## Fitur Utama

- Tambah todo baru
- Lihat semua todo
- Hapus todo berdasarkan ID
- Update judul todo
- Ganti kata "aku" menjadi "saya" di semua judul todo (untuk contoh bulk update)

## Instalasi dan Menjalankan

1. Pastikan Anda memiliki Python 3.8+ terinstal.
2. Install dependencies:
   ```
   pip install fastmcp pydantic
   ```
3. Jalankan server:
   ```
   python todo_server.py
   ```
   Server akan berjalan dengan transport stdio untuk development/testing.

## Tools yang Tersedia

### 1. add_todo
Menambahkan todo baru ke daftar.

**Parameter:**
- `title` (string, wajib): Judul todo
- `date` (string, opsional): Tanggal todo (format bebas, misal "2025-09-21")

**Contoh Penggunaan:**
- Tambah todo "Belajar Python" tanpa tanggal
- Tambah todo "Meeting pukul 10" dengan tanggal "2025-09-21"

### 2. list_todos
Menampilkan semua todo yang ada.

**Parameter:** Tidak ada

**Contoh Penggunaan:**
- Lihat semua todo saat ini

### 3. delete_todo
Menghapus todo berdasarkan ID.

**Parameter:**
- `todo_id` (integer, wajib): ID todo yang ingin dihapus

**Contoh Penggunaan:**
- Hapus todo dengan ID 1

### 4. update_todo
Mengupdate judul todo berdasarkan ID.

**Parameter:**
- `todo_id` (integer, wajib): ID todo yang ingin diupdate
- `new_title` (string, wajib): Judul baru

**Contoh Penggunaan:**
- Ubah judul todo ID 2 menjadi "Olahraga malam"

### 5. replace_aku_to_saya
Mengganti semua kata "aku" menjadi "saya" di judul semua todo (contoh tool untuk bulk update).

**Parameter:** Tidak ada

**Contoh Penggunaan:**
- Jalankan untuk mengganti kata di semua judul todo

## Contoh Sesi Penggunaan

1. Tambah beberapa todo:
   - add_todo("Bangun pagi", "2025-09-21")
   - add_todo("Sarapan")

2. Lihat semua todo:
   - list_todos() → Menampilkan daftar todo

3. Update salah satu:
   - update_todo(1, "Bangun pagi pukul 6")

4. Hapus yang tidak perlu:
   - delete_todo(2)

5. Jika ada kata "aku", ganti:
   - replace_aku_to_saya()

## Catatan

- Data todo disimpan di memori, jadi akan hilang saat server di-restart.
- ID todo dimulai dari 1 dan auto-increment.
- Tools ini dirancang untuk integrasi dengan MCP clients seperti GitHub Copilot atau tools AI lainnya.

## Troubleshooting

- Jika server tidak berjalan, pastikan dependencies terinstal dengan benar.
- Untuk development, gunakan transport stdio seperti yang ada di kode.

Jika ada pertanyaan atau perlu fitur tambahan, silakan hubungi pengembang!

## Dokumentasi Teknis

### Bagaimana Membuat MCP Ini

MCP Todo List Server dibangun menggunakan FastMCP, sebuah library Python untuk membuat server MCP dengan cepat. Berikut langkah-langkah dasar untuk membuat MCP serupa:

1. **Setup Project:**
   - Buat folder project baru.
   - Buat file Python utama (misal `todo_server.py`).

2. **Install Dependencies:**
   - `fastmcp`: Untuk framework MCP server.
   - `pydantic`: Untuk validasi dan model data.

3. **Struktur Kode:**
   - Import library yang diperlukan.
   - Definisikan model data menggunakan Pydantic (misal `TodoItem`).
   - Buat instance `FastMCP` dengan nama server.
   - Dekorasi fungsi dengan `@mcp.tool()` untuk menjadikannya tool yang bisa dipanggil.
   - Jalankan server dengan `mcp.run(transport="stdio")`.

4. **Testing:**
   - Jalankan server dan test tools melalui MCP client (seperti GitHub Copilot atau tools AI lainnya).

### Bagaimana Cara Membaca Kode Ini

Kode di `todo_server.py` terstruktur sederhana dan mudah dibaca. Berikut penjelasan bagian per bagian:

- **Imports (Baris 1-4):**
  - `asyncio`: Untuk asynchronous operations (meski tidak digunakan secara eksplisit di sini).
  - `typing`: Untuk type hints seperti `Optional`, `List`.
  - `pydantic`: Untuk model data.
  - `mcp.server.fastmcp`: Import `FastMCP` dan `Context` (Context tidak digunakan di sini).

- **Model TodoItem (Baris 7-10):**
  - Kelas Pydantic yang mendefinisikan struktur todo: `id` (int), `title` (str), `date` (opsional str).
  - Digunakan untuk validasi input dan output.

- **Data Storage (Baris 13):**
  - `todos: List[TodoItem] = []`: List sederhana untuk menyimpan data todo di memori. Tidak persistent, cocok untuk demo.

- **Server Instance (Baris 16):**
  - `mcp = FastMCP(name="TodoServer")`: Membuat instance server MCP dengan nama "TodoServer".

- **Tools (Baris 19-54):**
  - Setiap tool didefinisikan sebagai fungsi dengan dekorator `@mcp.tool()`.
  - `add_todo`: Membuat ID baru, buat TodoItem, tambahkan ke list, return item.
  - `list_todos`: Return seluruh list todos.
  - `delete_todo`: Filter list untuk menghapus berdasarkan ID, return jumlah yang dihapus.
  - `update_todo`: Loop cari ID, update title, return status.
  - `replace_aku_to_saya`: Loop semua todos, replace "aku" ke "saya" di title, return jumlah yang diubah.

- **Main Execution (Baris 57-60):**
  - `if __name__ == "__main__":`: Jalankan server dengan transport stdio untuk testing.

### Untuk Apa Kode-Kode Ini

Setiap bagian kode memiliki tujuan spesifik dalam membangun server MCP yang fungsional:

- **Model Pydantic (`TodoItem`):** Memastikan data todo konsisten dan tervalidasi. `id` unik, `title` wajib, `date` opsional.
- **List `todos`:** Penyimpanan data sederhana. Mudah diakses dan dimodifikasi, tapi hilang saat restart (untuk demo).
- **FastMCP Instance:** Framework utama yang menghubungkan tools ke MCP protocol, memungkinkan integrasi dengan AI clients.
- **Tools:**
  - `add_todo`: Untuk menambah item baru, dengan auto ID.
  - `list_todos`: Untuk melihat semua data saat ini.
  - `delete_todo`: Untuk menghapus item spesifik.
  - `update_todo`: Untuk mengubah judul item.
  - `replace_aku_to_saya`: Contoh operasi bulk, menunjukkan cara memodifikasi multiple items sekaligus.
- **Main Block:** Entry point untuk menjalankan server, menggunakan stdio untuk komunikasi lokal.

Secara keseluruhan, kode ini mendemonstrasikan cara membangun MCP server sederhana untuk manajemen todo, yang bisa diperluas dengan fitur seperti database persistent, authentication, atau tools tambahan.


Panduan: https://github.com/modelcontextprotocol/python-sdk

Kode dari ChatGPT dan dibantu github copilot jgua dan dokumentasi dibantu Github Copilot