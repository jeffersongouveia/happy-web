import Axios from 'axios'

const api = Axios.create({
  baseURL: 'https://nlw-happy-server.herokuapp.com'
})

export default api
