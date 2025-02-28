// pages/[...page].tsx
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/layout/Footer";
import Navigation from "../components/layout/Navigation";
import navData from "../data/navData.json";

interface Post {
  data: {
    slug: string;
    featuredImage: string;
    title: string;
    tagLine: string;
  };
  createdDate: string;
}

// Main Page component
const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const limit = 6;
  const offset = (page - 1) * limit;
  useEffect(() => {
    const url = `https://cdn.builder.io/api/v3/content/blog?apiKey=4836aef3221441d0b11452a63e08992e&offset=${offset}&limit=${limit}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.results);
        console.log(data);
        setHasMorePosts(data.results.length === limit);
        window.scrollTo(0, 0); // Scroll to top when page changes
      })
      .catch(() => {
        setHasMorePosts(false);
      });
  }, [page]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* <SEOHeader seo={seo} productData={productData} /> */}
      <div className="navContainer">
        <Navigation navData={navData} />
      </div>
      <div className="pageContainer">
        <h1>PhilaPrints&apos; Latest Posts</h1>
        <div className="blogList">
          {posts.map((post) => {
            return (
              <Link
                href={"/post/" + post.data.slug}
                key={post.data.slug}
                className="blogItem"
              >
                <div>
                  <div className="image">
                    <img src={post.data.featuredImage} alt={post.data.title} />
                  </div>
                  <div className="postDate">
                    {moment(post.createdDate).format("MMMM Do, YYYY")}
                  </div>
                  <h2>{post.data.title}</h2>
                  <div className="tagLine">
                    <p>{post.data.tagLine}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Newer
          </button>
          <button onClick={handleNextPage} disabled={!hasMorePosts}>
            Older
          </button>
        </div>
      </div>
      <React.Suspense fallback={<div>Loading...</div>}></React.Suspense>
      <Footer />
    </>
  );
};

export default Page;
