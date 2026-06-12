const categories = [
  "Alojamientos boutique",
  "Glampings",
  "Cabañas",
  "Fincas turísticas",
  "Tours",
  "Experiencias gastronómicas",
  "Aventura",
  "Turismo rural",
  "Restaurantes destino",
  "Bienestar turístico",
];

export default function TrustBar() {
  const tickerItems = [...categories, ...categories];

  return (
    <section className="trust-ticker-section border-b hairline" aria-label="Categorias de negocios">
      <div className="lk-container">
        <div className="trust-ticker">
          <div className="trust-ticker-window">
            <div className="trust-ticker-track">
              {tickerItems.map((category, index) => (
                <span key={`${category}-${index}`} className="trust-ticker-item">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
