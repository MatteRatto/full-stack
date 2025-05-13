const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async create(userData) {
    const { name, email, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password) 
      VALUES (?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [name, email, hashedPassword]);

      const [rows] = await pool.execute(
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";

    try {
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT id, name, email, created_at FROM users WHERE id = ?";

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    try {
      await pool.execute(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = "DELETE FROM users WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
