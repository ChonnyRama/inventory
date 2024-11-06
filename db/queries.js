const pool = require('./pool')

async function getAllMonsters() {
  const { rows } = await pool.query('SELECT name FROM monsters')
  return rows
}

async function getMonstersByType(type) {
  const typeId = await pool.query('SELECT type_id FROM types WHEN type_name = $1',[`${type}`])
  const { rows } = await pool.query('SELECT name FROM monsters WHERE type_id = $1', [`${typeId}`])
  return rows
}

module.exports = {
  getAllMonsters,
  getMonstersByType
}