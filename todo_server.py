import asyncio
from typing import Optional, List
from pydantic import BaseModel
from mcp.server.fastmcp import FastMCP, Context

# Model Pydantic untuk struktur todo
class TodoItem(BaseModel):
    id: int
    title: str
    date: Optional[str] = None

# Simpan data todo di memory (list)
todos: List[TodoItem] = []

# Buat server FastMCP
mcp = FastMCP(name="TodoServer")

# Tool: tambah todo
@mcp.tool()
def add_todo(title: str, date: Optional[str] = None) -> TodoItem:
    new_id = len(todos) + 1
    todo = TodoItem(id=new_id, title=title, date=date)
    todos.append(todo)
    return todo

# Tool: list semua todo
@mcp.tool()
def list_todos() -> List[TodoItem]:
    return todos

# Tool: hapus todo berdasarkan id
@mcp.tool()
def delete_todo(todo_id: int) -> dict:
    global todos
    before = len(todos)
    todos = [t for t in todos if t.id != todo_id]
    after = len(todos)
    deleted = before - after
    return {"deleted": deleted}

# Tool: update judul todo
@mcp.tool()
def update_todo(todo_id: int, new_title: str) -> dict:
    for t in todos:
        if t.id == todo_id:
            t.title = new_title
            return {"message": "Todo updated", "todo": t}
    return {"error": "Todo not found"}

# Contoh tool: update bulk, ganti kata "aku" → "saya"
@mcp.tool()
def replace_aku_to_saya() -> dict:
    count = 0
    for t in todos:
        if "aku" in t.title:
            t.title = t.title.replace("aku", "saya")
            count += 1
    return {"replaced": count, "todos": todos}

# Jalankan server
if __name__ == "__main__":
    # Pakai transport stdio untuk development/testing
    mcp.run(transport="stdio")
