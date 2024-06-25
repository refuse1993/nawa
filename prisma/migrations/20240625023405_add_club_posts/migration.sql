-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('NOTICE', 'GENERAL');

-- AlterTable
ALTER TABLE "clubs" ALTER COLUMN "representativeId" DROP NOT NULL,
ALTER COLUMN "representativeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "iconUrl" TEXT;

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "type" "PostType" NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
