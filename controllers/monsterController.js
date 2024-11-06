const db = require('../db/queries')

async function getMonsters(req, res) {
  const monsters = db.getAllMonsters()
  res.render('index',{title:'Available Monsters',monsters})
}

module.exports = {
  getMonsters

}