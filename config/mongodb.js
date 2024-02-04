const mongoose = require('mongoose');

async function connectDatabase() {

    mongoose.set('strictQuery', true);

    const url = process.env.MONGO_DB;
    
    try {

        await mongoose.connect(url)
        .then(() => {
            console.log('conneted');
        })

    } catch (error) {
        console.error(error);
        return;
    }

}

module.exports = connectDatabase;