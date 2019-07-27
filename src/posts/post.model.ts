import mongoose from 'mongoose';
import Post from '../posts/post.interface';

const postSchema = new mongoose.Schema({
  author: mongoose.Types.ObjectId,
  content: String,
  title: String
});
const PostModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);
export default PostModel;
