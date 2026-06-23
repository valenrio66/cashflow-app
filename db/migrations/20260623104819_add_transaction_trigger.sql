-- migrate:up

CREATE OR REPLACE FUNCTION cashflow.update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'INCOME' AND NEW.destination_wallet_id IS NOT NULL THEN
        UPDATE cashflow.wallets
        SET balance = balance + NEW.amount, updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.destination_wallet_id;

    ELSIF NEW.type = 'EXPENSE' AND NEW.source_wallet_id IS NOT NULL THEN
        UPDATE cashflow.wallets
        SET balance = balance - NEW.amount, updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.source_wallet_id;

    ELSIF NEW.type = 'TRANSFER' THEN
        IF NEW.source_wallet_id IS NOT NULL THEN
            UPDATE cashflow.wallets
            SET balance = balance - NEW.amount, updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.source_wallet_id;
        END IF;

        IF NEW.destination_wallet_id IS NOT NULL THEN
            UPDATE cashflow.wallets
            SET balance = balance + NEW.amount, updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.destination_wallet_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_transaction_insert
AFTER INSERT ON cashflow.transactions
FOR EACH ROW
EXECUTE FUNCTION cashflow.update_wallet_balance();


-- migrate:down
DROP TRIGGER IF EXISTS trg_after_transaction_insert ON cashflow.transactions;
DROP FUNCTION IF EXISTS cashflow.update_wallet_balance();