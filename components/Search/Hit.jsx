import Link from "next/link";
import PropTypes from 'prop-types';
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

Hit.propTypes = {
  hit: PropTypes.shape({
    ID: PropTypes.string.isRequired,
    Styles: PropTypes.arrayOf(
      PropTypes.shape({
        ImageFilePath_Front: PropTypes.string.isRequired,
      })
    ).isRequired,
    Name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hit;

