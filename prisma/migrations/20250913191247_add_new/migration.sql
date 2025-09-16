/*
  Warnings:

  - You are about to drop the column `jam_tiba_kota_akhir` on the `jadwalbus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nama_rute]` on the table `Rute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jam_tiba` to the `JadwalBus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_rute` to the `Rute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rute` DROP FOREIGN KEY `Rute_asal_id_fkey`;

-- DropForeignKey
ALTER TABLE `rute` DROP FOREIGN KEY `Rute_tujuan_id_fkey`;

-- DropIndex
DROP INDEX `Rute_asal_id_tujuan_id_key` ON `rute`;

-- DropIndex
DROP INDEX `Rute_tujuan_id_fkey` ON `rute`;

-- AlterTable
ALTER TABLE `jadwalbus` DROP COLUMN `jam_tiba_kota_akhir`,
    ADD COLUMN `jam_tiba` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `rute` ADD COLUMN `nama_rute` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Rute_nama_rute_key` ON `Rute`(`nama_rute`);
