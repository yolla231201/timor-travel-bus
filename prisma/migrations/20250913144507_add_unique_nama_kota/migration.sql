/*
  Warnings:

  - A unique constraint covering the columns `[nama_kota]` on the table `Kota` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Kota_nama_kota_key` ON `Kota`(`nama_kota`);
