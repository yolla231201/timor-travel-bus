/*
  Warnings:

  - The primary key for the `booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `booking_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `jadwal_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `total_harga` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `booking` table. All the data in the column will be lost.
  - The primary key for the `bus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bus_id` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `harga_per_km` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `kapasitas` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `nama_bus` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the `jadwalbus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `penumpang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rute` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ktp` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Bus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_jadwal_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwalbus` DROP FOREIGN KEY `JadwalBus_bus_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwalbus` DROP FOREIGN KEY `JadwalBus_rute_id_fkey`;

-- DropForeignKey
ALTER TABLE `penumpang` DROP FOREIGN KEY `Penumpang_booking_id_fkey`;

-- DropIndex
DROP INDEX `Booking_jadwal_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_user_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Bus_nama_bus_key` ON `bus`;

-- AlterTable
ALTER TABLE `booking` DROP PRIMARY KEY,
    DROP COLUMN `booking_id`,
    DROP COLUMN `jadwal_id`,
    DROP COLUMN `jumlah`,
    DROP COLUMN `status`,
    DROP COLUMN `tanggal`,
    DROP COLUMN `total_harga`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `ktp` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `scheduleId` INTEGER NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `bus` DROP PRIMARY KEY,
    DROP COLUMN `bus_id`,
    DROP COLUMN `harga_per_km`,
    DROP COLUMN `kapasitas`,
    DROP COLUMN `nama_bus`,
    ADD COLUMN `basePrice` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('Ekonomi', 'Bisnis', 'Eksekutif') NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `jadwalbus`;

-- DropTable
DROP TABLE `kota`;

-- DropTable
DROP TABLE `penumpang`;

-- DropTable
DROP TABLE `rute`;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `distance` INTEGER NOT NULL,

    UNIQUE INDEX `City_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusFacility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `busId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusRoute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `busId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,
    `routeOrder` INTEGER NOT NULL,
    `departureForward` VARCHAR(191) NULL,
    `departureBackward` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `busId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `fromCityId` INTEGER NOT NULL,
    `toCityId` INTEGER NOT NULL,
    `departure` VARCHAR(191) NOT NULL,
    `arrival` VARCHAR(191) NOT NULL,
    `travelTime` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `availableSeats` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BusFacility` ADD CONSTRAINT `BusFacility_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusRoute` ADD CONSTRAINT `BusRoute_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusRoute` ADD CONSTRAINT `BusRoute_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_fromCityId_fkey` FOREIGN KEY (`fromCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_toCityId_fkey` FOREIGN KEY (`toCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
