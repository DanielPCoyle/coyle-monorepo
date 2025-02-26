import algoliasearch from "algoliasearch";
import "instantsearch.css/themes/satellite.css";
import { Configure, Hits, InstantSearch, SearchBox } from "react-instantsearch";
import { Hit } from "./Hit";

if (typeof process === 'undefined') {
  var process = { env: {} };
}

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY,
);

export const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="products_index">
      <Configure hitsPerPage={5} />
      <div className="ais-InstantSearch">
        <SearchBox />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};

export default Search;
