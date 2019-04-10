const a = require('axios');
const user_info = require('../utils/constants/linkedin')

exports.accountInfo = async (req, res, next) => {
  //const data = {
//   "grant_type": "authorization_code",
//   "client_id": process.env.LINKED_IN_CLIENT_ID,
//   "client_secret": process.env.LINKED_IN_CLIENT_SECRET,
//   "redirect_uri":"https://richardryangarcia.com",
//   "code": process.env.LINKED_IN_AUTH_TOKEN
// }
  try {
    // TODO: awaiting linked in to open up permissions to retrieve my linked in data through api.
    // const response = await a.post(`https://www.linkedin.com/oauth/v2/accessToken`, data);
    // res.send(response.data)
    res.send(user_info);
  } catch (err) {
    next(err)
  }
};
