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
    where: { npm: "2214373010" },
    update: {},
    create: {
      npm: "2214373010",
      email: "suhe.c2020@gmail.com@gmail.com",
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
    where: { npm: "2214373062" },
    update: {},
    create: {
      npm: "2214373062",
      email: "reyhanmohammed74@gmail.com",
      role: MemberRole.DOSEN,
    },
  });

  console.log("Seed OK");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
