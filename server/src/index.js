import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;
import carRoutes from './routes/carRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auth from './routes/auth.js';

app.use(cors());
app.use(express.json());
app.use('/cars',carRoutes);
app.use('/users',userRoutes);
app.use("/auth", auth);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})