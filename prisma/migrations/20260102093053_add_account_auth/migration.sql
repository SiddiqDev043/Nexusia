-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "role" "MemberRole" NOT NULL DEFAULT 'MAHASISWA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_npm_key" ON "Account"("npm");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_clerkUserId_key" ON "Account"("clerkUserId");

-- CreateIndex
CREATE INDEX "Account_npm_idx" ON "Account"("npm");

-- CreateIndex
CREATE INDEX "Account_email_idx" ON "Account"("email");
