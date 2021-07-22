const router = require('express').Router();
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.resolve(process.env.PWD, 'public', 'index.html'))
})
router.post('/reg', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
})

module.exports = router
