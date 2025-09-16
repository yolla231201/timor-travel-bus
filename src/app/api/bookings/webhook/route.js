import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import midtransClient from "midtrans-client";

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const statusResponse = await core.transaction.notification(body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    console.log("Midtrans webhook:", { orderId, transactionStatus });

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      // update booking jadi paid
      const booking = await prisma.booking.update({
        where: { id: orderId },
        data: { status: "paid" },
      });

      // ubah kursi jadi booked
      await prisma.seat.updateMany({
        where: { bookingId: orderId },
        data: { status: "booked", lockedAt: null },
      });

      // generate tiket
      const seats = await prisma.seat.findMany({
        where: { bookingId: orderId },
      });

      await prisma.ticket.createMany({
        data: seats.map((s) => ({
          id: uuidv4(),
          ticketCode: uuidv4(),
          seatNumber: s.seatNumber,
          bookingId: booking.id,
        })),
      });
    }

    if (
      transactionStatus === "expire" ||
      transactionStatus === "cancel" ||
      transactionStatus === "deny"
    ) {
      // update booking expired
      await prisma.booking.update({
        where: { id: orderId },
        data: { status: "expired" },
      });

      // kursi kembali available
      await prisma.seat.updateMany({
        where: { bookingId: orderId },
        data: { status: "available", bookingId: null, lockedAt: null },
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Booking Webhook Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
