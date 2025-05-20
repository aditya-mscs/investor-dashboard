import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { pool } from "@/db/pool";

// POST /api/investor
// Handles form submission for investor data
export async function POST(req: Request): Promise<Response> {
  // Check if the request is authenticated
  const authHeader = req.headers.get("authorization");
  const TOKEN = process.env.API_AUTH_TOKEN || "secure-mock-token";
  if (!authHeader || authHeader !== `Bearer ${TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Parse the form data
  const formData = await req.formData();
  const { firstName, lastName, dob, phone, street, state, zip, ssn } =
    Object.fromEntries(formData.entries()) as Record<string, string>;
  const document = formData.get("document") as File;

  //File validation
  const buffer = Buffer.from(await document.arrayBuffer());
  const MAX_SIZE_MB = 20;
  if (buffer.byteLength > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: "File size exceeds limit" },
      { status: 400 }
    );
  }
  const fileName = `${Date.now()}-${document.name}`;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);

  try {
    const existing = await pool.query(
      "SELECT * FROM investors WHERE ssn = $1",
      [ssn]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE investors SET street=$1, state=$2, zip=$3, file_path=$4 WHERE ssn=$5",
        [street, state, zip, filePath, ssn]
      );
    } else {
      await pool.query(
        "INSERT INTO investors (first_name, last_name, date_of_birth, phone, street, state, zip, ssn, file_path) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [firstName, lastName, dob, phone, street, state, zip, ssn, filePath]
      );
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Case": "investor-submit", //TODO: Add testing hooks for Playwright/Jest
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// GET /api/investor
// Fetches the count of investors in the database
export async function GET(): Promise<Response> {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM investors");
    const count = parseInt(result.rows[0].count, 10);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("GET /api/investor error:", error);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
