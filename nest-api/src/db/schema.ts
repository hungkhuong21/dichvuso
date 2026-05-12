export const SCHEMA_SQL = `
CREATE TABLE users (
  id           INTEGER PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  name         TEXT,
  role         TEXT NOT NULL DEFAULT 'user',
  isActive     INTEGER NOT NULL DEFAULT 1 CHECK (isActive IN (0, 1)),
  createdAt    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE categories (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  "order"     INTEGER NOT NULL DEFAULT 0,
  isActive    INTEGER NOT NULL DEFAULT 1 CHECK (isActive IN (0, 1)),
  createdAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE services (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  department  TEXT NOT NULL,
  image       TEXT,
  path        TEXT NOT NULL,
  isActive    INTEGER NOT NULL DEFAULT 1 CHECK (isActive IN (0, 1)),
  createdAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE service_categories (
  serviceId  INTEGER NOT NULL,
  categoryId INTEGER NOT NULL,
  PRIMARY KEY (serviceId, categoryId),
  FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE service_visits (
  id        INTEGER PRIMARY KEY,
  serviceId INTEGER NOT NULL,
  userId    INTEGER,
  ip        TEXT,
  userAgent TEXT,
  referrer  TEXT,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE user_favorites (
  userId    INTEGER NOT NULL,
  serviceId INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (userId, serviceId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE INDEX idx_categories_active_order ON categories(isActive, "order", id);
CREATE INDEX idx_services_active_name ON services(isActive, name, id);
CREATE INDEX idx_services_department ON services(department, id);
CREATE INDEX idx_service_categories_category ON service_categories(categoryId, serviceId);
CREATE INDEX idx_user_favorites_service ON user_favorites(serviceId, userId);
CREATE INDEX idx_service_visits_service_created ON service_visits(serviceId, createdAt DESC);
CREATE INDEX idx_service_visits_created ON service_visits(createdAt DESC);
`;
