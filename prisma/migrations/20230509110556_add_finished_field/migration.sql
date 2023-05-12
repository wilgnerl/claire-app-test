/*
  Warnings:

  - Added the required column `finished` to the `ProgressTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressTask" ADD COLUMN     "finished" BOOLEAN NOT NULL;
