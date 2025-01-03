import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Ensure we use globalThis to make it work across all environments
if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = prismaClientSingleton();
}

const prisma = globalThis.prismaGlobal;

export default prisma;

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}
