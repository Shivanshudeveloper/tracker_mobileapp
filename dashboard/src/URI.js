import dotenv from 'dotenv'

dotenv.config()

// const API_SERVICE = process.env.REACT_APP_API_SERVICE
const API_SERVICE = 'http://localhost:5000/api/v1/main'
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY
const MAP_TOKEN = process.env.REACT_APP_MAP_TOKEN
const MAP_STYLE = process.env.REACT_APP_MAP_STYLE

// const API_SERVICE = "https://trackermobileapp.herokuapp.com";

export { API_SERVICE, SECRET_KEY, MAP_TOKEN, MAP_STYLE }
