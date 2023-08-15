/*
  Warnings:

  - You are about to drop the column `aadhaar_back_path` on the `kyc_info` table. All the data in the column will be lost.
  - You are about to drop the column `aadhaar_front_path` on the `kyc_info` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kyc_info" DROP COLUMN "aadhaar_back_path",
DROP COLUMN "aadhaar_front_path",
ADD COLUMN     "rejection_reason" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "request_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "selfie_match_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "selfie_string" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "supported_flows" TEXT[],
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_call_trackings" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "api_endpoint" TEXT NOT NULL,
    "request_type" TEXT NOT NULL,
    "request_params" TEXT,
    "response_data" TEXT,
    "status_code" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "response_identifier" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_call_trackings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vendor_call_trackings" ADD CONSTRAINT "vendor_call_trackings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_call_trackings" ADD CONSTRAINT "vendor_call_trackings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
