// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from ".prisma/client";

export default defineNuxtPlugin((nuxtApp) => {
    const prisma = new PrismaClient();
    nuxtApp.provide("prisma", prisma);
});
