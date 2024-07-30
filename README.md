```bash
bun init
bun i prisma -d
bun i nodemon -d
bun i express @prisma/client sqlite3 cors

bunx prisma init --datasource-provider sqlite

# creo los modelos en prisma/schema.prisma 
bunx prisma migrate dev --name init
```