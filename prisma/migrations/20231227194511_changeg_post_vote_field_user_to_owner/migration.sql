/*
  Warnings:

  - You are about to drop the column `userId` on the `PostVote` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `PostVote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "PostVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PostVote_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostVote" ("id", "postId", "type") SELECT "id", "postId", "type" FROM "PostVote";
DROP TABLE "PostVote";
ALTER TABLE "new_PostVote" RENAME TO "PostVote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
