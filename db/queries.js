//queries.js

const pool = require('./pool')

async function getAllMonsters() {
  const { rows } = await pool.query('SELECT * FROM monsters')
  return rows
}

async function getMonstersByType(type) {
  try {
    const typeResult = await pool.query('SELECT type_id FROM types WHERE type_name = $1', [type])
    const typeId = typeResult.rows[0].type_id;
    const { rows } = await pool.query('SELECT name FROM monsters WHERE type_id = $1', [typeId])
    return rows
  } catch (err) {
    console.error('Error fetching monsters:', err)
    throw err
  }
  
}

async function createMonster(monster) {
  //destructure monster object being passed
  const { name, type, str, dex, con, int, wis, cha } = monster;

  const typeResult = await pool.query('SELECT type_id FROM types WHERE type_name = $1', [type])
  if (typeResult.rows.length === 0) {
    throw new Error(`Type "${type}" not found`)
  }
  const typeId = typeResult.rows[0].type_id;
  const monsterResult = await pool.query('INSERT INTO monsters (name, type_id) VALUES ($1, $2) RETURNING monster_id', [name, typeId])
  const monsterId = monsterResult.rows[0].monster_id

  const abilities = [
    { abilityType: 'Strength', score: str },
    { abilityType: 'Dexterity', score: dex },
    { abilityType: 'Constitution', score: con },
    { abilityType: 'Intelligence', score: int },
    { abilityType: 'Wisdom', score: wis },
    {abilityType: 'Charisma', score: cha},
  ]

  try {
    await pool.query('BEGIN')

    for (const ability of abilities) {
      await pool.query(
        'INSERT INTO ability_scores (monster_id, ability_type, score) VALUES ($1,$2,$3)',
        [monsterId, ability.abilityType, ability.score]
      );
    }
    await pool.query('COMMIT')
  } catch (err) {
    await pool.query('ROLLBACK')
    throw err
  }
}

module.exports = {
  getAllMonsters,
  getMonstersByType,
  createMonster
}