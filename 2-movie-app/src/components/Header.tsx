import Search from "./Search";

interface HeaderProps {
  setSearchTerm: (value: string) => void;
}

const Header = ({ setSearchTerm }: HeaderProps) => {
  return (
    <header>
      <img src="./hero.png" alt="Hero Banner" />
      <h1>
        Find <span className="text-gradient">Movies</span> You'll Enjoy Without
        the Hassle
      </h1>

      <Search setSearchTerm={setSearchTerm} />
    </header>
  );
};

export default Header;
