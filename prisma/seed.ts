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
      email: "kristiyanronaldo500@gmail.com",
      role: MemberRole.DOSEN,
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

  console.log("Seed OK");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
