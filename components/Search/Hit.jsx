import { Highlight } from "react-instantsearch";
import { getPropertyByPath } from 'instantsearch.js/es/lib/utils';

export const Hit = ({ hit }) => {
  return (
    <article style={{display:"flex"}}>
      <img className="searchImg" src={'https://cdn.inksoft.com'+hit.Styles[0].ImageFilePath_Front} />
			<div className="hit-title">
        {hit.Name}
			  <Highlight attribute="title" hit={hit} />
			</div>
    </article>
  );
};