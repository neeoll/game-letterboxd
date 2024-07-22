import jsonwebtoken from 'jsonwebtoken'

export const checkViewToken = (req, res, next) => {
  const token = req.headers['view-token']
  
  jsonwebtoken.verify(token, 'secret', (err, decoded) => {
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