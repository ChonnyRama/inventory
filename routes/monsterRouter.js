const { Router } = require('express')
const { getMonsters } = require('../controllers/monsterController')
const monsterRouter = Router()

monsterRouter.get('/', getMonsters)

module.exports = monsterRouter