import { Highlight } from "react-instantsearch";
import { getPropertyByPath } from "instantsearch.js/es/lib/utils";
import Link from "next/link";
export const Hit = ({ hit }) => {
  return (
    <Link href={"/products/" + hit.ID}>
      <article style={{ display: "flex" }}>
        <img
          className="searchImg"
          src={"https://cdn.inksoft.com" + hit.Styles[0].ImageFilePath_Front}
        />
        <div className="hit-title">
          {hit.Name}
          <Highlight attribute="title" hit={hit} />
        </div>
      </article>
    </Link>
  );
};
