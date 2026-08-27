interface ResultPageProps {
  price: number;
}

function ResultPage({ price }: ResultPageProps) {
  return (
    <main>
      <h1>Prediction Result</h1>
      <h2>Predicted Price</h2>
      <p>{price.toLocaleString()}</p>
    </main>
  );
}

export default ResultPage;
