-- =========================
-- Tickets
-- =========================
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    complaint_text TEXT NOT NULL,
    tracking_id TEXT,
    status TEXT DEFAULT 'NEW',
    priority_score INTEGER,
    priority_level TEXT,
    global_rank INTEGER,
    created_at TEXT
);

-- =========================
-- Ticket Analysis (AI output)
-- =========================
CREATE TABLE IF NOT EXISTS ticket_analysis (
    ticket_id TEXT,
    category TEXT,
    sentiment REAL,
    urgency INTEGER,
    FOREIGN KEY(ticket_id) REFERENCES tickets(ticket_id)
);

-- =========================
-- Postal Tracking (simulated / API-backed)
-- =========================
CREATE TABLE IF NOT EXISTS postal_tracking (
    tracking_id TEXT PRIMARY KEY,
    current_status TEXT,
    last_location TEXT,
    last_update TEXT,
    is_delayed INTEGER DEFAULT 0,
    delay_days INTEGER DEFAULT 0
);

-- =========================
-- Postal PIN Code Reference (cached API data)
-- =========================
CREATE TABLE IF NOT EXISTS postal_reference (
    pincode TEXT PRIMARY KEY,
    office_name TEXT,
    district TEXT,
    state TEXT,
    delivery_status TEXT
);

-- =========================
-- Feedback (User + Admin)
-- =========================
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT NOT NULL,
    source TEXT CHECK(source IN ('user', 'admin')),
    rating INTEGER CHECK(rating IN (-1, 0, 1)),
    comment TEXT,
    created_at TEXT,
    FOREIGN KEY(ticket_id) REFERENCES tickets(ticket_id)
);
