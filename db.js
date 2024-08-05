import { PrismaClient } from '@prisma/client'

// Configuración avanzada de Prisma
const prisma = new PrismaClient({
    log: [
        // { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
    ],
    errorFormat: 'pretty',
})

prisma.$on('query', (e) => {
    // console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
})

export default prisma