-- LavaPro · pilot metrics extraction
-- Usage:
--   sqlite3 prisma/dev.db < scripts/pilot-metrics.sql
--   sqlite3 prisma/dev.db < scripts/pilot-metrics.sql > pilot-day-N.txt
--
-- Dates are stored as ISO 8601 strings. Adjust 'YYYY-MM-DD' as needed.

-- ---------------------------------------------------------------------------
-- 1. Orders created and completed on a given day
-- ---------------------------------------------------------------------------
-- Replace 'YYYY-MM-DD' with the pilot day.
SELECT
  COUNT(*) AS total_orders,
  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
  SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled,
  SUM(CASE WHEN status = 'QUEUED' THEN 1 ELSE 0 END) AS still_queued,
  SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress
FROM ServiceOrder
WHERE date(queuedAt) = 'YYYY-MM-DD';

-- ---------------------------------------------------------------------------
-- 2. Order completion latency (minutes) for orders completed on the day
-- ---------------------------------------------------------------------------
SELECT
  printf('%.1f', AVG((julianday(completedAt) - julianday(queuedAt)) * 24 * 60)) AS average_latency_min,
  printf('%.1f', MAX((julianday(completedAt) - julianday(queuedAt)) * 24 * 60)) AS max_latency_min
FROM ServiceOrder
WHERE status = 'COMPLETED'
  AND date(completedAt) = 'YYYY-MM-DD';

-- ---------------------------------------------------------------------------
-- 3. Revenue and estimated cost for the day
-- ---------------------------------------------------------------------------
SELECT
  printf('%.2f', SUM(totalPrice)) AS revenue_brl,
  printf('%.2f', SUM(totalCost)) AS cost_brl,
  printf('%.2f', SUM(totalPrice) - SUM(totalCost)) AS margin_brl,
  CASE
    WHEN SUM(totalPrice) = 0 THEN '0.00'
    ELSE printf('%.2f', (SUM(totalPrice) - SUM(totalCost)) * 100.0 / SUM(totalPrice))
  END AS margin_pct
FROM ServiceOrder
WHERE status = 'COMPLETED'
  AND date(completedAt) = 'YYYY-MM-DD';

-- ---------------------------------------------------------------------------
-- 4. Mix of services for the day
-- ---------------------------------------------------------------------------
SELECT
  st.name AS service,
  SUM(soi.quantity) AS qty,
  printf('%.2f', SUM(soi.quantity * soi.priceAtTime)) AS revenue_brl
FROM ServiceOrderItem soi
JOIN ServiceOrder so ON so.id = soi.serviceOrderId
JOIN ServiceType st ON st.id = soi.serviceTypeId
WHERE so.status = 'COMPLETED'
  AND date(so.completedAt) = 'YYYY-MM-DD'
GROUP BY st.id
ORDER BY qty DESC;

-- ---------------------------------------------------------------------------
-- 5. Stock movements by reason for the day
-- ---------------------------------------------------------------------------
SELECT
  reason,
  COUNT(*) AS movements,
  printf('%.3f', SUM(delta)) AS total_delta
FROM StockMovement
WHERE date(createdAt) = 'YYYY-MM-DD'
GROUP BY reason
ORDER BY movements DESC;

-- ---------------------------------------------------------------------------
-- 6. Low-stock products at end of day
-- ---------------------------------------------------------------------------
SELECT
  name,
  currentStock,
  minStock,
  unit
FROM Product
WHERE currentStock <= minStock
ORDER BY (currentStock - minStock) ASC;

-- ---------------------------------------------------------------------------
-- 7. Last 30 stock movements (mirrors the /inventory panel)
-- ---------------------------------------------------------------------------
SELECT
  sm.createdAt,
  p.name AS product,
  sm.delta,
  sm.reason,
  sm.reference
FROM StockMovement sm
JOIN Product p ON p.id = sm.productId
ORDER BY sm.createdAt DESC
LIMIT 30;
