import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from "sqlite3";
import { promisify } from "util";

export async function POST(req: Request, res: Response) {
  const {id} = await req.json();
  const theApps: any[] = [];
  const db = new sqlite3.Database("myDatabase.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  });

  const run = promisify(db.run).bind(db);
  const all = promisify(db.all).bind(db);
  try {
    const rows: any[] = await all(`SELECT * FROM code WHERE id = ?`,[id]);
    rows.forEach((row) => {
      theApps.push(row);
    });
  } catch (error) {
    console.log("Error!!!!2");
    console.error(error);
  }

  return new Response(JSON.stringify(theApps), { status: 200 });
}