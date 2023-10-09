const Post = require('../../Schema/Post')



const list = async (req, res) => {
  try {
    console.log("profile")
    console.log(req.query.page)
    let following = req.profile.following
    following.push(req.profile._id)

    try {
      let posts = await Post.find()
        .populate('author', '_id name image')
        .populate('comments.commentedBy', '_id name image')
        .sort('-created')
        .exec()
      const mainArray = posts;
      const chunkSize = 10;
      const result = chunkArray(mainArray, chunkSize);
      console.log("array")
      // console.log(result[1].length)
      if (result.length <= req.query.page) {
        res.json([])
      }
      res.json(result[req.query.page])
    } catch (error) {
      console.log("400 error")
      console.log(error)
      return res.status(400).json({
        error: error
      })
    }
  } catch (error) {
    console.log(error)
  }

}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = list