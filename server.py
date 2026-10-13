from http.server import HTTPServer, BaseHTTPRequestHandler
import json

# Comprehensive Pakistani Precedents & Statutes Library
LEGAL_LIBRARY = [
    {
        "id": "1",
        "title": "Section 497 CrPC - Bail Matters",
        "category": "Statute",
        "citation": "Section 497 CrPC",
        "ratio": "Deals with the mandatory conditions, statutory thresholds, and judicial discretion regarding the grant of post-arrest bail to an accused person during investigations or pending trial in non-bailable matters."
    },
    {
        "id": "2",
        "title": "2025 CLC 1580 - Civil & Revenue Discretion",
        "category": "Civil Law Precedent",
        "citation": "2025 CLC 1580",
        "ratio": "Clarified that interim relief in revenue and land partition matters must fulfill the triple test: prima facie case, balance of convenience, and irreparable loss. Discretionary powers cannot be exercised arbitrarily."
    },
    {
        "id": "3",
        "title": "2021 LHC 7645 - Condonation of Service Delay",
        "category": "High Court Precedent",
        "citation": "2021 LHC 7645",
        "ratio": "Held that a delay of two days in filing an application for leave to defend should be condoned leniently if the defendant enters an appearance on the very next immediate court hearing date following actual service."
    },
    {
        "id": "4",
        "title": "PLD 2026 Supreme Court 113 - Constitutional Jurisdiction",
        "category": "Apex Court Precedent",
        "citation": "PLD 2026 Supreme Court 113",
        "ratio": "Elaborated on the scope of constitutional review. Confirmed that executive directives disrupting statutory timelines without legislative backing are ultra vires and invalid."
    },
    {
        "id": "5",
        "title": "2025 SCMR 361 - Recovery Memo & Evidentiary Flaws",
        "category": "Criminal Precedent",
        "citation": "2025 SCMR 361",
        "ratio": "Reiterated that recoveries made from joint or open spaces accessible to the general public carry zero evidentiary value. Independent, respectable private witnesses of the locality must attest to the recovery memo."
    }
]

class WarisLawServer(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        # Dropdown population: Return all judgments instantly
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"library": LEGAL_LIBRARY}).encode('utf-8'))

    def do_POST(self):
        # Search engine query matching
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        request_data = json.loads(body.decode('utf-8'))
        
        search_query = request_data.get("query", "").strip().lower()
        print(f"[LOG] Sifting dataset for query: '{search_query}'")
        
        matched_results = []
        if search_query:
            for item in LEGAL_LIBRARY:
                if (search_query in item["title"].lower() or 
                    search_query in item["citation"].lower() or 
                    search_query in item["ratio"].lower()):
                    matched_results.append(item)
                    
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"results": matched_results}).encode('utf-8'))

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8000), WarisLawServer)
    print("🚀 Advanced Precedent Library Engine running on http://127.0.0.1:8000")
    server.serve_forever()
