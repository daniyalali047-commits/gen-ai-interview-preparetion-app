import 'dotenv/config';
import app from './src/app.js'
import connectDb from './src/config/database.js';
import envoke from './src/services/ai-sevvice.js';

connectDb()
envoke()



app.listen(3000, () => {
  console.log('Server is running on port 3000')
})