import sqlite3 from "sqlite3";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request, res: Response) {
  const resData = await req.json();
  let { htmlCode, visibleJsCode, appTitle } = resData;


  const cssCode = "";
  const db = new sqlite3.Database("myDatabase.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  });

  const run = promisify(db.run).bind(db);

  // db.run(`CREATE TABLE IF NOT EXISTS code (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     htmlCode TEXT,
  //     cssCode TEXT,
  //     visibleJsCode TEXT,
  //     appTitle TEXT
  // )`, (err) => {
  //     if (err) {
  //         return console.error(err.message);
  //     }
  // });

  try {
    await run(
      `INSERT INTO code (htmlCode, cssCode, visibleJsCode,appTitle) VALUES (?, ?, ?,?)`,
      [htmlCode, cssCode, visibleJsCode, appTitle]
    );
    console.log(`A row has been inserted`);
  } catch (error) {
    console.log("Error!!!!2");
    console.error(error);
  }

  // close the database connection
  db.close();
  return new Response("inserted", { status: 200 });
}

export async function GET(req: Request, res: Response) {
    const theApps: any[]=[];
  const db = new sqlite3.Database("myDatabase.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  });

const run = promisify(db.run).bind(db);
const all = promisify(db.all).bind(db);
try {
    const rows: any[] = await all(`SELECT * FROM code`);
    rows.forEach((row) => {
        theApps.push(row);
    });
} catch (error) {
    console.log("Error!!!!2");
    console.error(error);
}


  return new Response(JSON.stringify(theApps), { status: 200 });
}
