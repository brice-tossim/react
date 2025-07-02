interface SearchProps {
  setSearchTerm: (value: string) => void;
}

const Search = ({ setSearchTerm }: SearchProps) => {
  return (
    <div className="search">
      <div>
        <img src="/search.svg" alt="Search" />
        <input
          type="text"
          placeholder="Search through 300+ movies online"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
