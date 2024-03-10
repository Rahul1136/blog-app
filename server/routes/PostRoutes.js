const {Router} = require('express');

const router = Router();

router.get('/', (req,res) =>{
    res.json("This is post Route")
});

module.exports = router;