import { pool } from '../../../lib/db';
import { NextResponse } from "next/server";

// GET method
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM public.transactions ORDER BY transaction_date DESC');
    return NextResponse.json({ message: "Ok", result: result.rows }, { status: 200 });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

// POST method
export async function POST(request) {
  try {
    const body = await request.json();
    const { transaction_type, transaction_date, description, deposit_amount, withdraw_amount } = body;

    const query = `
      INSERT INTO public.transactions (transaction_type, transaction_date, description, deposit_amount, withdraw_amount)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const values = [transaction_type, transaction_date, description, deposit_amount, withdraw_amount];
    const result = await pool.query(query, values);

    return NextResponse.json({ message: "Transaction added", transaction: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

// PUT method
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, transaction_type, transaction_date, description, deposit_amount, withdraw_amount } = body;

    const query = `
      UPDATE public.transactions
      SET transaction_type = $1, transaction_date = $2, description = $3, 
          deposit_amount = $4, withdraw_amount = $5
      WHERE id = $6 RETURNING *`;

    const values = [ transaction_type, transaction_date, description, deposit_amount, withdraw_amount, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction updated", transaction: result.rows[0] }, { status: 200 });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

// DELETE method
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const query = `DELETE FROM public.transactions WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted", transaction: result.rows[0] }, { status: 200 });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
