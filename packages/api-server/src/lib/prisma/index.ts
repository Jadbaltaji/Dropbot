import { PrismaClient } from '@prisma/client';

export {
  Wallet,
  User,
  UserRole,
  Transaction,
  CheckoutStatus,
  PackageType,
  RouteJobExecutor,
} from '@prisma/client';

const prismaClientPropertyName = `__prevent-name-collision__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

const getPrismaClient = () => {
  if (process.env.NODE_ENV === `dev`) {
    return new PrismaClient();
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient;
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient();
    }
    return newGlobalThis[prismaClientPropertyName];
  }
};

const prisma = getPrismaClient();

export const Prisma = prisma;
