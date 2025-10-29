import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const TodoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  date: z.string().optional().nullable(),
});

const mcpServer = new McpServer({
  name: "TodoServer",
  version: "0.1.0",
  description: "Todo list MCP server implemented in JavaScript",
});

const todos = [];
let nextId = 1;

mcpServer.registerTool("add_todo", {
  description: "Add a new todo item with title and optional date",
  // registerTool expects a raw Zod shape for inputSchema (not a z.object wrapper)
  inputSchema: {
    title: z.string().min(1, "Title is required"),
    date: z.string().min(1).optional(),
  }
}, async (args) => {
  const todo = {
    id: nextId++,
    title: args.title,
    date: args.date ?? null,
  };
  todos.push(todo);
  return todo;
});

mcpServer.registerTool("list_todos", {
  description: "List all todo items",
}, async () => todos);

mcpServer.registerTool("delete_todo", {
  description: "Delete a todo item by its ID",
  inputSchema: {
    todo_id: z.number().int().positive(),
  }
}, async (args) => {
  const before = todos.length;
  const index = todos.findIndex((todo) => todo.id === args.todo_id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
  const after = todos.length;
  return { deleted: before - after };
});

mcpServer.registerTool("update_todo", {
  description: "Update the title of a todo item by its ID",
  inputSchema: {
    todo_id: z.number().int().positive(),
    new_title: z.string().min(1, "New title is required"),
  }
}, async (args) => {
  const todo = todos.find((item) => item.id === args.todo_id);
  if (!todo) {
    return { error: "Todo not found" };
  }
  todo.title = args.new_title;
  return { message: "Todo updated", todo };
});

mcpServer.registerTool("replace_aku_to_saya", {
  description: "Replace 'aku' with 'saya' in all todo titles",
}, async () => {
  let replaced = 0;
  for (const todo of todos) {
    if (todo.title.includes("aku")) {
      todo.title = todo.title.replace(/aku/g, "saya");
      replaced += 1;
    }
  }
  return { replaced, todos };
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start TodoServer:", error);
  process.exit(1);
});
