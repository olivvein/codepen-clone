import fs from 'fs';
import path from 'path';

export async function GET(req: Request, res: Response) {
  //list files in /public/images
  const directoryPath = path.join(process.cwd(), 'public', 'images');
  let theImages: string[] = [];

  try {
    theImages = fs.readdirSync(directoryPath);
  } catch (err) {
    console.error(`Error getting files from directory ${directoryPath}:`, err);
    return new Response(JSON.stringify({ error: 'Error getting files' }), { status: 500 });
  }



  return new Response(JSON.stringify(theImages), { status: 200 });
}