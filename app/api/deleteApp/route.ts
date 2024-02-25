import sqlite3 from "sqlite3";
import { promisify } from "util";

export async function POST(req: Request, res: Response) {
  const resData = await req.json();
  const { id} = resData;

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
      `DELETE FROM code WHERE id = ?`,
      [id]
    );
    
    console.log(`A row has been inserted`);
  } catch (error) {
    console.log("Error!!!!2");
    console.error(error);
  }

  // close the database connection
  db.close();
  return new Response("deleted", { status: 200 });
}


