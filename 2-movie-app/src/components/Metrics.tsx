import type { MetricDocument } from "../types";

interface MetricsProps {
  metrics: MetricDocument[];
}

const Metrics = ({ metrics }: MetricsProps) => {
  return (
    <>
      {metrics.length > 0 && (
        <section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {metrics.map((metric: MetricDocument, index: number) => (
              <li key={metric.$id}>
                <p>{index + 1}</p>
                <img src={metric.poster_path} alt="Movie poster" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default Metrics;
