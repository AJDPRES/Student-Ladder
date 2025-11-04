-- Add admin flag to existing users
ALTER TABLE "User"
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
