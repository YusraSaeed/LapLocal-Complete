import 'dotenv/config';
import connectDB from './db/index.js';
import {app} from './app.js'
import server from './app.js';
import { Buyer } from './models/buyer.model.js';
connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, () =>{
        console.log(`App listening on port ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.log(`Connection failed: ${error}`);
})

// okay so I logged in as a seller, copied the token, hit the route /inbox to fetch all messages for that Buyer. currently he only had one unread message from the Buyer. then I hit the route /unread to ensure I was getting that unread message but then when I hit the route /history provided the correct listing and buyer id, I got an empty array