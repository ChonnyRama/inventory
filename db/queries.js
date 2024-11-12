const pool = require('./pool')

async function getAllMonsters() {
  const { rows } = await pool.query('SELECT name FROM monsters')
  return rows
}

async function getMonstersByType(type) {
  const typeId = await pool.query('SELECT type_id FROM types WHEN type_name = $1',[type])
  const { rows } = await pool.query('SELECT name FROM monsters WHERE type_id = $1', [typeId])
  return rows
}

async function createMonster(monster) {
  //destructure monster object being passed
  const { name, type, str, dex, con, int, wis, cha } = monster;

  const typeId = await pool.query('SELECT type_id FROM types WHERE type_name LIKE $1', [type])
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
  await pool.query
}

module.exports = {
  getAllMonsters,
  getMonstersByType,
  createMonster
}