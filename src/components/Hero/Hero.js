export default function Hero() {
  return (
    <section style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🐾 Притулок для собак</h1>
      <p><strong>Допоможи знайти дім кожній собаці</strong></p>
      <img
        src="/dog.jpg"
        alt="Собака шукає дім"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px", margin: "1rem auto" }}
      />
    </section>
  );
}
