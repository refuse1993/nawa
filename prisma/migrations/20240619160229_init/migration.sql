/*
  Warnings:

  - Added the required column `name` to the `clubs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
