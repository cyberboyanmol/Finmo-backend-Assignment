-- AlterTable
ALTER TABLE "User" ALTER COLUMN "is_email_verified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "UserAccount" ALTER COLUMN "currency" SET DEFAULT 'USD';
