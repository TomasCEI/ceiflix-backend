import { Prisma } from '@prisma/client'

const prismaErrorHandler = (err, req, res, next) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Estos son errores que Prisma puede identificar específicamente
        console.error('Error de Prisma conocido:', err)
        res.status(400).json({ error: 'Error en la solicitud a la base de datos' })
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        // Errores desconocidos relacionados con la solicitud
        console.error('Error de Prisma desconocido:', err)
        res.status(500).json({ error: 'Error interno del servidor' })
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        // Errores críticos que requieren reiniciar la instancia de Prisma
        console.error('Error crítico de Prisma:', err)
        res.status(500).json({ error: 'Error crítico del servidor' })
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        // Errores durante la inicialización del cliente Prisma
        console.error('Error de inicialización de Prisma:', err)
        res.status(500).json({ error: 'Error en la configuración del servidor' })
    } else {
        // Otros errores
        next(err)
    }
}

export default prismaErrorHandler