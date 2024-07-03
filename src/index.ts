import express from 'express'
import consultas from './routes/consultas.router'
const app = express()



app.use(express.json())
app.use('/consultas',consultas)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})