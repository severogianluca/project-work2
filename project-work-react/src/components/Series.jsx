import axios from "axios"
import { useEffect, useState } from "react"
import SeriesCard from "./SeriesCard"


function Series() {

    const [series, setSeries] = useState([])

    function getSeries() {
        axios.get(import.meta.env.VITE_PUBLIC_PATH + `manga/series`)
            .then(res => {
                setSeries(res.data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getSeries()
    }, [])


    return (

        <>
            <div className="container">
                <h1 className="text-center">Tutte le serie</h1>
                <div className=" row">
                    {series.length ? series.map(series => (
                        <div key={series.id} className="col-12 col-md-4 mt-3">
                            <SeriesCard serie={series} />
                        </div>
                    )) : <div>Nessun elemento trovato</div>}
                </div>
            </div>

        </>
    )
}

export default Series