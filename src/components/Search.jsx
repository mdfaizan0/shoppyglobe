import { useDispatch } from "react-redux"
import { setQuery } from "../utils/searchSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Search({ showSearch, setShowSearch }) {
    // declaring useNavigate and useDispatch
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // handling state to remove searchbar
    function handleRemoveSearch() {
        setShowSearch(!showSearch)
    }

    // dredirecting to ProductList to list items according to search query
    function handleInputChange(e) {
        if (e.target.value.length === 1) navigate("/products/all")
        dispatch(setQuery(e.target.value))
    }

    // Escape keydown to close searchbar, if opened.
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setShowSearch(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <div className="search-component">
            <input type="text" placeholder="Search for products" onChange={handleInputChange} />
            <button onClick={handleRemoveSearch} className="search-cross"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
    )
}

export default Search