/*
  Warnings:

  - You are about to drop the column `durasi_per_km` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the `jarak` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nama_bus]` on the table `Bus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `jarak` DROP FOREIGN KEY `Jarak_asal_id_fkey`;

-- DropForeignKey
ALTER TABLE `jarak` DROP FOREIGN KEY `Jarak_tujuan_id_fkey`;

-- AlterTable
ALTER TABLE `bus` DROP COLUMN `durasi_per_km`;

-- DropTable
DROP TABLE `jarak`;

-- CreateTable
CREATE TABLE `Rute` (
    `rute_id` VARCHAR(191) NOT NULL,
    `asal_id` VARCHAR(191) NOT NULL,
    `tujuan_id` VARCHAR(191) NOT NULL,
    `jarak_km` INTEGER NOT NULL,
    `durasi_jam` DOUBLE NOT NULL,

    PRIMARY KEY (`rute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Bus_nama_bus_key` ON `Bus`(`nama_bus`);

-- AddForeignKey
ALTER TABLE `Rute` ADD CONSTRAINT `Rute_asal_id_fkey` FOREIGN KEY (`asal_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rute` ADD CONSTRAINT `Rute_tujuan_id_fkey` FOREIGN KEY (`tujuan_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
