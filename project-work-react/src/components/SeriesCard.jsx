import { Link } from "react-router-dom"

function SeriesCard({ serie }) {
    return (
        <div className="card border-0 shadow-lg rounded-4 h-100 bg-white position-relative overflow-hidden anime-card">
            <img
                className="card-img-top  rounded-top-4"
                src={serie.imagePath}
                alt={serie.name}
                style={{
                    height: "260px",
                    objectFit: "cover",
                    backgroundColor: "#f8f8f8", // per riempire eventuali spazi vuoti
                }}
            />

            <div className="card-body d-flex flex-column">
                <h5 className="fw-bold text-dark">{serie.name}</h5>
                <p className="text-muted small flex-grow-1" style={{ minHeight: "60px" }}>
                    {serie.description.length > 100
                        ? serie.description.slice(0, 100) + "..."
                        : serie.description}
                </p>
                <p className="text-secondary small">📚 {serie.number_volumes} volumi</p>
                <Link
                    to={`/serie/${serie.slug}`}
                    className="btn btn-primary w-100 mt-auto rounded-pill fw-semibold"
                >
                    Tutti i volumi
                </Link>
            </div>
        </div>
    );
}

export default SeriesCard;
