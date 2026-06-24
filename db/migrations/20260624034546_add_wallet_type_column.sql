-- migrate:up
CREATE TYPE cashflow.wallet_type AS ENUM ('BANK', 'EWALLET', 'INVESTMENT', 'CASH');

ALTER TABLE cashflow.wallets 
ADD COLUMN type cashflow.wallet_type DEFAULT 'BANK' NOT NULL;

-- migrate:down
ALTER TABLE cashflow.wallets 
DROP COLUMN type;

DROP TYPE cashflow.wallet_type;