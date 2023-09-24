import axios from 'axios'

const URL = 'https://movie-database-alternative.p.rapidapi.com/'
const env = await import.meta.env;
export async function findByTitle(title) {
    const options = {
        method: 'GET',
        url: URL,
        params: {
          s: title,
          r: 'json',
          page: '1'
        },
        headers: {
          'X-RapidAPI-Key': env.VITE_RAPID_KEY,
          'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
        }
      };

      return await axios.request(options)
}