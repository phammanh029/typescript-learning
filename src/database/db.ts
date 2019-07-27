import mongoose from 'mongoose';

class Db {
  private url = 'mongodb://db/type-script';
  public async connect() {
    try {
      await mongoose.connect(this.url, {
        useNewUrlParser: true
      });
      console.log('Connected to database');
    } catch (error) {
      console.error(error);
    }
  }

  public async disconnect() {
    await mongoose.disconnect();
  }
}

export default Db;
