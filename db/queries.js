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
  const formattedName = name.toLowerCase()
  

  const abilities = [
    { abilityType: 'strength', score: str },
    { abilityType: 'dexterity', score: dex },
    { abilityType: 'constitution', score: con },
    { abilityType: 'intelligence', score: int },
    { abilityType: 'wisdom', score: wis },
    {abilityType: 'charisma', score: cha},
  ]

  try {
    const typeResult = await pool.query('SELECT type_id FROM types WHERE type_name = $1', [type])
    if (typeResult.rows.length === 0) {
      throw new Error(`Type "${type}" not found`)
    }
    const typeId = typeResult.rows[0].type_id;
    const monsterResult = await pool.query('INSERT INTO monsters (name, type_id) VALUES ($1, $2) RETURNING monster_id', [formattedName, typeId])
    const monsterId = monsterResult.rows[0].monster_id
    
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

async function getMonsterBehavior(monsterName) {
  try {
    //get monster id first
    const monsterResult = await pool.query('SELECT monster_id FROM monsters WHERE name = $1', [monsterName])
    const monsterId = monsterResult.rows[0].monster_id
    //get all associated stats
    const query = `
      SELECT
        m.name AS monster_name,
        t.type_name AS monster_type,
        t.type_description,
        a.ability_type,
        a.score,
        s.stat_type,
        s.tier,
        s.range_description
      FROM monsters m
      INNER JOIN
        types t
      ON
        m.type_id = t.type_id
      INNER JOIN
        ability_scores a
      ON
        m.monster_id = a.monster_id
      INNER JOIN
        score_descriptions s
      ON
        a.ability_type = s.ability_type
      WHERE
        m.monster_id = $1
        AND a.score BETWEEN s.min_score AND s.max_score
    `;

    const { rows } = await pool.query(query, [monsterId])
    
    rows.forEach(row => {
      row.monster_name = capitalizeFirstLetter(row.monster_name)
      row.monster_type = capitalizeFirstLetter(row.monster_type)
      row.ability_type = capitalizeFirstLetter(row.ability_type)
      row.tier = capitalizeFirstLetter(row.tier)
      row.stat_type = capitalizeFirstLetter(row.stat_type)
    })

    return rows;

  } catch (err) {
    console.error('Error fetching monster stats', err)
    throw err
  }
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

module.exports = {
  getAllMonsters,
  getMonstersByType,
  createMonster,
  getMonsterBehavior
}