import { useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import AllMovies from "./components/AllMovies";
import useMoviesHook from "./hooks/use-movies.hook.ts";
import ErrorMessage from "./components/ErrorMessage";
import Metrics from "./components/Metrics.tsx";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { metrics, allMovies, errorMessage, isLoading } =
    useMoviesHook(searchTerm);

  return (
    <main>
      <div className="wrapper">
        <Header setSearchTerm={setSearchTerm} />
        <Metrics metrics={metrics} />

        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <ErrorMessage errorMessage={errorMessage} />
        ) : (
          <AllMovies movies={allMovies} />
        )}
      </div>
    </main>
  );
};

export default App;
