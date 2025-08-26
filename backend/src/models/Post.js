const { pool } = require("../config/database");

class Post {
  constructor(id, user_id, title, content, created_at, updated_at) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.content = content;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async create(postData) {
    const { user_id, title, content } = postData;

    const query = `
      INSERT INTO posts (user_id, title, content)
      VALUES (?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [user_id, title, content]);

      const [rows] = await pool.execute(
        `SELECT p.*, u.name as author_name, u.email as author_email
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`,
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(page = 1, limit = 10) {
    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 10;
    const offset = (pageInt - 1) * limitInt;

    const query = `
    SELECT p.*, u.name as author_name, u.email as author_email
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ${limitInt} OFFSET ${offset}
  `;

    try {
      const [posts] = await pool.execute(query);

      const [countResult] = await pool.execute(
        "SELECT COUNT(*) as total FROM posts"
      );
      const total = countResult[0].total;

      return {
        posts,
        pagination: {
          page: pageInt,
          limit: limitInt,
          total,
          pages: Math.ceil(total / limitInt),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.name as author_name, u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [parseInt(id, 10)]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(user_id, page = 1, limit = 10) {
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const offset = (pageInt - 1) * limitInt;

    const query = `
      SELECT p.*, u.name as author_name, u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [posts] = await pool.execute(query, [
        parseInt(user_id, 10),
        limitInt,
        offset,
      ]);

      const [countResult] = await pool.execute(
        "SELECT COUNT(*) as total FROM posts WHERE user_id = ?",
        [parseInt(user_id, 10)]
      );
      const total = countResult[0].total;

      return {
        posts,
        pagination: {
          page: pageInt,
          limit: limitInt,
          total,
          pages: Math.ceil(total / limitInt),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, user_id, updateData) {
    const { title, content } = updateData;

    const query = `
      UPDATE posts
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;

    try {
      const [result] = await pool.execute(query, [
        title,
        content,
        parseInt(id, 10),
        parseInt(user_id, 10),
      ]);

      if (result.affectedRows === 0) {
        throw new Error(
          "Post non trovato o non hai i permessi per modificarlo"
        );
      }

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, user_id) {
    const query = "DELETE FROM posts WHERE id = ? AND user_id = ?";

    try {
      const [result] = await pool.execute(query, [
        parseInt(id, 10),
        parseInt(user_id, 10),
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async search(searchTerm, page = 1, limit = 10) {
    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 10;
    const offset = (pageInt - 1) * limitInt;

    const query = `
    SELECT p.*, u.name as author_name, u.email as author_email
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.title LIKE ? OR p.content LIKE ? OR u.name LIKE ?
    ORDER BY p.created_at DESC
    LIMIT ${limitInt} OFFSET ${offset}
  `;

    const searchPattern = `%${searchTerm}%`;

    try {
      const [posts] = await pool.execute(query, [
        searchPattern,
        searchPattern,
        searchPattern,
      ]);

      const [countResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.title LIKE ? OR p.content LIKE ? OR u.name LIKE ?`,
        [searchPattern, searchPattern, searchPattern]
      );
      const total = countResult[0].total;

      return {
        posts,
        pagination: {
          page: pageInt,
          limit: limitInt,
          total,
          pages: Math.ceil(total / limitInt),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
