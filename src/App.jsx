import {findByTitle} from "./backend.js";
import {useCallback, useState} from "react";
import {debounce} from "lodash";

export default function App() {
    const [title, setTitle] = useState("")
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null)
    const [movies, setMovies] = useState(null)

    const handleOnChange = userInput => {
        setIsLoading(true)
        findByTitle(userInput)
            .then(response => response.data)
            .then(data => {
                console.log(data)
                if (data.Response === 'True') {
                    setError(null)
                    setMovies(data.Search)
                    setIsLoading(false)
                } else {
                    setError(data.Error)
                    setMovies(null)
                    setIsLoading(false)
                }
            })
            .catch(() => {
                setError("An error occured. Please try again.")
                setMovies(null)
                setIsLoading(false)
            })
    }

    const debouncedHandleOnChange = useCallback(debounce(handleOnChange, 500), []);

    const onChange = (event) => {
        setTitle(event.target.value);
        debouncedHandleOnChange(event.target.value);
    };

    return (
        <div className="container">
            <div className="search">
                <input
                    name="title"
                    aria-label="title"
                    placeholder="title"
                    type="search"
                    value={title}
                    onChange={onChange}/>
            </div>
            <div className="list">
                {error && <p>error</p>}
                {isLoading && <p>Loading...</p>}
                {movies && movies.map(movie => <ListItem movie={movie} key={movie.imdbID}/>)}
            </div>
        </div>
    )
}

function ListItem({movie: {Poster, Title}}) {
    return <>
        <div className="list-item">
            <h1>{Title}</h1>
            <img src={Poster} alt={Title}/>
        </div>
    </>
}