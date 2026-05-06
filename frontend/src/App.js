import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("PRODUCTOS:", data);
      });
  }, []);

  return (
    <div>
      <h1>Cafecito Feliz ☕</h1>
      <p>Revisa la consola del navegador</p>
    </div>
  );
}

export default App;