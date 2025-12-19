import requests
from db.database import get_connection

PINCODE_API = "https://api.postalpincode.in/pincode"


def get_postal_metadata(pincode: str):
    conn = get_connection()
    cur = conn.cursor()

    # 1️⃣ Check cache first
    cur.execute(
        "SELECT office_name, district, state, delivery_status FROM postal_reference WHERE pincode=?",
        (pincode,)
    )
    row = cur.fetchone()

    if row:
        conn.close()
        return {
            "office_name": row[0],
            "district": row[1],
            "state": row[2],
            "delivery_status": row[3],
            "source": "cache"
        }

    # 2️⃣ Try API (resilient)
    try:
        res = requests.get(
            f"{PINCODE_API}/{pincode}",
            timeout=5,
            headers={"User-Agent": "Postathon/1.0"}
        )
        res.raise_for_status()

        data = res.json()[0]
        if data["Status"] != "Success":
            raise ValueError("Invalid PIN")

        office = data["PostOffice"][0]

        metadata = {
            "office_name": office["Name"],
            "district": office["District"],
            "state": office["State"],
            "delivery_status": office["DeliveryStatus"],
            "source": "api"
        }

        # 3️⃣ Cache result
        cur.execute(
            """
            INSERT OR REPLACE INTO postal_reference
            (pincode, office_name, district, state, delivery_status)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                pincode,
                metadata["office_name"],
                metadata["district"],
                metadata["state"],
                metadata["delivery_status"]
            )
        )

        conn.commit()
        conn.close()
        return metadata

    except Exception as e:
        # 4️⃣ Graceful fallback
        conn.close()
        return {
            "office_name": "Unknown Post Office",
            "district": "Unknown",
            "state": "Unknown",
            "delivery_status": "Unknown",
            "source": "fallback",
            "error": str(e)
        }
