import axios from 'axios'
import { authAPI } from "./authAPI"
import { companyAPI } from "./companyAPI"
import { gameAPI } from "./gameAPI"
import { mailerAPI } from './mailerAPI'
import { reviewAPI } from './reviewAPI'
import { seriesAPI } from "./seriesAPI"
import { userAPI } from './userAPI'

const get = async () => {
  const response = await axios.get('/')
  return response.data
}

export { get, authAPI, companyAPI, gameAPI, mailerAPI, reviewAPI, seriesAPI, userAPI }