/*
  Warnings:

  - You are about to drop the column `asal_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `bus_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `tujuan_id` on the `booking` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `kota_awal_id` on the `jadwalbus` table. All the data in the column will be lost.
  - You are about to drop the column `identitas` on the `penumpang` table. All the data in the column will be lost.
  - Added the required column `jadwal_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rute_id` to the `JadwalBus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenis_id` to the `Penumpang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_id` to the `Penumpang` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_asal_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_bus_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_tujuan_id_fkey`;

-- DropIndex
DROP INDEX `Booking_asal_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_bus_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_tujuan_id_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `asal_id`,
    DROP COLUMN `bus_id`,
    DROP COLUMN `tujuan_id`,
    ADD COLUMN `jadwal_id` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `jadwalbus` DROP COLUMN `kota_awal_id`,
    ADD COLUMN `rute_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `penumpang` DROP COLUMN `identitas`,
    ADD COLUMN `jenis_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `nomor_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `JadwalBus` ADD CONSTRAINT `JadwalBus_bus_id_fkey` FOREIGN KEY (`bus_id`) REFERENCES `Bus`(`bus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalBus` ADD CONSTRAINT `JadwalBus_rute_id_fkey` FOREIGN KEY (`rute_id`) REFERENCES `Rute`(`rute_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `JadwalBus`(`jadwal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
