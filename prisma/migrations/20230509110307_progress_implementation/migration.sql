-- CreateTable
CREATE TABLE "ProgressTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkBoxId" TEXT NOT NULL,

    CONSTRAINT "ProgressTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgressTask" ADD CONSTRAINT "ProgressTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
