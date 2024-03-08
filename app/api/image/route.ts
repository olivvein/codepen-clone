import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request, res: Response) {
  let { prompt,size} = await req.json();

  //replace every , by "" 
  
  console.log("Generate image: " + prompt);
  console.log("Size: " + size);

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: size,
    quality: "hd",
  });
  const image_url = response.data[0].url;
  console.log(image_url);

  if (!image_url) {
    return new Response("No image found", { status: 500 });
  }
    prompt = prompt.replace(/,/g, "");
  //make a post to localhost:5000/upload_image with the image_url
    const upload_response = await fetch("http://127.0.0.1:5000/upload_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_url: image_url ,prompt: prompt}),
    });
    const upload_response_json = await upload_response.json();
    console.log(upload_response_json);
    const response2={image_url:upload_response_json.path,prompt:prompt}

  return new Response(JSON.stringify(response2),{ status: 200 });
}
