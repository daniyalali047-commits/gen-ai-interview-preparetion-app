import 'dotenv/config';
import app from './src/app.js';
import connectDb from './src/config/database.js';
import temp from './src/services/temp.js';
const { resume, jobdescription, selfdescription } = temp;
import  generateinterviewReport  from './src/services/ai-service.js';

generateinterviewReport({resume , jobdescription , selfdescription});

connectDb();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});