const db = require('../../configs/db.config');

const getAllSoldByUser = (user_id) => {
  return db
    .query(`
      SELECT * FROM orders
      JOIN line_items ON orders.id = line_items.order_id
      JOIN artworks ON line_items.artwork_id = artworks.id
      WHERE user_id = $1
      ORDER BY order_date DESC;
      `, [user_id])
    .then((data) => {
      return data.rows;
    });
};

const getAllPurchasedByUser = (user_id) => {
  return db
    .query(`
      SELECT * FROM orders
      JOIN line_items ON orders.id = line_items.order_id
      JOIN artworks ON line_items.artwork_id = artworks.id
      WHERE orders.customer_id = $1
    `, [user_id])
    .then((data) => {
      return data.rows;
    });
};

const addArtworkToOrderByID = (order_id, artwork_id, price_cents) => {
  return db
  .query(`
  INSERT INTO line_items (order_id, artwork_id, price_cents) 
  VALUES ($1, $2, $3);
  `, [order_id, artwork_id, price_cents])
  .then((data) => {
    return data.rows;
  });
};

const getOrderByUserID = (user_id) => {
  return db
    .query(`
      SELECT line_items.id as line_id, * FROM line_items
      JOIN orders ON orders.id = line_items.order_id
      JOIN artworks ON line_items.artwork_id = artworks.id
      WHERE orders.customer_id = $1
      AND orders.in_progress = TRUE;
    `, [user_id])
    .then((data) => {
      return data.rows;
    });
};

const getOrderInProgress = (user_id) => {
  return db
  .query(`
    SELECT * FROM orders
    WHERE orders.customer_id = $1
    AND orders.in_progress = TRUE
  `, [user_id])
  .then((data) => {
    if (data.rows.length === 0) {
      return false;
    } else {
      return data.rows;
    }
  });
};

//UPDATE ORDERS 

const createNewOrder = (user_id) => {
  return db
  .query(`
    INSERT INTO orders (customer_id, order_date, in_progress) 
    VALUES ($1, CURRENT_TIMESTAMP, true)
    RETURNING *
  `, [user_id])
  .then((data) => {
    return data.rows;
  });
};

const deleteLineItem = (line_item_id) => {
  return db
  .query(`
    DELETE FROM line_items
    WHERE id = $1;
  `, [line_item_id])
  .then((data) => {
    return data.rows;
  });
};

const emptyCart = (order_id) => {
  return db
  .query(`
  UPDATE orders
  SET in_progress = false
  WHERE id = $1;
`, [order_id])
  .then((data) => {
    return data.rows;
  });
};

const getLastOrderByUserID = (user_id) => {
  return db
  .query(`
  SELECT line_items.id as line_id, * FROM line_items
  JOIN orders ON orders.id = line_items.order_id
  JOIN artworks ON line_items.artwork_id = artworks.id
  WHERE orders.customer_id = $1
  ORDER BY order_date DESC;
`, [user_id])
  .then((data) => {
    return data.rows;
  });
};

const addArtworkToCart = (artwork_id) => {
  return db
  .query(`
  UPDATE artworks
  SET in_cart = true
  WHERE id = $1;
`, [artwork_id])
  .then((data) => {
    return data.rows;
  });
};

const removeArtworkFromCart = (artwork_id) => {
  return db
  .query(`
  UPDATE artworks
  SET in_cart = false
  WHERE id = $1;
`, [artwork_id])
  .then((data) => {
    return data.rows;
  });
};

module.exports = { getAllSoldByUser, getAllPurchasedByUser, addArtworkToOrderByID, getOrderByUserID, getOrderInProgress, createNewOrder, deleteLineItem, emptyCart, getLastOrderByUserID, addArtworkToCart, removeArtworkFromCart };