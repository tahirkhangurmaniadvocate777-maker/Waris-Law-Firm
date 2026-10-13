-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "matterType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "toolUsed" TEXT NOT NULL,
    "draftType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferencerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "sectionNumber" TEXT,
    "title" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "shortNote" TEXT NOT NULL,
    "relatedSections" TEXT,
    "checklistJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "UsageLog_leadId_idx" ON "UsageLog"("leadId");

-- CreateIndex
CREATE INDEX "ReferencerEntry_category_idx" ON "ReferencerEntry"("category");

-- CreateIndex
CREATE INDEX "ReferencerEntry_sectionNumber_idx" ON "ReferencerEntry"("sectionNumber");

