INSERT OR REPLACE INTO postal_tracking
(tracking_id, current_status, last_location, last_update)
VALUES
('AB123', 'DELIVERED', 'New Delhi GPO', datetime('now','-1 day')),
('CD456', 'OUT_FOR_DELIVERY', 'Hyderabad GPO', datetime('now','-2 hours')),
('EF789', 'IN_TRANSIT', 'Bengaluru Hub', datetime('now','-4 days')),
('GH012', 'DELAYED', 'Mumbai Hub', datetime('now','-8 days')),
('IJ345', 'ARRIVED_AT_HUB', 'Chennai Hub', datetime('now','-1 day'));
