import Link from "next/link";
import { Highlight } from "react-instantsearch";
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

