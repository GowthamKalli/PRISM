import sqlite3
from db.database import DB_PATH

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

with open("db/schema.sql", "r") as f:
    schema = f.read()
    cur.executescript(schema)

conn.commit()

cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cur.fetchall()

print("Tables in database:")
for table in tables:
    print(" -", table[0])

conn.close()
