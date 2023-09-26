import {useCallback, useState} from "react";
import {findByTitle} from "../backend.js";
import {debounce} from "lodash";

export default function Root() {
    const [title, setTitle] = useState("")
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null)
    const [movies, setMovies] = useState(null)
    const [series, setSeries] = useState(null)

    const handleOnChange = userInput => {
        setIsLoading(true)
        findByTitle(userInput)
            .then(response => response.data)
            .then(data => {
                if (data.Response === 'True') {
                    setError(null)
                    setMovies(data.Search.filter(current => current.Type === 'movie'))
                    setSeries(data.Search.filter(current => current.Type === 'series'))
                    setIsLoading(false)
                } else {
                    setError(data.Error)
                    setMovies(null)
                    setSeries(null)
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
        <>
            <div className="container">
                <h1>My IMDB</h1>
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
                    {error && <p>{error}</p>}
                    {isLoading && <p>Loading...</p>}
                    {movies && <List title="Movies" items={movies}/>}
                    {series && <List title="Series" items={series}/>}
                </div>
            </div>
        </>
    )
}

function List({title, items}) {
    return <>
        <h2>{title}</h2>
        {items.map(item => <ListItem item={item} key={item.imdbID}/>)}
    </>
}

function ListItem({item: {Poster, Title}}) {
    return <>
        <div className="list-item">
            <h3>{Title}</h3>
            <img src={Poster} alt={Title}/>
        </div>
    </>
}