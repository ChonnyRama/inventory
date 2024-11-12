const db = require('../db/queries')

const links = [
  { href: "/", text: 'Home' },
  {href: "/create", text: "Upload"}
]

async function getMonsters(req, res) {
  // const monsters = db.getAllMonsters()
  const monsters = [
    {name: 'goblin'}
  ]
  res.render('index',{title:'Available Monsters',monsters, links: links})
}

async function createMonstersGet(req, res) {
  res.render('newMonster', {title:'Upload a New Monster', links: links})
}

async function createMonstersPost(req, res) {
  db.createMonster(req.body)
  res.redirect("/")
}

module.exports = {
  getMonsters,
  createMonstersGet,
  createMonstersPost
}