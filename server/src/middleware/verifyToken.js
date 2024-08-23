import jsonwebtoken from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  console.log(req.cookies)
  const token = req.cookies.accessToken
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = decoded
    next()
  })
}