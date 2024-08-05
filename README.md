# Setup


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

## info para el deploy en Plesk (passenger phusion)

Mi server requiere app.cjs para poder correr ES en vez de commonJS. Es problema de mi phusion passenger. 
    
```js
import('./index.js').then(module => {
    // Tu aplicación se inicia aquí
}).catch(err => {
    console.error('Failed to load the application:', err);
});
```

Si quisera configurar el nginx para especificar un puerto como reverse-proxy debería agregar el código:

```nginx

// ChatGPT

location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

// o este otro (Claude)
location / {
	proxy_pass http://127.0.0.1:3001;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection 'upgrade';
	proxy_set_header Host $host;
	proxy_cache_bypass $http_upgrade;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
}
```