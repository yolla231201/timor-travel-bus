/*
  Warnings:

  - You are about to drop the column `jumlah_penumpang` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `kode_booking` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `kota_asal_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `kota_tujuan_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `kursi` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `metode_pembayaran` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `nama_penumpang` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `no_identitas` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `kategori` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `from_kota_id` on the `jarak` table. All the data in the column will be lost.
  - You are about to drop the column `to_kota_id` on the `jarak` table. All the data in the column will be lost.
  - You are about to drop the `jadwalbus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rutebus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `asal_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tujuan_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durasi_per_km` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asal_id` to the `Jarak` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tujuan_id` to the `Jarak` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_kota_asal_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_kota_tujuan_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwalbus` DROP FOREIGN KEY `JadwalBus_bus_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwalbus` DROP FOREIGN KEY `JadwalBus_kota_awal_id_fkey`;

-- DropForeignKey
ALTER TABLE `jarak` DROP FOREIGN KEY `Jarak_from_kota_id_fkey`;

-- DropForeignKey
ALTER TABLE `jarak` DROP FOREIGN KEY `Jarak_to_kota_id_fkey`;

-- DropForeignKey
ALTER TABLE `rutebus` DROP FOREIGN KEY `RuteBus_bus_id_fkey`;

-- DropForeignKey
ALTER TABLE `rutebus` DROP FOREIGN KEY `RuteBus_kota_id_fkey`;

-- DropIndex
DROP INDEX `Booking_kode_booking_key` ON `booking`;

-- DropIndex
DROP INDEX `Booking_kota_asal_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_kota_tujuan_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Bus_nama_bus_key` ON `bus`;

-- DropIndex
DROP INDEX `Jarak_from_kota_id_fkey` ON `jarak`;

-- DropIndex
DROP INDEX `Jarak_to_kota_id_fkey` ON `jarak`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `jumlah_penumpang`,
    DROP COLUMN `kode_booking`,
    DROP COLUMN `kota_asal_id`,
    DROP COLUMN `kota_tujuan_id`,
    DROP COLUMN `kursi`,
    DROP COLUMN `metode_pembayaran`,
    DROP COLUMN `nama_penumpang`,
    DROP COLUMN `no_identitas`,
    DROP COLUMN `status`,
    ADD COLUMN `asal_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `jumlah` INTEGER NOT NULL,
    ADD COLUMN `tujuan_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `bus` DROP COLUMN `kategori`,
    ADD COLUMN `durasi_per_km` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `jarak` DROP COLUMN `from_kota_id`,
    DROP COLUMN `to_kota_id`,
    ADD COLUMN `asal_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `tujuan_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `jadwalbus`;

-- DropTable
DROP TABLE `rutebus`;

-- AddForeignKey
ALTER TABLE `Jarak` ADD CONSTRAINT `Jarak_asal_id_fkey` FOREIGN KEY (`asal_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jarak` ADD CONSTRAINT `Jarak_tujuan_id_fkey` FOREIGN KEY (`tujuan_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_asal_id_fkey` FOREIGN KEY (`asal_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tujuan_id_fkey` FOREIGN KEY (`tujuan_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
