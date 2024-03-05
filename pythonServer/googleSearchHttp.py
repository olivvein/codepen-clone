from flask import Flask, request, jsonify
import httpx
import asyncio
from bs4 import BeautifulSoup
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 

async def get_organic_data(searchString):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    async with httpx.AsyncClient() as client:
        searchString=searchString.replace(" ","+")
        searchString=searchString+"+"

        response = await client.get(f'https://www.google.com/search?q={searchString}', headers=headers,follow_redirects=True)
        soup = BeautifulSoup(response.content, "html.parser")
        organic_results = []
        i = 0

        for el in soup.select(".g"):
            try:
                
                organic_results.append({
                    "title": el.select_one("h3").text,
                    "link": el.select_one(".yuRUbf").a["href"],
                    "description": el.select_one(".VwiC3b").text,
                    "icon": el.select_one(".eqA2re").img["src"],
                    "rank": i+1,
                    "searchString": searchString,
                })
            except:
                pass

            i+=1   
        print(len(organic_results))
        if len(organic_results) == 0:
            print(soup)

        return organic_results

@app.route('/search', methods=['GET'])
def search():
    searchString = request.args.get('q', default = '', type = str)
    results = asyncio.run(get_organic_data(searchString))
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5001, host="0.0.0.0")