
import { Router } from 'express'
import { getConsultas } from '../controllers/consultas.controller'
const consultas = Router()

consultas.get('/', getConsultas)

consultas.get('/:id', (req, res) => {
    console.log(req.params.id)
    res.send('Hello World')
})

export default consultas