-- AlterTable
ALTER TABLE `booking` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Penumpang` (
    `penumpang_id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `identitas` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`penumpang_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Penumpang` ADD CONSTRAINT `Penumpang_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
