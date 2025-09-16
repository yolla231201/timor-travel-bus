-- CreateTable
CREATE TABLE `JadwalBus` (
    `jadwal_id` VARCHAR(191) NOT NULL,
    `bus_id` VARCHAR(191) NOT NULL,
    `kota_awal_id` VARCHAR(191) NOT NULL,
    `jam_keberangkatan` VARCHAR(191) NOT NULL,
    `jam_tiba_kota_akhir` VARCHAR(191) NOT NULL,
    `sesi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`jadwal_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
