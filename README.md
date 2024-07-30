```bash
bun init
bun i prisma -d
bun i nodemon -d
bun i express @prisma/client sqlite3 cors

bunx prisma init --datasource-provider sqlite

# creo los modelos en prisma/schema.prisma 
bunx prisma migrate dev --name init
```

After update your github repo use:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Pull the latest changes from your Git repository
git pull origin main

# Install any new or updated npm packages
npm install

# Restart your Node.js application (adjust this command based on your setup)
pm2 restart app-name
```