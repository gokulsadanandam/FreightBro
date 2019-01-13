var path = require('path')

module.exports = (app) => {

    app.get('/api/data',(req,res)=>{
        res.sendFile(path.resolve(__dirname+'/../data/data.json'))
    })

    app.get('*' , (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../client/components/dashboard/dashboard.html'));
    })

}