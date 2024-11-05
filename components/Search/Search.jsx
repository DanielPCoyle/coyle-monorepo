const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID, process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY);
import { liteClient as algoliasearch } from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import { Hits, InstantSearch, SearchBox, Configure } from "react-instantsearch";

import { Hit } from "./Hit";


export const Search = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="products_index"
    >
      <Configure hitsPerPage={5} />
      <div className="ais-InstantSearch">
        <SearchBox />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};