import sqlite3
import os
import hashlib

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    print("Initializing Database...")
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        username TEXT NOT NULL,
        phone TEXT,
        profile_pic_url TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        provider TEXT NOT NULL DEFAULT 'email',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Create Predictions Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        crop TEXT NOT NULL,
        disease TEXT NOT NULL,
        confidence REAL NOT NULL,
        severity TEXT NOT NULL,
        image_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
    )
    ''')

    # Create Disease Information Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS DiseaseInformation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop TEXT NOT NULL,
        disease TEXT NOT NULL,
        description TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        causes TEXT NOT NULL,
        organic_treatment TEXT NOT NULL,
        chemical_treatment TEXT NOT NULL,
        fertilizer TEXT NOT NULL,
        pesticide TEXT NOT NULL,
        water_advice TEXT NOT NULL,
        climate_advice TEXT NOT NULL,
        prevention TEXT NOT NULL,
        recovery_time TEXT NOT NULL
    )
    ''')

    # Create Reports Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prediction_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        project_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (prediction_id) REFERENCES Predictions(id) ON DELETE CASCADE
    )
    ''')

    # Create Admin Table (Internal settings/logs)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS AdminLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Seed Default Disease Information
    cursor.execute('DELETE FROM DiseaseInformation')
    
    disease_data = [
        # 1. Tomato Diseased
        (
            "Tomato", "Tomato Leaf Blight (Diseased)",
            "A common fungal infection affecting tomatoes, leading to foliage degradation and reduced crop yield.",
            "Dark brown or black spots with concentric rings appearing on older leaves, yellowing of leaves, and defoliation.",
            "Caused by Alternaria solani fungus, which thrives in humid conditions and wet foliage.",
            "Apply copper-based fungicides, prune lower leaves to improve airflow, and use compost tea spray.",
            "Apply Chlorothalonil or Mancozeb fungicides according to instructions.",
            "Use balanced organic fertilizer (5-10-10) with added calcium to prevent blossom end rot.",
            "Copper fungicide spray or Neem Oil.",
            "Water early in the morning and apply water directly to the root zone; avoid overhead irrigation.",
            "Optimal temperature is 24°C to 29°C. Fungal growth accelerates in relative humidity above 85%.",
            "Plant resistant crop varieties, rotate crops every 3 years, and sterilize tools after use.",
            "2 - 3 weeks under proper treatment."
        ),
        # 2. Tomato Healthy
        (
            "Tomato", "Healthy",
            "The tomato crop is healthy and showing optimal growth with vibrant green foliage and strong stems.",
            "No visible lesions, spots, or discoloration. Leaves are bright green, firm, and normal in size.",
            "N/A", "N/A", "N/A",
            "Apply nitrogen-rich fertilizer during early vegetative phase and potassium-rich fertilizer during fruiting.",
            "No pesticide required. Monitor for pests regularly.",
            "Maintain consistent soil moisture (approx. 2.5 cm of water per week).",
            "Thrives in sunny conditions (6-8 hours of sunlight) and temperatures between 21°C and 29°C.",
            "Ensure good spacing between plants, mulch to retain soil moisture, and check for pests weekly.",
            "N/A"
        ),
        # 3. Potato Diseased
        (
            "Potato", "Potato Late Blight (Diseased)",
            "A devastating fungal-like disease that causes rapid rotting of leaves, stems, and tubers.",
            "Dark, water-soaked spots on leaves that turn brown-black, with a white moldy growth on the underside of leaves in humid weather.",
            "Caused by the oomycete Phytophthora infestans. Spreads rapidly via wind-blown spores in wet conditions.",
            "Apply compost tea, use disease-free seed tubers, and harvest in dry conditions.",
            "Apply preventive fungicides containing Mancozeb, Chlorothalonil, or Metalaxyl.",
            "Use organic fertilizer with rich potassium content to strengthen cell walls.",
            "Fungicidal spray containing copper sulphate or copper octanoate.",
            "Avoid overhead watering. Ensure excellent soil drainage to prevent spore activation in tubers.",
            "Thrives in cool, wet environments (15°C to 20°C with high humidity).",
            "Plant certified disease-free tubers, destroy infected volunteer potatoes, and space rows properly.",
            "3 - 4 weeks; requires strict isolation of infected areas."
        ),
        # 4. Potato Healthy
        (
            "Potato", "Healthy",
            "The potato crop is in a highly healthy state with strong upright stems and lush green leaves.",
            "Stems are firm and green. Leaves show no browning, spots, or wilting. Healthy underground tuber development.",
            "N/A", "N/A", "N/A",
            "Provide balanced organic fertilizer; avoid excessive nitrogen as it reduces tuber yield.",
            "None needed. Monitor for potato beetles.",
            "Provide regular watering, ensuring soil remains damp but not waterlogged.",
            "Thrives in cool climates (15°C to 21°C) with full sun exposure.",
            "Hill up soil around stems as they grow to protect developing tubers from sun exposure.",
            "N/A"
        ),
        # 5. Rice Diseased
        (
            "Rice", "Rice Blast (Diseased)",
            "One of the most destructive diseases of rice, affecting leaves, nodes, and panicles, leading to major crop losses.",
            "Spindle-shaped (diamond-shaped) lesions on leaves with reddish-brown borders and gray centers.",
            "Caused by the fungus Magnaporthe oryzae. Thrives in high nitrogen soils and high humidity.",
            "Use silicon-based soil amendments, burn crop residues, and use resistant varieties.",
            "Apply systemic fungicides such as Tricyclazole, Azoxystrobin, or Isoprothiolane.",
            "Reduce nitrogenous fertilizer application; apply silicon fertilizers to strengthen cell structure.",
            "Apply Tricyclazole or Benomyl sprays if blast symptoms appear on leaves.",
            "Maintain proper water levels in paddies; drain fields briefly if blast incidence is high.",
            "Optimal temperature is 25°C to 28°C with prolonged leaf wetness (more than 10 hours).",
            "Avoid excessive nitrogen fertilization, sow seeds early, and maintain correct plant spacing.",
            "3 - 4 weeks."
        ),
        # 6. Rice Healthy
        (
            "Rice", "Healthy",
            "The rice crop is showing optimal vegetative growth, uniform green color, and healthy root systems.",
            "Leaves are upright and deep green. Stems (tillers) are firm. Stools are free of discoloration.",
            "N/A", "N/A", "N/A",
            "Apply nitrogen, phosphorus, and potassium (NPK) in split doses for optimal grain filling.",
            "None required. Monitor for stem borers and planthoppers.",
            "Keep water depth at 5-10 cm during vegetative phase; drain before harvesting.",
            "Warm and wet climate with temperature around 25°C to 35°C and abundant sunshine.",
            "Keep paddies clear of weeds, ensure uniform levelling of fields, and check water quality.",
            "N/A"
        ),
        # 7. Corn Diseased
        (
            "Corn", "Corn Common Rust (Diseased)",
            "A fungal disease that affects corn leaves, resulting in early leaf death and lower grain yields.",
            "Elongated, powdery, reddish-brown pustules on both upper and lower leaf surfaces.",
            "Caused by the fungus Puccinia sorghi. Spores are carried long distances by wind.",
            "Apply compost tea, use rust-resistant hybrids, and rotate crop fields.",
            "Apply foliar fungicides such as Pyraclostrobin, Azoxystrobin, or Propiconazole.",
            "Ensure balanced soil nutrition. Do not over-apply nitrogen.",
            "Fungicidal spray containing strobilurins or triazoles.",
            "Avoid overhead irrigation to keep corn leaves dry; use drip lines or furrow irrigation.",
            "Thrives in cool temperatures (16°C to 23°C) and high relative humidity (above 95%).",
            "Plant resistant corn hybrids, practice crop rotation, and manage weeds near fields.",
            "2 - 3 weeks."
        ),
        # 8. Corn Healthy
        (
            "Corn", "Healthy",
            "The maize crop is extremely healthy with robust thick stalks, deep green leaves, and developing ears.",
            "Stalks are strong, leaves are broad and dark green without spots or rust pustules. Tassels are clean.",
            "N/A", "N/A", "N/A",
            "High nitrogen fertilizer during vegetative growth, followed by phosphorus during cob development.",
            "None needed. Monitor for fall armyworms.",
            "Requires deep watering; approximately 2.5 - 5 cm of water per week, especially during pollination.",
            "Requires full sun, high temperatures (24°C to 32°C), and moderate rainfall.",
            "Ensure regular weeding, maintain soil organic matter, and check for root lodgings.",
            "N/A"
        ),
        # 9. Cotton Diseased
        (
            "Cotton", "Cotton Leaf Blight (Diseased)",
            "A bacterial or fungal infection that targets cotton leaves, causing premature defoliation and affecting lint quality.",
            "Water-soaked, angular lesions on leaves that turn brown or black; leaves may wither and drop.",
            "Caused by Xanthomonas citri (Bacterial Blight) or Alternaria macrospora (Fungal Blight).",
            "Use copper hydroxide sprays, practice crop rotation, and burn infected crop residues.",
            "Apply copper-based bactericides or systemic fungicides like Azoxystrobin.",
            "Apply balanced fertilizer containing potash to build resistance to blight infections.",
            "Copper oxychloride or Streptomycin sulphate (for bacterial cases).",
            "Avoid overhead sprinkler irrigation. Use drip or furrow irrigation.",
            "Thrives in warm, wet conditions (28°C to 36°C with frequent rain/dew).",
            "Sow acid-delinted, certified disease-free seeds. Clear fields of volunteer cotton plants.",
            "3 weeks."
        ),
        # 10. Cotton Healthy
        (
            "Cotton", "Healthy",
            "The cotton crop is healthy, showcasing strong branching, healthy green leaves, and developing bolls.",
            "Vibrant green leaves. No necrotic spots or water-soaked lesions. Stems are upright and bolls are clean.",
            "N/A", "N/A", "N/A",
            "Apply nitrogen and potassium fertilizer. Cotton has high potassium demands during boll growth.",
            "None needed. Monitor for bollworms and whiteflies.",
            "Water deeply but infrequently; cotton is drought-tolerant but needs consistent water during blooming.",
            "Thrives in hot, dry climates with temperatures between 26°C and 35°C and long sunny days.",
            "Ensure early weed control, implement pest monitoring, and prune excess vegetative growth.",
            "N/A"
        ),
        # 11. Apple Diseased
        (
            "Apple", "Apple Scab (Diseased)",
            "A severe fungal disease affecting apple trees, causing spots on leaves and scabs on fruit.",
            "Olive-green to black velvety spots on leaves, puckered leaves, and corky brown scabs on fruits.",
            "Caused by Venturia inaequalis. Overwinters on fallen leaves and shoots spores in spring rains.",
            "Rake and burn fallen leaves in autumn, apply lime sulfur in early spring.",
            "Spray chemical fungicides like Captan, Myclobutanil, or Fenbuconazole.",
            "Apply organic compost around root zone to feed soil microbes.",
            "Sulfur or copper fungicide sprays in spring.",
            "Water using ground drip lines to keep foliage dry. Avoid wetting the tree canopy.",
            "Thrives in cool, damp spring weather (12°C to 24°C with continuous wet leaves).",
            "Grow scab-resistant cultivars, prune trees to open the canopy for airflow, and clean up leaf litter.",
            "4 weeks; requires ongoing seasonal management."
        ),
        # 12. Apple Healthy
        (
            "Apple", "Healthy",
            "The apple tree is in a highly healthy state with strong shoot growth, bright green leaves, and developing fruit.",
            "Leaves are smooth and green with no blemishes or powdery residue. Clean bark and healthy fruit set.",
            "N/A", "N/A", "N/A",
            "Apply balanced fertilizer in early spring before growth begins.",
            "None needed. Monitor for codling moths.",
            "Provide regular deep irrigation, especially for young trees (about 2.5 cm per week).",
            "Cool to moderate temperate climate with winter chilling hours and warm, sunny summers.",
            "Prune annually in winter to remove dead wood, apply mulch around the base, and monitor fruit load.",
            "N/A"
        ),
        # 13. Pepper Diseased
        (
            "Pepper", "Bell Pepper Bacterial Spot (Diseased)",
            "A bacterial disease causing spot lesions on leaves and fruit, leading to leaf drop and sunscalded peppers.",
            "Small, circular, raised spots on leaf undersides that become purplish-gray with black centers.",
            "Caused by Xanthomonas campestris pv. vesicatoria. Spreads through water splash and infected seeds.",
            "Spray copper fungicides mixed with mancozeb, use clean seeds, and avoid touching wet plants.",
            "Apply copper-hydroxide bactericides during high-risk humid weather.",
            "Use slow-release organic fertilizer. Avoid excessive nitrogen which softens leaf tissue.",
            "Copper bactericide sprays.",
            "Drip irrigation is mandatory. Avoid water splash between leaves.",
            "Thrives in warm, rainy conditions (24°C to 35°C with high relative humidity).",
            "Rotate crops with non-solanaceous plants, plant certified disease-free seed, and sanitize stakes.",
            "2 - 3 weeks."
        ),
        # 14. Pepper Healthy
        (
            "Pepper", "Healthy",
            "The bell pepper plant is healthy and vigorous with deep green foliage, strong stems, and firm fruit.",
            "Leaves are shiny and dark green. Stems are sturdy. Peppers are glossy, firm, and free of blemishes.",
            "N/A", "N/A", "N/A",
            "Apply organic fertilizer high in phosphorus and calcium once flowering starts.",
            "None needed. Monitor for aphids.",
            "Water regularly to keep soil moist but not soggy. Avoid letting soil dry out completely.",
            "Warm climate with temperatures between 21°C and 30°C. Sensitive to cold.",
            "Mulch the soil surface, install support stakes early, and inspect leaf undersides for pests.",
            "N/A"
        ),
        # 15. Grape Diseased
        (
            "Grape", "Grape Black Rot (Diseased)",
            "A highly destructive fungal disease of grapes that can destroy entire crops if left untreated.",
            "Small, round, light-brown spots on leaves, followed by shriveling and blackening of grape berries into hard mummies.",
            "Caused by Guignardia bidwellii fungus. Overwinters in mummified berries and infected canes.",
            "Remove all mummified berries from vines and ground, prune vines to maximize sun exposure and wind drying.",
            "Apply fungicides such as Mancozeb, Myclobutanil, or Ziram from early bud break.",
            "Apply potassium-rich organic fertilizers to assist grape health.",
            "Myclobutanil or copper-based fungicide spray.",
            "Apply water at ground level. Avoid sprinkler systems that wet the vine canopy.",
            "Warm and wet weather. Spores germinate in 6 hours at 27°C on wet leaves.",
            "Strict sanitation: destroy mummies and infected canes, prune for ventilation, and control weeds.",
            "3 - 4 weeks; requires continuous vigilance until harvest."
        ),
        # 16. Grape Healthy
        (
            "Grape", "Healthy",
            "The grapevine is highly healthy, showcasing vibrant green leaf canopies and clean, developing grape clusters.",
            "Leaves are large and deep green. Canes are strong. Grape bunches are uniform and free of spots or mold.",
            "N/A", "N/A", "N/A",
            "Apply compost or well-rotted manure around the vine base in early spring.",
            "None needed. Monitor for Japanese beetles.",
            "Water deeply once a week during dry periods; grapes have deep roots and prefer dry surface soil.",
            "Thrives in warm, sunny climates with low humidity and good air circulation.",
            "Prune canopy regularly to allow light penetration, tie canes securely to trellises, and weed vine rows.",
            "N/A"
        ),
        # 17. Banana Diseased
        (
            "Banana", "Banana Black Sigatoka (Diseased)",
            "A major fungal leaf spot disease of bananas that reduces leaf area and leads to premature ripening of fruit.",
            "Dark, narrow streaks on leaves running parallel to veins, which expand into large brown spots with yellow halos.",
            "Caused by Mycosphaerella fijiensis. Spores are spread by wind, rain, and infected leaf trash.",
            "De-leaf infected parts regularly, improve soil drainage, and spray mineral oils.",
            "Apply systemic fungicides like Propiconazole, Tebuconazole, or Mancozeb.",
            "Apply high-potassium organic fertilizer to boost plant energy and leaf replacement rates.",
            "Foliar spray of mineral oil mixed with fungicides.",
            "Ensure excellent drainage. Standing water weakens root resistance to fungal spores.",
            "Warm, humid tropical climates with temperatures above 25°C and high rainfall.",
            "Keep plantation density low to improve wind drying, remove infected leaves, and clear weeds.",
            "4 - 6 weeks under intensive care."
        ),
        # 18. Banana Healthy
        (
            "Banana", "Healthy",
            "The banana plant is robust, displaying huge, broad green leaves and a strong pseudostem.",
            "Leaves are intact, green, and huge. No streaks or yellowing. Sturdy pseudostem holding healthy fruit bunches.",
            "N/A", "N/A", "N/A",
            "Bananas are heavy feeders. Apply NPK fertilizer high in potassium and nitrogen monthly.",
            "None needed. Monitor for banana weevils.",
            "Requires abundant watering (approx. 2.5 - 5 cm per week); keep soil consistently moist.",
            "Warm tropical climate (26°C to 30°C) with high humidity and shelter from strong winds.",
            "Remove dead leaves from pseudostem, mulch with organic matter, and manage suckers (keep 1 main + 1 follower).",
            "N/A"
        ),
        # 19. Mango Diseased
        (
            "Mango", "Mango Anthracnose (Diseased)",
            "A fungal disease that attacks leaves, flowers, and fruits of mangoes, causing dark spots and rot.",
            "Black, irregular spots on leaves, flower blight leading to blossom drop, and sunken black lesions on mango fruits.",
            "Caused by Colletotrichum gloeosporioides. The fungus survives on dead twigs and leaves.",
            "Prune trees to allow sun and air inside, prune out dead twigs, spray copper-based organic sprays.",
            "Apply preventive fungicides like Mancozeb, Azoxystrobin, or Copper Oxychloride.",
            "Apply compost and micronutrients (Zinc, Boron, Copper) to increase overall disease resistance.",
            "Copper hydroxide or chlorothalonil spray during flowering and fruit set.",
            "Water soil directly. Avoid wet foliage during flower and fruit development.",
            "Thrives in warm, highly humid environments (24°C to 30°C with frequent rain).",
            "Prune trees annually, destroy fallen leaves and twigs, and apply copper spray before flowering.",
            "3 - 4 weeks; requires constant management during fruiting."
        ),
        # 20. Mango Healthy
        (
            "Mango", "Healthy",
            "The mango tree is healthy, displaying dense dark green foliage and clean branches.",
            "Leaves are glossy, deep green or copper-red (new growth). No black spots. Stems and flowers are clean.",
            "N/A", "N/A", "N/A",
            "Apply balanced fertilizer in early spring. Apply potassium and micronutrients before flowering.",
            "None needed. Monitor for fruit flies.",
            "Water deeply but infrequently; reduce watering during winter/dry season to induce flowering.",
            "Thrives in hot, dry tropical or subtropical climates. Needs dry weather during flowering.",
            "Prune annually after harvest, keep area under canopy clear of weeds, and inspect branches for pests.",
            "N/A"
        ),
        # 21. Cherry Healthy
        (
            "Cherry", "Healthy",
            "The cherry tree is highly healthy, with bright green, clean leaves and sturdy twigs.",
            "Leaves are rich green and free of powder, spots, or yellowing.",
            "N/A", "N/A", "N/A",
            "Fruit tree fertilizer in spring.",
            "None.",
            "Water regularly, avoiding soaking the roots.",
            "Temperate climates with cold winters.",
            "Prune dead branches.",
            "N/A"
        ),
        # 22. Cherry Powdery Mildew
        (
            "Cherry", "Cherry Powdery Mildew (Diseased)",
            "A fungal disease causing white powdery patches on cherry leaves.",
            "White, powdery patches on leaves, leaf curling, and stunted growth.",
            "Caused by Podosphaera clandestina. Favorable in high humidity.",
            "Spray neem oil or baking soda solution.",
            "Apply sulfur fungicides or Myclobutanil.",
            "N/A",
            "Sulfur dust.",
            "Water ground level, do not wet leaves.",
            "Warm, dry days and cool, damp nights.",
            "Prune trees to increase sun exposure.",
            "3-4 weeks"
        ),
        # 23. Peach Healthy
        (
            "Peach", "Healthy",
            "The peach tree is healthy, with vibrant green lanceolate leaves and clean bark.",
            "Leaves are clean, long, and lanceolate. Bark is smooth.",
            "N/A", "N/A", "N/A",
            "NPK fertilizer in spring.",
            "None.",
            "Deep watering once a week.",
            "Warm summers.",
            "Regular pruning.",
            "N/A"
        ),
        # 24. Peach Bacterial Spot
        (
            "Peach", "Peach Bacterial Spot (Diseased)",
            "A bacterial disease causing shot-holes in peach leaves and fruit spots.",
            "Water-soaked spots turning purple-black, leading to shot-holes.",
            "Caused by Xanthomonas arboricola.",
            "Apply copper spray in late winter.",
            "Apply Oxytetracycline sprays.",
            "N/A",
            "Bactericide sprays.",
            "Drip irrigation to keep leaves dry.",
            "Warm, wet spring weather.",
            "Select disease-resistant cultivars.",
            "4-5 weeks"
        ),
        # 25. Strawberry Healthy
        (
            "Strawberry", "Healthy",
            "The strawberry plant is healthy, with green trifoliate leaves and runners.",
            "Leaves are clean green. Flowers and runners are clean.",
            "N/A", "N/A", "N/A",
            "Organic berry fertilizer.",
            "None.",
            "Consistent soil moisture.",
            "Temperate.",
            "Weed control.",
            "N/A"
        ),
        # 26. Strawberry Leaf Scorch
        (
            "Strawberry", "Strawberry Leaf Scorch (Diseased)",
            "A fungal disease causing purplish blotches on strawberry leaves.",
            "Dark purple spots that coalesce, making leaves look scorched.",
            "Caused by Diplocarpon earlianum.",
            "Remove old leaves and clean mulch.",
            "Apply Captan or copper fungicides.",
            "N/A",
            "Fungicides.",
            "Water at the plant base.",
            "Warm, wet weather.",
            "Space plants to increase airflow.",
            "3-4 weeks"
        ),
        # 27. Soybean Healthy
        (
            "Soybean", "Healthy",
            "The soybean plant is healthy, displaying bright green trifoliate foliage.",
            "Uniform green leaves, strong stems, healthy pods.",
            "N/A", "N/A", "N/A",
            "Phosphate-rich fertilizer.",
            "None.",
            "Water regularly during pod filling.",
            "Warm, temperate.",
            "Crop rotation.",
            "N/A"
        ),
        # 28. Raspberry Healthy
        (
            "Raspberry", "Healthy",
            "The raspberry cane is healthy, with deep green textured leaves.",
            "Leaves are green and textured. Canes are upright.",
            "N/A", "N/A", "N/A",
            "Berry compost.",
            "None.",
            "Keep soil moist but not soggy.",
            "Cool, temperate.",
            "Treillage cane support.",
            "N/A"
        )
    ]

    cursor.execute("DELETE FROM DiseaseInformation")
    cursor.executemany('''
    INSERT INTO DiseaseInformation (
        crop, disease, description, symptoms, causes, organic_treatment, 
        chemical_treatment, fertilizer, pesticide, water_advice, climate_advice, 
        prevention, recovery_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', disease_data)

    # Seed Default Admin (admin@cropdiag.ai / admin123)
    cursor.execute("SELECT * FROM Users WHERE email='admin@cropdiag.ai'")
    if not cursor.fetchone():
        hashed_password = hashlib.sha256('admin123'.encode('utf-8')).hexdigest()
        cursor.execute('''
        INSERT INTO Users (email, password_hash, username, phone, role, provider)
        VALUES ('admin@cropdiag.ai', ?, 'Admin System', '+15550199', 'admin', 'email')
        ''', (hashed_password,))

    conn.commit()
    conn.close()
    print("Database Initialized Successfully!")

if __name__ == '__main__':
    init_db()
