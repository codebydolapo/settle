import {prisma} from "./prisma"
async function generateUniqueUsername(base: string) {
  let username = base;
  let exists = await prisma.user.findUnique({ where: { username } });
  
  while (exists) {
    username = `${base}${Math.floor(Math.random() * 1000)}`;
    exists = await prisma.user.findUnique({ where: { username } });
  }
  return username;
}