-- migrate:up

CREATE SCHEMA IF NOT EXISTS cashflow;

CREATE TYPE cashflow.transaction_type AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');
CREATE TYPE cashflow.allocation_status AS ENUM ('PENDING', 'PAID');

CREATE TABLE cashflow.wallets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE cashflow.allocations (
    id SERIAL PRIMARY KEY,
    wallet_id INT REFERENCES cashflow.wallets(id) ON DELETE CASCADE,
    amount_target NUMERIC(15, 2) NOT NULL,
    status cashflow.allocation_status DEFAULT 'PENDING' NOT NULL,
    period DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE cashflow.transactions (
    id SERIAL PRIMARY KEY,
    type cashflow.transaction_type NOT NULL,
    source_wallet_id INT REFERENCES cashflow.wallets(id) ON DELETE SET NULL,
    destination_wallet_id INT REFERENCES cashflow.wallets(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL,
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO cashflow.wallets (name, balance) VALUES 
('BRI Utama', 0.00),
('Bank Jago (Tabungan)', 0.00),
('Bibit (RDPU)', 0.00),
('Tring! (Emas)', 0.00),
('Wondr (Cicilan Laptop)', 0.00),
('Dana (Hub Transfer)', 0.00);

-- migrate:down
DROP TABLE IF EXISTS cashflow.transactions;
DROP TABLE IF EXISTS cashflow.allocations;
DROP TABLE IF EXISTS cashflow.wallets;
DROP TYPE IF EXISTS cashflow.allocation_status;
DROP TYPE IF EXISTS cashflow.transaction_type;
DROP SCHEMA IF EXISTS cashflow;