const PHOTOS = ['couple2.jpg', 'couple3.jpg', 'couple4.jpg', 'couple5.jpg', 'couple6.jpg'];

export default function GalleryScreen() {
  return (
    <section className="screen screen-gallery" data-screen-label="Галерея">
      <div className="gallery-title">Наши моменты</div>
      <div className="gallery-grid">
        {PHOTOS.map((photo) => (
          <img key={photo} className="gallery-photo" src={`${import.meta.env.BASE_URL}assets/${photo}`} alt="Мы вместе" />
        ))}
      </div>
    </section>
  );
}
