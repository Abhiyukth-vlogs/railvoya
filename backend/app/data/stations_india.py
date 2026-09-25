"""Comprehensive database of major Indian Railway stations across all zones and states."""

from typing import List, Dict

ALL_INDIA_STATIONS: List[Dict] = [
    # --- National Capital Region (Delhi) ---
    {"code": "NDLS", "name": "New Delhi", "city": "New Delhi", "state": "Delhi", "hindi_name": "नई दिल्ली", "is_major_junction": True},
    {"code": "DLI", "name": "Old Delhi Junction", "city": "Delhi", "state": "Delhi", "hindi_name": "पुरानी दिल्ली", "is_major_junction": True},
    {"code": "NZM", "name": "Hazrat Nizamuddin", "city": "New Delhi", "state": "Delhi", "hindi_name": "हज़रत निज़ामुद्दीन", "is_major_junction": True},
    {"code": "ANVT", "name": "Anand Vihar Terminal", "city": "New Delhi", "state": "Delhi", "hindi_name": "आनंद विहार टर्मिनल", "is_major_junction": True},
    {"code": "DEC", "name": "Delhi Cantt", "city": "Delhi", "state": "Delhi", "hindi_name": "दिल्ली कैंट", "is_major_junction": False},
    {"code": "DEE", "name": "Delhi Sarai Rohilla", "city": "Delhi", "state": "Delhi", "hindi_name": "दिल्ली सराय रोहिल्ला", "is_major_junction": False},
    {"code": "GZB", "name": "Ghaziabad Junction", "city": "Ghaziabad", "state": "Uttar Pradesh", "hindi_name": "गाज़ियाबाद", "is_major_junction": True},
    {"code": "GGN", "name": "Gurgaon", "city": "Gurugram", "state": "Haryana", "hindi_name": "गुडगाँव", "is_major_junction": False},
    {"code": "FDB", "name": "Faridabad", "city": "Faridabad", "state": "Haryana", "hindi_name": "फरीदाबाद", "is_major_junction": False},

    # --- Maharashtra ---
    {"code": "CSMT", "name": "Chhatrapati Shivaji Maharaj Terminus", "city": "Mumbai", "state": "Maharashtra", "hindi_name": "छ.शि.म.ट.", "is_major_junction": True},
    {"code": "MMCT", "name": "Mumbai Central", "city": "Mumbai", "state": "Maharashtra", "hindi_name": "मुंबई सेंट्रल", "is_major_junction": True},
    {"code": "BDTS", "name": "Bandra Terminus", "city": "Mumbai", "state": "Maharashtra", "hindi_name": "बांद्रा टर्मिनस", "is_major_junction": True},
    {"code": "DR", "name": "Dadar Central", "city": "Mumbai", "state": "Maharashtra", "hindi_name": "दादर", "is_major_junction": True},
    {"code": "LTT", "name": "Lokmanya Tilak Terminus", "city": "Mumbai", "state": "Maharashtra", "hindi_name": "लोकमान्य तिलक टर्मिनस", "is_major_junction": True},
    {"code": "KYN", "name": "Kalyan Junction", "city": "Kalyan", "state": "Maharashtra", "hindi_name": "कल्याण जंक्शन", "is_major_junction": True},
    {"code": "TNA", "name": "Thane", "city": "Thane", "state": "Maharashtra", "hindi_name": "ठाणे", "is_major_junction": True},
    {"code": "PNVL", "name": "Panvel Junction", "city": "Navi Mumbai", "state": "Maharashtra", "hindi_name": "पनवेल", "is_major_junction": True},
    {"code": "PUNE", "name": "Pune Junction", "city": "Pune", "state": "Maharashtra", "hindi_name": "पुणे जंक्शन", "is_major_junction": True},
    {"code": "NGP", "name": "Nagpur Junction", "city": "Nagpur", "state": "Maharashtra", "hindi_name": "नागपुर जंक्शन", "is_major_junction": True},
    {"code": "BSL", "name": "Bhusaval Junction", "city": "Bhusawal", "state": "Maharashtra", "hindi_name": "भुसावल जंक्शन", "is_major_junction": True},
    {"code": "NK", "name": "Nasik Road", "city": "Nashik", "state": "Maharashtra", "hindi_name": "नासिक रोड", "is_major_junction": True},
    {"code": "MMR", "name": "Manmad Junction", "city": "Manmad", "state": "Maharashtra", "hindi_name": "मनमाड जंक्शन", "is_major_junction": True},
    {"code": "SUR", "name": "Solapur", "city": "Solapur", "state": "Maharashtra", "hindi_name": "सोलापुर", "is_major_junction": True},
    {"code": "KOP", "name": "Kolhapur CSMT", "city": "Kolhapur", "state": "Maharashtra", "hindi_name": "कोल्हापुर", "is_major_junction": False},
    {"code": "SNSI", "name": "Sainagar Shirdi", "city": "Shirdi", "state": "Maharashtra", "hindi_name": "साईंनगर शिर्डी", "is_major_junction": False},
    {"code": "NND", "name": "Hazur Sahib Nanded", "city": "Nanded", "state": "Maharashtra", "hindi_name": "नांदेड", "is_major_junction": True},
    {"code": "AK", "name": "Akola Junction", "city": "Akola", "state": "Maharashtra", "hindi_name": "अकोला", "is_major_junction": True},
    {"code": "BD", "name": "Badnera (Amravati)", "city": "Amravati", "state": "Maharashtra", "hindi_name": "बडनेरा", "is_major_junction": True},
    {"code": "WR", "name": "Wardha Junction", "city": "Wardha", "state": "Maharashtra", "hindi_name": "वर्धा", "is_major_junction": True},

    # --- West Bengal ---
    {"code": "HWH", "name": "Howrah Junction", "city": "Kolkata", "state": "West Bengal", "hindi_name": "हावड़ा जंक्शन", "is_major_junction": True},
    {"code": "SDAH", "name": "Sealdah", "city": "Kolkata", "state": "West Bengal", "hindi_name": "सियालदह", "is_major_junction": True},
    {"code": "KOAA", "name": "Kolkata Terminal", "city": "Kolkata", "state": "West Bengal", "hindi_name": "कोलकाता", "is_major_junction": True},
    {"code": "SHM", "name": "Shalimar", "city": "Kolkata", "state": "West Bengal", "hindi_name": "शालीमार", "is_major_junction": True},
    {"code": "ASN", "name": "Asansol Junction", "city": "Asansol", "state": "West Bengal", "hindi_name": "आसनसोल", "is_major_junction": True},
    {"code": "DGR", "name": "Durgapur", "city": "Durgapur", "state": "West Bengal", "hindi_name": "दुर्गापुर", "is_major_junction": False},
    {"code": "KGP", "name": "Kharagpur Junction", "city": "Kharagpur", "state": "West Bengal", "hindi_name": "खड़गपुर जंक्शन", "is_major_junction": True},
    {"code": "NJP", "name": "New Jalpaiguri", "city": "Siliguri", "state": "West Bengal", "hindi_name": "न्यू जलपाईगुड़ी", "is_major_junction": True},
    {"code": "SGUJ", "name": "Siliguri Junction", "city": "Siliguri", "state": "West Bengal", "hindi_name": "सिलीगुड़ी जंक्शन", "is_major_junction": True},
    {"code": "MLDT", "name": "Malda Town", "city": "Malda", "state": "West Bengal", "hindi_name": "मालदा टाउन", "is_major_junction": True},
    {"code": "BWN", "name": "Barddhaman Junction", "city": "Bardhaman", "state": "West Bengal", "hindi_name": "बर्द्धमान", "is_major_junction": True},
    {"code": "RPH", "name": "Rampurhat Junction", "city": "Rampurhat", "state": "West Bengal", "hindi_name": "रामपुरहाट", "is_major_junction": True},

    # --- Tamil Nadu ---
    {"code": "MAS", "name": "MGR Chennai Central", "city": "Chennai", "state": "Tamil Nadu", "hindi_name": "एम.जी.आर. चेन्नई सेंट्रल", "is_major_junction": True},
    {"code": "MS", "name": "Chennai Egmore", "city": "Chennai", "state": "Tamil Nadu", "hindi_name": "चेन्नई एग्मोर", "is_major_junction": True},
    {"code": "TBM", "name": "Tambaram", "city": "Chennai", "state": "Tamil Nadu", "hindi_name": "ताम्बरम", "is_major_junction": True},
    {"code": "CBE", "name": "Coimbatore Junction", "city": "Coimbatore", "state": "Tamil Nadu", "hindi_name": "कोयंबटूर जंक्शन", "is_major_junction": True},
    {"code": "MDU", "name": "Madurai Junction", "city": "Madurai", "state": "Tamil Nadu", "hindi_name": "मदुरै जंक्शन", "is_major_junction": True},
    {"code": "TPJ", "name": "Tiruchchirappalli Junction", "city": "Tiruchirappalli", "state": "Tamil Nadu", "hindi_name": "तिरुचिरापल्ली", "is_major_junction": True},
    {"code": "SA", "name": "Salem Junction", "city": "Salem", "state": "Tamil Nadu", "hindi_name": "सेलम जंक्शन", "is_major_junction": True},
    {"code": "ED", "name": "Erode Junction", "city": "Erode", "state": "Tamil Nadu", "hindi_name": "इरोड जंक्शन", "is_major_junction": True},
    {"code": "TEN", "name": "Tirunelveli Junction", "city": "Tirunelveli", "state": "Tamil Nadu", "hindi_name": "तिरुनेलवेली", "is_major_junction": True},
    {"code": "NCJ", "name": "Nagercoil Junction", "city": "Nagercoil", "state": "Tamil Nadu", "hindi_name": "नागरकोइल", "is_major_junction": True},
    {"code": "RMM", "name": "Rameswaram", "city": "Rameswaram", "state": "Tamil Nadu", "hindi_name": "रामेश्वरम", "is_major_junction": False},
    {"code": "KPD", "name": "Katpadi Junction", "city": "Vellore", "state": "Tamil Nadu", "hindi_name": "काटपाडी", "is_major_junction": True},
    {"code": "DG", "name": "Dindigul Junction", "city": "Dindigul", "state": "Tamil Nadu", "hindi_name": "डिंडीगुल", "is_major_junction": True},

    # --- Karnataka ---
    {"code": "SBC", "name": "KSR Bengaluru City", "city": "Bengaluru", "state": "Karnataka", "hindi_name": "के.एस.आर. बेंगलुरु", "is_major_junction": True},
    {"code": "YPR", "name": "Yesvantpur Junction", "city": "Bengaluru", "state": "Karnataka", "hindi_name": "यशवंतपुर जंक्शन", "is_major_junction": True},
    {"code": "SMVB", "name": "Sir M. Visvesvaraya Terminal", "city": "Bengaluru", "state": "Karnataka", "hindi_name": "एस.एम.वी.टी. बेंगलुरु", "is_major_junction": True},
    {"code": "MYS", "name": "Mysuru Junction", "city": "Mysuru", "state": "Karnataka", "hindi_name": "मैसूरु जंक्शन", "is_major_junction": True},
    {"code": "UBL", "name": "SSS Hubballi Junction", "city": "Hubballi", "state": "Karnataka", "hindi_name": "हुबली जंक्शन", "is_major_junction": True},
    {"code": "BGM", "name": "Belagavi", "city": "Belgaum", "state": "Karnataka", "hindi_name": "बेलगावी", "is_major_junction": True},
    {"code": "MAQ", "name": "Mangaluru Central", "city": "Mangaluru", "state": "Karnataka", "hindi_name": "मंगलुरु सेंट्रल", "is_major_junction": True},
    {"code": "MAJN", "name": "Mangaluru Junction", "city": "Mangaluru", "state": "Karnataka", "hindi_name": "मंगलुरु जंक्शन", "is_major_junction": True},
    {"code": "DVG", "name": "Davangere", "city": "Davangere", "state": "Karnataka", "hindi_name": "दावणगेरे", "is_major_junction": False},
    {"code": "BAY", "name": "Ballari Junction", "city": "Bellary", "state": "Karnataka", "hindi_name": "बल्लारी जंक्शन", "is_major_junction": True},
    {"code": "HPT", "name": "Hosapete (Hampi)", "city": "Hospet", "state": "Karnataka", "hindi_name": "होसपेटे", "is_major_junction": False},
    {"code": "KLBG", "name": "Kalaburagi (Gulbarga)", "city": "Gulbarga", "state": "Karnataka", "hindi_name": "कलबुरगी", "is_major_junction": True},

    # --- Telangana & Andhra Pradesh ---
    {"code": "SC", "name": "Secunderabad Junction", "city": "Secunderabad", "state": "Telangana", "hindi_name": "सिकंदराबाद जंक्शन", "is_major_junction": True},
    {"code": "HYB", "name": "Hyderabad Deccan", "city": "Hyderabad", "state": "Telangana", "hindi_name": "हैदराबाद डेक्कन", "is_major_junction": True},
    {"code": "KCG", "name": "Kacheguda", "city": "Hyderabad", "state": "Telangana", "hindi_name": "काचेगुडा", "is_major_junction": True},
    {"code": "KZJ", "name": "Kazipet Junction", "city": "Warangal", "state": "Telangana", "hindi_name": "काजीपेट", "is_major_junction": True},
    {"code": "WL", "name": "Warangal", "city": "Warangal", "state": "Telangana", "hindi_name": "वारंगल", "is_major_junction": False},
    {"code": "VSKP", "name": "Visakhapatnam", "city": "Visakhapatnam", "state": "Andhra Pradesh", "hindi_name": "विशाखापट्टनम", "is_major_junction": True},
    {"code": "BZA", "name": "Vijayawada Junction", "city": "Vijayawada", "state": "Andhra Pradesh", "hindi_name": "विजयवाड़ा जंक्शन", "is_major_junction": True},
    {"code": "TPTY", "name": "Tirupati", "city": "Tirupati", "state": "Andhra Pradesh", "hindi_name": "तिरुपति", "is_major_junction": True},
    {"code": "RU", "name": "Renigunta Junction", "city": "Tirupati", "state": "Andhra Pradesh", "hindi_name": "रेनिगुंटा", "is_major_junction": True},
    {"code": "GNT", "name": "Guntur Junction", "city": "Guntur", "state": "Andhra Pradesh", "hindi_name": "गुंटूर", "is_major_junction": True},
    {"code": "RJY", "name": "Rajahmundry", "city": "Rajahmundry", "state": "Andhra Pradesh", "hindi_name": "राजमुंदरी", "is_major_junction": False},
    {"code": "GTL", "name": "Guntakal Junction", "city": "Guntakal", "state": "Andhra Pradesh", "hindi_name": "गुंतकल", "is_major_junction": True},

    # --- Gujarat ---
    {"code": "ADI", "name": "Ahmedabad Junction", "city": "Ahmedabad", "state": "Gujarat", "hindi_name": "अहमदाबाद जंक्शन", "is_major_junction": True},
    {"code": "BRC", "name": "Vadodara Junction", "city": "Vadodara", "state": "Gujarat", "hindi_name": "वडोदरा जंक्शन", "is_major_junction": True},
    {"code": "ST", "name": "Surat", "city": "Surat", "state": "Gujarat", "hindi_name": "सूरत", "is_major_junction": True},
    {"code": "RJT", "name": "Rajkot Junction", "city": "Rajkot", "state": "Gujarat", "hindi_name": "राजकोट", "is_major_junction": True},
    {"code": "GIMB", "name": "Gandhidham Junction", "city": "Gandhidham", "state": "Gujarat", "hindi_name": "गांधीधाम", "is_major_junction": True},
    {"code": "BH", "name": "Bharuch Junction", "city": "Bharuch", "state": "Gujarat", "hindi_name": "भरूच", "is_major_junction": True},
    {"code": "ANND", "name": "Anand Junction", "city": "Anand", "state": "Gujarat", "hindi_name": "आनंद", "is_major_junction": True},
    {"code": "VAPI", "name": "Vapi", "city": "Vapi", "state": "Gujarat", "hindi_name": "वापी", "is_major_junction": False},
    {"code": "JAM", "name": "Jamnagar", "city": "Jamnagar", "state": "Gujarat", "hindi_name": "जामनगर", "is_major_junction": False},
    {"code": "DWK", "name": "Dwarka", "city": "Dwarka", "state": "Gujarat", "hindi_name": "द्वारका", "is_major_junction": False},
    {"code": "BVC", "name": "Bhavnagar Terminus", "city": "Bhavnagar", "state": "Gujarat", "hindi_name": "भावनगर", "is_major_junction": True},

    # --- Rajasthan ---
    {"code": "JP", "name": "Jaipur Junction", "city": "Jaipur", "state": "Rajasthan", "hindi_name": "जयपुर जंक्शन", "is_major_junction": True},
    {"code": "JU", "name": "Jodhpur Junction", "city": "Jodhpur", "state": "Rajasthan", "hindi_name": "जोधपुर", "is_major_junction": True},
    {"code": "UDZ", "name": "Udaipur City", "city": "Udaipur", "state": "Rajasthan", "hindi_name": "उदयपुर सिटी", "is_major_junction": True},
    {"code": "AII", "name": "Ajmer Junction", "city": "Ajmer", "state": "Rajasthan", "hindi_name": "अजमेर जंक्शन", "is_major_junction": True},
    {"code": "KOTA", "name": "Kota Junction", "city": "Kota", "state": "Rajasthan", "hindi_name": "कोटा जंक्शन", "is_major_junction": True},
    {"code": "BKN", "name": "Bikaner Junction", "city": "Bikaner", "state": "Rajasthan", "hindi_name": "बीकानेर", "is_major_junction": True},
    {"code": "SWM", "name": "Sawai Madhopur", "city": "Sawai Madhopur", "state": "Rajasthan", "hindi_name": "सवाई माधोपुर", "is_major_junction": True},
    {"code": "BHL", "name": "Bhilwara", "city": "Bhilwara", "state": "Rajasthan", "hindi_name": "भीलवाड़ा", "is_major_junction": False},
    {"code": "ABR", "name": "Abu Road", "city": "Mount Abu", "state": "Rajasthan", "hindi_name": "आबू रोड", "is_major_junction": False},
    {"code": "BTE", "name": "Bharatpur Junction", "city": "Bharatpur", "state": "Rajasthan", "hindi_name": "भरतपुर", "is_major_junction": True},

    # --- Uttar Pradesh ---
    {"code": "LKO", "name": "Lucknow Charbagh", "city": "Lucknow", "state": "Uttar Pradesh", "hindi_name": "लखनऊ चारबाग", "is_major_junction": True},
    {"code": "LJN", "name": "Lucknow Junction NER", "city": "Lucknow", "state": "Uttar Pradesh", "hindi_name": "लखनऊ जंक्शन", "is_major_junction": True},
    {"code": "CNB", "name": "Kanpur Central", "city": "Kanpur", "state": "Uttar Pradesh", "hindi_name": "कानपुर सेंट्रल", "is_major_junction": True},
    {"code": "BSB", "name": "Varanasi Junction", "city": "Varanasi", "state": "Uttar Pradesh", "hindi_name": "वाराणसी जंक्शन", "is_major_junction": True},
    {"code": "BSBS", "name": "Banaras", "city": "Varanasi", "state": "Uttar Pradesh", "hindi_name": "बनारस", "is_major_junction": False},
    {"code": "DDU", "name": "Pt. Deen Dayal Upadhyaya Junction", "city": "Mughalsarai", "state": "Uttar Pradesh", "hindi_name": "पं. दीन दयाल उपाध्याय जंक्शन", "is_major_junction": True},
    {"code": "PRYJ", "name": "Prayagraj Junction", "city": "Prayagraj", "state": "Uttar Pradesh", "hindi_name": "प्रयागराज जंक्शन", "is_major_junction": True},
    {"code": "AGC", "name": "Agra Cantt", "city": "Agra", "state": "Uttar Pradesh", "hindi_name": "आगरा कैंट", "is_major_junction": True},
    {"code": "AF", "name": "Agra Fort", "city": "Agra", "state": "Uttar Pradesh", "hindi_name": "आगरा फोर्ट", "is_major_junction": True},
    {"code": "MTJ", "name": "Mathura Junction", "city": "Mathura", "state": "Uttar Pradesh", "hindi_name": "मथुरा जंक्शन", "is_major_junction": True},
    {"code": "GKP", "name": "Gorakhpur Junction", "city": "Gorakhpur", "state": "Uttar Pradesh", "hindi_name": "गोरखपुर", "is_major_junction": True},
    {"code": "AY", "name": "Ayodhya Dham Junction", "city": "Ayodhya", "state": "Uttar Pradesh", "hindi_name": "अयोध्या धाम", "is_major_junction": True},
    {"code": "AYC", "name": "Ayodhya Cantt", "city": "Ayodhya", "state": "Uttar Pradesh", "hindi_name": "अयोध्या कैंट", "is_major_junction": True},
    {"code": "VGLJ", "name": "Virangana Lakshmibai Jhansi", "city": "Jhansi", "state": "Uttar Pradesh", "hindi_name": "झांसी जंक्शन", "is_major_junction": True},
    {"code": "MB", "name": "Moradabad Junction", "city": "Moradabad", "state": "Uttar Pradesh", "hindi_name": "मुरादाबाद", "is_major_junction": True},
    {"code": "BE", "name": "Bareilly Junction", "city": "Bareilly", "state": "Uttar Pradesh", "hindi_name": "बरेली", "is_major_junction": True},
    {"code": "ALJN", "name": "Aligarh Junction", "city": "Aligarh", "state": "Uttar Pradesh", "hindi_name": "अलीगढ़", "is_major_junction": True},

    # --- Bihar ---
    {"code": "PNBE", "name": "Patna Junction", "city": "Patna", "state": "Bihar", "hindi_name": "पटना जंक्शन", "is_major_junction": True},
    {"code": "PPTA", "name": "Patliputra Junction", "city": "Patna", "state": "Bihar", "hindi_name": "पाटलिपुत्र", "is_major_junction": True},
    {"code": "DNR", "name": "Danapur", "city": "Patna", "state": "Bihar", "hindi_name": "दानापुर", "is_major_junction": True},
    {"code": "GAYA", "name": "Gaya Junction", "city": "Gaya", "state": "Bihar", "hindi_name": "गया जंक्शन", "is_major_junction": True},
    {"code": "MFP", "name": "Muzaffarpur Junction", "city": "Muzaffarpur", "state": "Bihar", "hindi_name": "मुजफ्फरपुर", "is_major_junction": True},
    {"code": "DBG", "name": "Darbhanga Junction", "city": "Darbhanga", "state": "Bihar", "hindi_name": "दरभंगा", "is_major_junction": True},
    {"code": "BJU", "name": "Barauni Junction", "city": "Barauni", "state": "Bihar", "hindi_name": "बरौनी", "is_major_junction": True},
    {"code": "KIR", "name": "Katihar Junction", "city": "Katihar", "state": "Bihar", "hindi_name": "कटिहार", "is_major_junction": True},
    {"code": "ARA", "name": "Ara Junction", "city": "Arrah", "state": "Bihar", "hindi_name": "आरा जंक्शन", "is_major_junction": True},
    {"code": "BXR", "name": "Buxar", "city": "Buxar", "state": "Bihar", "hindi_name": "बक्सर", "is_major_junction": False},
    {"code": "SHC", "name": "Saharsa Junction", "city": "Saharsa", "state": "Bihar", "hindi_name": "सहरसा", "is_major_junction": True},

    # --- Kerala ---
    {"code": "TVC", "name": "Thiruvananthapuram Central", "city": "Thiruvananthapuram", "state": "Kerala", "hindi_name": "तिरुवनंतपुरम सेंट्रल", "is_major_junction": True},
    {"code": "ERS", "name": "Ernakulam Junction (South)", "city": "Kochi", "state": "Kerala", "hindi_name": "एरनाकुलम जंक्शन", "is_major_junction": True},
    {"code": "ERN", "name": "Ernakulam Town (North)", "city": "Kochi", "state": "Kerala", "hindi_name": "एरनाकुलम टाउन", "is_major_junction": False},
    {"code": "CLT", "name": "Kozhikode", "city": "Calicut", "state": "Kerala", "hindi_name": "कोझिकोड", "is_major_junction": True},
    {"code": "CAN", "name": "Kannur", "city": "Kannur", "state": "Kerala", "hindi_name": "कन्नूर", "is_major_junction": True},
    {"code": "ALLP", "name": "Alappuzha (Alleppey)", "city": "Alappuzha", "state": "Kerala", "hindi_name": "अलप्पुझा", "is_major_junction": False},
    {"code": "QLN", "name": "Kollam Junction", "city": "Kollam", "state": "Kerala", "hindi_name": "कोल्लम", "is_major_junction": True},
    {"code": "TCR", "name": "Thrissur", "city": "Thrissur", "state": "Kerala", "hindi_name": "त्रिशूर", "is_major_junction": True},
    {"code": "PGT", "name": "Palakkad Junction", "city": "Palakkad", "state": "Kerala", "hindi_name": "पालक्काड", "is_major_junction": True},
    {"code": "KTYM", "name": "Kottayam", "city": "Kottayam", "state": "Kerala", "hindi_name": "कोट्टायम", "is_major_junction": False},

    # --- Punjab & Haryana ---
    {"code": "ASR", "name": "Amritsar Junction", "city": "Amritsar", "state": "Punjab", "hindi_name": "अमृतसर जंक्शन", "is_major_junction": True},
    {"code": "LDH", "name": "Ludhiana Junction", "city": "Ludhiana", "state": "Punjab", "hindi_name": "लुधियाना", "is_major_junction": True},
    {"code": "JUC", "name": "Jalandhar City", "city": "Jalandhar", "state": "Punjab", "hindi_name": "जालंधर सिटी", "is_major_junction": True},
    {"code": "CDG", "name": "Chandigarh Junction", "city": "Chandigarh", "state": "Chandigarh", "hindi_name": "चंडीगढ़ जंक्शन", "is_major_junction": True},
    {"code": "UMB", "name": "Ambala Cantt Junction", "city": "Ambala", "state": "Haryana", "hindi_name": "अंबाला कैंट", "is_major_junction": True},
    {"code": "KLK", "name": "Kalka", "city": "Kalka", "state": "Haryana", "hindi_name": "कालका", "is_major_junction": True},
    {"code": "BTI", "name": "Bathinda Junction", "city": "Bathinda", "state": "Punjab", "hindi_name": "बठिंडा", "is_major_junction": True},
    {"code": "PNP", "name": "Panipat Junction", "city": "Panipat", "state": "Haryana", "hindi_name": "पानीपत", "is_major_junction": True},

    # --- Odisha ---
    {"code": "BBS", "name": "Bhubaneswar", "city": "Bhubaneswar", "state": "Odisha", "hindi_name": "भुवनेश्वर", "is_major_junction": True},
    {"code": "PURI", "name": "Puri", "city": "Puri", "state": "Odisha", "hindi_name": "पुरी", "is_major_junction": False},
    {"code": "CTC", "name": "Cuttack Junction", "city": "Cuttack", "state": "Odisha", "hindi_name": "कटक", "is_major_junction": True},
    {"code": "ROU", "name": "Rourkela Junction", "city": "Rourkela", "state": "Odisha", "hindi_name": "राउरकेला", "is_major_junction": True},
    {"code": "SBP", "name": "Sambalpur Junction", "city": "Sambalpur", "state": "Odisha", "hindi_name": "संबलपुर", "is_major_junction": True},
    {"code": "BAM", "name": "Brahmapur", "city": "Berhampur", "state": "Odisha", "hindi_name": "ब्रह्मपुर", "is_major_junction": False},
    {"code": "BLS", "name": "Baleshwar (Balasore)", "city": "Balasore", "state": "Odisha", "hindi_name": "बालेश्वर", "is_major_junction": False},

    # --- Madhya Pradesh ---
    {"code": "BPL", "name": "Bhopal Junction", "city": "Bhopal", "state": "Madhya Pradesh", "hindi_name": "भोपाल जंक्शन", "is_major_junction": True},
    {"code": "RKMP", "name": "Rani Kamlapati", "city": "Bhopal", "state": "Madhya Pradesh", "hindi_name": "रानी कमलापति", "is_major_junction": True},
    {"code": "INDB", "name": "Indore Junction", "city": "Indore", "state": "Madhya Pradesh", "hindi_name": "इंदौर जंक्शन", "is_major_junction": True},
    {"code": "GWL", "name": "Gwalior Junction", "city": "Gwalior", "state": "Madhya Pradesh", "hindi_name": "ग्वालियर जंक्शन", "is_major_junction": True},
    {"code": "JBP", "name": "Jabalpur", "city": "Jabalpur", "state": "Madhya Pradesh", "hindi_name": "जबलपुर", "is_major_junction": True},
    {"code": "UJN", "name": "Ujjain Junction", "city": "Ujjain", "state": "Madhya Pradesh", "hindi_name": "उज्जैन", "is_major_junction": True},
    {"code": "ET", "name": "Itarsi Junction", "city": "Itarsi", "state": "Madhya Pradesh", "hindi_name": "इटारसी जंक्शन", "is_major_junction": True},
    {"code": "KTE", "name": "Katni Junction", "city": "Katni", "state": "Madhya Pradesh", "hindi_name": "कटनी", "is_major_junction": True},
    {"code": "STA", "name": "Satna", "city": "Satna", "state": "Madhya Pradesh", "hindi_name": "सतना", "is_major_junction": True},

    # --- Assam & Northeast ---
    {"code": "GHY", "name": "Guwahati", "city": "Guwahati", "state": "Assam", "hindi_name": "गुवाहाटी", "is_major_junction": True},
    {"code": "KYQ", "name": "Kamakhya Junction", "city": "Guwahati", "state": "Assam", "hindi_name": "कामाख्या", "is_major_junction": True},
    {"code": "DBRG", "name": "Dibrugarh", "city": "Dibrugarh", "state": "Assam", "hindi_name": "डिब्रूगढ़", "is_major_junction": True},
    {"code": "AGTL", "name": "Agartala", "city": "Agartala", "state": "Tripura", "hindi_name": "अगरतला", "is_major_junction": False},
    {"code": "DMV", "name": "Dimapur", "city": "Dimapur", "state": "Nagaland", "hindi_name": "दीमापुर", "is_major_junction": False},

    # --- Goa ---
    {"code": "MAO", "name": "Madgaon Junction (Goa)", "city": "Margao", "state": "Goa", "hindi_name": "मडगाँव (गोवा)", "is_major_junction": True},
    {"code": "KRMI", "name": "Karmali (North Goa)", "city": "Panaji", "state": "Goa", "hindi_name": "करमली", "is_major_junction": False},
    {"code": "THVM", "name": "Thivim", "city": "Mapusa", "state": "Goa", "hindi_name": "थिविम", "is_major_junction": False},

    # --- Jammu & Kashmir ---
    {"code": "JAT", "name": "Jammu Tawi", "city": "Jammu", "state": "Jammu and Kashmir", "hindi_name": "जम्मू तवी", "is_major_junction": True},
    {"code": "SVDK", "name": "Shri Mata Vaishno Devi Katra", "city": "Katra", "state": "Jammu and Kashmir", "hindi_name": "माता वैष्णो देवी कटरा", "is_major_junction": False},

    # --- Uttarakhand ---
    {"code": "DDN", "name": "Dehradun", "city": "Dehradun", "state": "Uttarakhand", "hindi_name": "देहरादून", "is_major_junction": True},
    {"code": "HW", "name": "Haridwar", "city": "Haridwar", "state": "Uttarakhand", "hindi_name": "हरिद्वार", "is_major_junction": True},
    {"code": "KGM", "name": "Kathgodam", "city": "Nainital", "state": "Uttarakhand", "hindi_name": "काठगोदाम", "is_major_junction": False},

    # --- Jharkhand ---
    {"code": "RNC", "name": "Ranchi Junction", "city": "Ranchi", "state": "Jharkhand", "hindi_name": "राँची जंक्शन", "is_major_junction": True},
    {"code": "DHN", "name": "Dhanbad Junction", "city": "Dhanbad", "state": "Jharkhand", "hindi_name": "धनबाद", "is_major_junction": True},
    {"code": "TATA", "name": "Tatanagar Junction", "city": "Jamshedpur", "state": "Jharkhand", "hindi_name": "टाटानगर", "is_major_junction": True},
    {"code": "BKSC", "name": "Bokaro Steel City", "city": "Bokaro", "state": "Jharkhand", "hindi_name": "बोकारो स्टील सिटी", "is_major_junction": True},
    {"code": "JSME", "name": "Jasidih (Deoghar)", "city": "Deoghar", "state": "Jharkhand", "hindi_name": "जसीडीह", "is_major_junction": True},

    # --- Chhattisgarh ---
    {"code": "R", "name": "Raipur Junction", "city": "Raipur", "state": "Chhattisgarh", "hindi_name": "रायपुर जंक्शन", "is_major_junction": True},
    {"code": "BSP", "name": "Bilaspur Junction", "city": "Bilaspur", "state": "Chhattisgarh", "hindi_name": "बिलासपुर", "is_major_junction": True},
    {"code": "DURG", "name": "Durg Junction", "city": "Bhilai / Durg", "state": "Chhattisgarh", "hindi_name": "दुर्ग", "is_major_junction": True},

    # --- Himachal Pradesh ---
    {"code": "SML", "name": "Shimla", "city": "Shimla", "state": "Himachal Pradesh", "hindi_name": "शिमला", "is_major_junction": False},
]
