import jsonwebtoken from 'jsonwebtoken'

export const decodeToken = (req, res, next) => {
  const token = req.headers['user-token']
  
  if (!token) {
    req.user = null
    next()
  } else {
    jsonwebtoken.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      req.user = decoded
      next()
    })
  }
}