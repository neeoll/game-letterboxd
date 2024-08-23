import jsonwebtoken from 'jsonwebtoken'

export const decodeToken = (req, res, next) => {
  const token = req.cookies.accessToken
  
  if (!token) {
    req.user = null
    next()
  } else {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      req.user = decoded
      next()
    })
  }
}