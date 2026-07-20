import { MemberRole, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.account.upsert({
    where: { npm: "2214373011" },
    update: {
      role: MemberRole.ADMIN,
    },
    create: {
      npm: "2214373011",
      email: "hafidzsddq03@gmail.com",
      role: MemberRole.ADMIN,
    },
  });

  await prisma.account.upsert({
    where: { npm: " 0109047701" },
    update: {},
    create: {
      npm: " 0109047701",
      email: "suhe.c2020@gmail.com",
      role: MemberRole.ADMIN,
    },
  });

  await prisma.account.upsert({
    where: { npm: "2214373012" },
    update: {},
    create: {
      npm: "2214373012",
      email: "kumpultugas865@gmail.com",
      role: MemberRole.MAHASISWA,
    },
  });

  await prisma.account.upsert({
    where: { npm: "2214373015" },
    update: {},
    create: {
      npm: "2214373015",
      email: "emailbaruku11223344@gmail.com",
      role: MemberRole.DOSEN,
    },
  });

  await prisma.account.upsert({
    where: { npm: "2214373017" },
    update: {},
    create: {
      npm: "2214373017",
      email: "kristiyanronaldo500@gmail.com",
      role: MemberRole.ADMIN,
    },
  });

   await prisma.account.upsert({
    where: { npm: "2214373018" },
    update: {},
    create: {
      npm: "2214373018",
      email: "jangandipake982@gmail.com",
      role: MemberRole.MAHASISWA
    },
  });

  console.log("Seed OK");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
