//monsterRouter.js
const { Router } = require('express')
const monsterController = require('../controllers/monsterController')
const monsterRouter = Router()

monsterRouter.get('/', monsterController.getMonsters)
monsterRouter.get('/create', monsterController.createMonstersGet)
monsterRouter.post('/create', monsterController.createMonstersPost)

module.exports = monsterRouter