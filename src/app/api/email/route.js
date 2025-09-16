import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req) {
  const { bookingId } = await req.json();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tickets: true, bus: true },
  });

  const parameter = {
    transaction_details: {
      order_id: `ORDER-${booking.id}`,
      gross_amount: booking.totalPrice,
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: booking.tickets[0].name,
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return new Response(JSON.stringify(transaction), { status: 200 });
}
