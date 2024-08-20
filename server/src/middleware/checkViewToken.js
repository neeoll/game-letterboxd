import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config'

export const checkViewToken = (req, res, next) => {
  const token = req.headers['view-token']
  
  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.expiredAt) { 
        req.token = null
        return next()
       }
      return next()
    }
    req.token = decoded
    next()
  })
}