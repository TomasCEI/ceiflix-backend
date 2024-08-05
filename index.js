//const express = require('express');
//const { PrismaClient } = require('@prisma/client');
//const cors = require('cors');

import cors from 'cors';
import express from 'express';

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// Uso configuración avanzada de prisma
import prisma from './db.js'
import prismaErrorHandler from './middleware/prismaErrorHandler.js'

const app = express();

app.use(cors());
app.use(express.json());



// -----------------------------------------
// -           Rutas De la Web             -
// -----------------------------------------
// Ruta Principal
app.get("/", (req, res) => {
    //res.send("Bienvenido al server de pelis use server/api/");
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido al Server de Pelis</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                color: #2c3e50;
            }
            .api-link {
                display: inline-block;
                background-color: #3498db;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .api-link:hover {
                background-color: #2980b9;
            }
        </style>
    </head>
    <body>
        <img src="./images/einstein.png" />
        <h1>Bienvenido al Server de Pelis</h1>
        <p>Este es el servidor principal para el servicio de películas.</p>
        <p>Para acceder a la API, utiliza el siguiente enlace:</p>
        <a href="/api/pelis" class="api-link">Ir a la API</a>

        <h2>Lista de endpoints</h2>
        <ul>
        <li><a href="/api/pelis">/api/pelis</a> GET - Obtener todas las películas</li>
        <li><a href="/api/pelis/:id">/api/pelis/:id</a> GET - Obtener una película</li>
        <li><a href="/api/pelis">/api/pelis</a> POST - Crear una película</li>
        <li><a href="/api/pelis/:id">/api/pelis/:id</a> PUT - Actualizar una película</li>
        <li><a href="/api/pelis/:id">/api/pelis/:id</a> DELETE - Eliminar una película</li>
        </ul>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

// -----------------------------------------
// -           Rutas api/usuarios          -
// -----------------------------------------
// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { nombre, clave } = req.body;
    console.log("Registrando usuario: ", nombre, clave);
    try {
        const usuario = await prisma.usuario.create({
            data: { nombre, clave },
        });
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo crear el usuario', msg: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { nombre, clave } = req.body;

    console.log("Haciendo LogIn de usuario: ", nombre, clave);
    const usuario = await prisma.usuario.findUnique({ where: { nombre } });
    console.log("Encontre usuario: ", usuario, "comparando claves...");

    if (usuario && usuario.clave === clave) {
        //res.json({ message: 'Login exitoso', userId: usuario.id });
        res.json({ message: 'Login exitoso', user: usuario });
    } else {
        res.status(400).json({ error: 'Credenciales inválidas' });
    }
});

// -----------------------------------------
// -            Rutas api/pelis            -
// -----------------------------------------
// Obtener todas las películas
app.get('/api/pelis', async (req, res) => {
    try {
        const pelicula = await prisma.pelicula.findMany();
        res.json(pelicula);
    } catch (error) {
        console.error('Error en la operación de Prisma:', error);
        next(error); // Pasa el error al siguiente middleware
    }
});

// Obtener una película
app.get('/api/pelis/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pelicula = await prisma.pelicula.findUnique({ where: { id: Number(id) } });
        res.json(pelicula);
    } catch (error) {
        console.error('Error en la operación de Prisma:', error);
        next(error); // Pasa el error al siguiente middleware
    }
});

// Crear una película
app.post('/api/pelis', async (req, res) => {
    const { titulo, imagen, idUsuario, director } = req.body;

    console.log("Creando pelicula: ", titulo, imagen, idUsuario, director);

    try {
        const pelicula = await prisma.pelicula.create({
            data: { titulo, imagen, director, idUsuario: Number(idUsuario) },
        });
        res.json(pelicula);

    } catch (error) {
        res.status(400).json({ error: 'No se pudo crear la película', msg: error.message });
    }
});

// Actualizar una película
app.put('/api/pelis/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, imagen, isVista } = req.body;
    const pelicula = await prisma.pelicula.update({
        where: { id: Number(id) },
        data: { titulo, imagen, isVista },
    });
    res.json(pelicula);
});

// Eliminar una película
app.delete('/api/pelis/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.pelicula.delete({ where: { id: Number(id) } });
    res.json({ message: 'Película eliminada' });
});


// -----------------------------------------------------
// Crucial que middleware de errores vayan al final
// -----------------------------------------------------

// Usa el manejador de errores de Prisma antes de tu manejador de errores general
app.use(prismaErrorHandler)

// app.use((err, req, res, next) => {
//     if (err instanceof prisma.PrismaClientKnownRequestError) {
//         // Manejar errores específicos de Prisma
//         console.error('Error de Prisma:', err);
//         res.status(500).send('Error en la base de datos');
//     } else {
//         // Otros errores
//         console.error(err.stack);
//         res.status(500).send('Something broke amigo!!');
//     }
//});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke amigo!!');
});
app.use((req, res, next) => {
    res.status(404).send('No encontré la pagina que me pedis amigo!');
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de pelis en http://localhost:${PORT}`));