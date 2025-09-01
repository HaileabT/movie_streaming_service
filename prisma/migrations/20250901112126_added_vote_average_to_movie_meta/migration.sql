/*
  Warnings:

  - Added the required column `vote_average` to the `movie_meta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."movie_meta" ADD COLUMN     "vote_average" DOUBLE PRECISION NOT NULL;
