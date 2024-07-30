//const express = require('express');
//const { PrismaClient } = require('@prisma/client');
//const cors = require('cors');

import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// -----------------------------------------
// -           Rutas De la Web             -
// -----------------------------------------
// Ruta Principal
app.get("/", (req, res) => {
    res.send("Bienvenido al server de pelis use server/api/");
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
    const pelis = await prisma.pelicula.findMany({
        wgere
    });
    res.json(pelis);
});

// Obtener una película
app.get('/api/pelis/:id', async (req, res) => {
    const { id } = req.params;
    const pelicula = await prisma.pelicula.findUnique({ where: { id: Number(id) } });
    res.json(pelicula);
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

// // Actualizar una película
// app.put('/api/movies/:id', async (req, res) => {
//     const { id } = req.params;
//     const { title, imageUrl, watched } = req.body;
//     const movie = await prisma.movie.update({
//         where: { id: Number(id) },
//         data: { title, imageUrl, watched },
//     });
//     res.json(movie);
// });

// // Eliminar una película
// app.delete('/api/movies/:id', async (req, res) => {
//     const { id } = req.params;
//     await prisma.movie.delete({ where: { id: Number(id) } });
//     res.json({ message: 'Película eliminada' });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de pelis en http://192.168.1.102:${PORT}`));