-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bus` (
    `bus_id` VARCHAR(191) NOT NULL,
    `nama_bus` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `harga_per_km` INTEGER NOT NULL,
    `kapasitas` INTEGER NOT NULL,

    PRIMARY KEY (`bus_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kota` (
    `kota_id` VARCHAR(191) NOT NULL,
    `nama_kota` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kota_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jarak` (
    `jarak_id` VARCHAR(191) NOT NULL,
    `from_kota_id` VARCHAR(191) NOT NULL,
    `to_kota_id` VARCHAR(191) NOT NULL,
    `jarak_km` INTEGER NOT NULL,

    PRIMARY KEY (`jarak_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RuteBus` (
    `rute_id` VARCHAR(191) NOT NULL,
    `bus_id` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL,
    `kota_id` VARCHAR(191) NOT NULL,
    `arah` VARCHAR(191) NOT NULL,
    `durasi_jam` DOUBLE NOT NULL,
    `buffer_jam` DOUBLE NOT NULL,

    PRIMARY KEY (`rute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `bus_id` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `kota_asal_id` VARCHAR(191) NOT NULL,
    `kota_tujuan_id` VARCHAR(191) NOT NULL,
    `jumlah_penumpang` INTEGER NOT NULL,
    `nama_penumpang` VARCHAR(191) NOT NULL,
    `no_identitas` VARCHAR(191) NOT NULL,
    `kursi` VARCHAR(191) NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `kode_booking` VARCHAR(191) NOT NULL,
    `metode_pembayaran` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Booking_kode_booking_key`(`kode_booking`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Jarak` ADD CONSTRAINT `Jarak_from_kota_id_fkey` FOREIGN KEY (`from_kota_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jarak` ADD CONSTRAINT `Jarak_to_kota_id_fkey` FOREIGN KEY (`to_kota_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RuteBus` ADD CONSTRAINT `RuteBus_bus_id_fkey` FOREIGN KEY (`bus_id`) REFERENCES `Bus`(`bus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RuteBus` ADD CONSTRAINT `RuteBus_kota_id_fkey` FOREIGN KEY (`kota_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalBus` ADD CONSTRAINT `JadwalBus_bus_id_fkey` FOREIGN KEY (`bus_id`) REFERENCES `Bus`(`bus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalBus` ADD CONSTRAINT `JadwalBus_kota_awal_id_fkey` FOREIGN KEY (`kota_awal_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_bus_id_fkey` FOREIGN KEY (`bus_id`) REFERENCES `Bus`(`bus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_kota_asal_id_fkey` FOREIGN KEY (`kota_asal_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_kota_tujuan_id_fkey` FOREIGN KEY (`kota_tujuan_id`) REFERENCES `Kota`(`kota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
