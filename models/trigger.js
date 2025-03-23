import { pool } from "../database/connectPostgres.js";

const createFunctionQuery = `
CREATE OR REPLACE FUNCTION delete_old_unpaid_guest_orders()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM orders
    WHERE paid = false AND user_id IS NULL
    AND created_at < NOW() - INTERVAL '24 hours';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
`;

const createTriggerQuery = `
CREATE OR REPLACE TRIGGER trigger_delete_old_unpaid_guest_orders
AFTER INSERT ON orders
EXECUTE FUNCTION delete_old_unpaid_guest_orders();
`;

const createTriggers = async () => {
  try {
    //create function to delete unpaid guest orders after 24 hours
    await pool.query(createFunctionQuery);

    //create trigger to execute function after insert new order
    await pool.query(createTriggerQuery);
    console.log("Triggers created successfully");
  } catch (error) {
    console.error(error);
  }
};

export default createTriggers;
