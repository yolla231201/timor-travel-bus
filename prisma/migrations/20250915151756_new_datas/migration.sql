/*
  Warnings:

  - You are about to drop the column `createdAt` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `ktp` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `booking` table. All the data in the column will be lost.
  - You are about to alter the column `userId` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `type` on the `bus` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the column `lat` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `city` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nama` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `telp` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `busfacility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `busroute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `busId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromCityId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numPassengers` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passengers` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toCityId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureTimes` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilities` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routes` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_userId_fkey`;

-- DropForeignKey
ALTER TABLE `busfacility` DROP FOREIGN KEY `BusFacility_busId_fkey`;

-- DropForeignKey
ALTER TABLE `busroute` DROP FOREIGN KEY `BusRoute_busId_fkey`;

-- DropForeignKey
ALTER TABLE `busroute` DROP FOREIGN KEY `BusRoute_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_busId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_fromCityId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_toCityId_fkey`;

-- DropIndex
DROP INDEX `Booking_scheduleId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_userId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `createdAt`,
    DROP COLUMN `ktp`,
    DROP COLUMN `name`,
    DROP COLUMN `scheduleId`,
    ADD COLUMN `busId` INTEGER NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `fromCityId` INTEGER NOT NULL,
    ADD COLUMN `numPassengers` INTEGER NOT NULL,
    ADD COLUMN `passengers` JSON NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `toCityId` INTEGER NOT NULL,
    ADD COLUMN `totalPrice` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `bus` ADD COLUMN `departureTimes` JSON NOT NULL,
    ADD COLUMN `facilities` JSON NOT NULL,
    ADD COLUMN `routes` JSON NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `city` DROP COLUMN `lat`,
    DROP COLUMN `lng`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `nama`,
    DROP COLUMN `telp`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `busfacility`;

-- DropTable
DROP TABLE `busroute`;

-- DropTable
DROP TABLE `schedule`;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_fromCityId_fkey` FOREIGN KEY (`fromCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_toCityId_fkey` FOREIGN KEY (`toCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
