const express = require('express')

const app = express()

//First arg = endpoint, second arg = function
app.get('/api/register', (req, res) => {
    res.json({
        data: 'you hit register enpoint'
    })
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`API is running on port ${port}`));