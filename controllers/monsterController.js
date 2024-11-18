//monsterController.js
const db = require('../db/queries')

const links = [
  { href: "/", text: 'Home' },
  {href: "/create", text: "Upload"}
]

async function getMonsters(req, res) {
  const search = req.query.types;
  let monsters

  if (search) {
    monsters = await db.getMonstersByType(search)
  } else {
    monsters = await db.getAllMonsters()
  }
  res.render('index',{title:'Available Monsters',monsters, links: links})
}

async function createMonstersGet(req, res) {
  res.render('newMonster', {title:'Upload a New Monster', links: links})
}

async function createMonstersPost(req, res) {
  await db.createMonster(req.body)
  res.redirect("/")
}

module.exports = {
  getMonsters,
  createMonstersGet,
  createMonstersPost
}