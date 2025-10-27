from flask import Flask, render_template, request, jsonify, redirect, url_for
import backend  # if you have backend.py for login functions

app = Flask(__name__)  


plants = [
    {
        "name": "Bamboo",
        "info": "Bamboo is the fastest-growing plant on Earth.",
        "advantages": "Strong, eco-friendly, and sustainable.",
        "disadvantages": "Can become invasive if not managed.",
        "uses": "Used for building, paper, and textile production.",
        "benefits": "Improves soil and air quality.",
        "model": "https://sketchfab.com/models/a02bf0e3ffe44617ad49daf3cd94fe59/embed",
        "image": "https://tse2.mm.bing.net/th/id/OIP.vY975J-GwWplXsDN8Xp56QHaHa?pid=Api&P=0&h=180"
    },
    {
    "name": "Kadamba",
    "info": "Kadamba is a tropical tree known for its fragrant flowers and cultural significance in India.",
    "advantages": "Beautiful flowers, supports biodiversity, culturally significant.",
    "disadvantages": "Needs proper space; can grow large.",
    "uses": "Ornamental tree, religious and cultural purposes.",
    "benefits": "Adds aesthetic value, attracts pollinators, used in traditional ceremonies.",
    "model": "https://sketchfab.com/models/437e2e93786e44069aa5fdce3128ced2/embed",
    "image": "https://kadiyamrajasrinursery.com/cdn/shop/products/cadambaburflower-treekadamcadambakadamba-tree-1-live-healthy-plant-kadiyam-nursery-3_1000x667.jpg?v=1672226582"
},
{
        "name": "Ginger",
        "info": "Ginger is a popular spice with powerful medicinal properties.",
        "advantages": "Helps digestion, reduces nausea, fights cold and flu.",
        "disadvantages": "May cause heartburn if consumed in excess.",
        "uses": "Used in cooking, teas, and Ayurvedic medicine.",
        "benefits": "Anti-inflammatory, boosts immunity, improves metabolism.",
        "model": "https://sketchfab.com/models/de8da99c3c1742708cd4ea858750b881/embed",
        "image": "https://cdn.pixabay.com/photo/2023/03/30/21/06/ginger-7888804_1280.jpg"
    }

]

# -------------------------
# Routes
# --------------------------
@app.route('/')
def home():
    return render_template('index.html', plants=plants)

@app.route('/login-page')
def login_page():
    return backend.show_login_page()

@app.route('/mental')
def mental():
    return render_template('mental.html')

@app.route('/oral')
def oral():
    return render_template('oral.html')

@app.route('/skin')
def skin():
    return render_template('skin.html')

@app.route('/login', methods=['POST'])
def login():
    return backend.handle_login(request)
    

@app.route('/api/search')
def search_plants():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    results = [
        {
            "name": p["name"],
            "info": p.get("info", ""),
            "advantages": p.get("advantages", ""),
            "disadvantages": p.get("disadvantages", ""),
            "uses": p.get("uses", ""),
            "benefits": p.get("benefits", ""),
            "model": p.get("model", ""),
            "image": p.get("image", "")
        }
        for p in plants 
        if query in p["name"].lower() or 
           query in p.get("info", "").lower() or
           query in p.get("uses", "").lower() or
           query in p.get("benefits", "").lower()
    ]
    return jsonify(results)

# -------------------------
# Run Flask app
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)
