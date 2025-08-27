-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evolution_instances" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evolution_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."instances" (
    "id" TEXT NOT NULL,
    "instanceName" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "webhookWaBusiness" TEXT,
    "accessTokenWaBusiness" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "evolutionInstanceId" TEXT NOT NULL,

    CONSTRAINT "instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hashes" (
    "id" TEXT NOT NULL,
    "apikey" TEXT NOT NULL,
    "evolutionInstanceId" TEXT NOT NULL,

    CONSTRAINT "hashes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "id" TEXT NOT NULL,
    "rejectCall" BOOLEAN NOT NULL,
    "msgCall" TEXT NOT NULL,
    "groupsIgnore" BOOLEAN NOT NULL,
    "alwaysOnline" BOOLEAN NOT NULL,
    "readMessages" BOOLEAN NOT NULL,
    "readStatus" BOOLEAN NOT NULL,
    "syncFullHistory" BOOLEAN NOT NULL,
    "evolutionInstanceId" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instances_evolutionInstanceId_key" ON "public"."instances"("evolutionInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "hashes_evolutionInstanceId_key" ON "public"."hashes"("evolutionInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_evolutionInstanceId_key" ON "public"."settings"("evolutionInstanceId");

-- AddForeignKey
ALTER TABLE "public"."instances" ADD CONSTRAINT "instances_evolutionInstanceId_fkey" FOREIGN KEY ("evolutionInstanceId") REFERENCES "public"."evolution_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hashes" ADD CONSTRAINT "hashes_evolutionInstanceId_fkey" FOREIGN KEY ("evolutionInstanceId") REFERENCES "public"."evolution_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."settings" ADD CONSTRAINT "settings_evolutionInstanceId_fkey" FOREIGN KEY ("evolutionInstanceId") REFERENCES "public"."evolution_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
