/*
  Warnings:

  - You are about to alter the column `jam_keberangkatan` on the `jadwalbus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `jam_tiba_kota_akhir` on the `jadwalbus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `jadwalbus` MODIFY `jam_keberangkatan` DATETIME(3) NOT NULL,
    MODIFY `jam_tiba_kota_akhir` DATETIME(3) NOT NULL;
