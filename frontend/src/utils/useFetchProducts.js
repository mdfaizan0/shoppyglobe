import { useEffect, useState } from "react";

// custom hook for getting product list
function useFetchProducts(url) {
    // defining states
    const [data, setData] = useState([])
    const [err, setErr] = useState(null)
    const [loading, setLoading] = useState(true)

    // calling the API using useEffect
    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await fetch(url)
                const json = await resp.json()
                setData(json)
            } catch (error) {
                setErr(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url])
    // returning states of data, err and loading
    return {data, err, loading}
}

export default useFetchProducts