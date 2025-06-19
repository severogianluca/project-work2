export default function DiscountBedge({ discount }) {

    const discountBadgeStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '0.15em 0.3em',
        borderRadius: '0.375rem',
        fontSize: '0.85em',
        fontWeight: 'bold',
        width: '50px',
        zIndex: 10
    };

    return (<>
        {discount > 0 && (
            <div style={discountBadgeStyle}>
                -{discount}%
            </div>
        )}
    </>
    )
}