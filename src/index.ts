import app from "./app";
import './database';

app.listen(3000);

console.log('Server on port:', app.get('port'));