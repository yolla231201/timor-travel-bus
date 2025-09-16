/*
  Warnings:

  - A unique constraint covering the columns `[asal_id,tujuan_id]` on the table `Rute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rute_asal_id_tujuan_id_key` ON `Rute`(`asal_id`, `tujuan_id`);
