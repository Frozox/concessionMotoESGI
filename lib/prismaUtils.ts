import { PrismaClient } from "@prisma/client";

export function exclude<Object, Key extends keyof Object>(
  object: Object,
  ...keys: Key[]
): Omit<Object, Key> {
  for (let key of keys) {
    delete object[key];
  }
  return object;
}

export class PrismaClientSingleton {
  public prisma: PrismaClient;
  private static instance: PrismaClientSingleton;
  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance = () => {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClientSingleton();
    }
    return PrismaClientSingleton.instance;
  };
}
