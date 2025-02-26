// pages/[...page].tsx
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import navData from "../data/navData.json";
ß
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const router = useRouter();
  const limit = 6;
  const offset = (page - 1) * limit;
  useEffect(() => {
    const url = `https://cdn.builder.io/api/v3/content/blog?apiKey=4836aef3221441d0b11452a63e08992e&offset=${offset}&limit=${limit}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.results);
        console.log(data);
        setTotalPages(data.totalPages);
        setHasMorePosts(data.results.length === limit);
        setLoading(false);
        window.scrollTo(0, 0); // Scroll to top when page changes
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
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
