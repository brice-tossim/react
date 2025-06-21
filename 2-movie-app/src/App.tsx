import { useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import AllMovies from "./components/AllMovies";
import useMovies from "./hooks/useMovies";
import ErrorMessage from "./components/ErrorMessage";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { allMovies, errorMessage, isLoading } = useMovies(searchTerm);

  return (
    <main>
      <div className="wrapper">
        <Header setSearchTerm={setSearchTerm} />

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
