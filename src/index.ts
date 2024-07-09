import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
import routes from './routes/routes'
import { errorMiddleware } from './middlewares/errors'
import { engine } from 'express-handlebars';
import path from 'path';

AppDataSource.initialize().then(() => {

const app = express()

app.use(express.json())
app.use(routes)
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(errorMiddleware)
	return app.listen(process.env.PORT)
})