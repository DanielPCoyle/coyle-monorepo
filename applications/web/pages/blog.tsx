import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/layout/Footer";
import Navigation from "../components/layout/Navigation";
import navData from "../data/navData.json";
import Image from "next/image";
import { ChatCaddy } from "@coyle/chat-ui/src/ChatCaddy";

interface Post {
  data: {
    slug: string;
    featuredImage: string;
    title: string;
    tagLine: string;
  };
  createdDate: string;
}

interface PageProps {
  initialPosts: Post[];
  initialPage: number;
  hasMorePosts: boolean;
}

const limit = 6;

// Main Page component
const Page: React.FC<PageProps> = ({
  initialPosts,
  initialPage,
  hasMorePosts,
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(hasMorePosts);

  const handleNextPage = async () => {
    const nextPage = page + 1;
    const offset = (nextPage - 1) * limit;
    const apiUrl = `https://cdn.builder.io/api/v3/content/blog?apiKey=4836aef3221441d0b11452a63e08992e&offset=${offset}&limit=${limit}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    setPosts(data.results);
    setPage(nextPage);
    setHasMore(data.results.length === limit);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = async () => {
    if (page > 1) {
      const prevPage = page - 1;
      const offset = (prevPage - 1) * limit;
      const apiUrl = `https://cdn.builder.io/api/v3/content/blog?apiKey=4836aef3221441d0b11452a63e08992e&offset=${offset}&limit=${limit}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      setPosts(data.results);
      setPage(prevPage);
      setHasMore(data.results.length === limit);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="navContainer">
        <Navigation navData={navData} />
      </div>
      <div className="pageContainer">
        <h1>PhilaPrints&apos; Latest Posts</h1>
        <div className="blogList">
          {posts.map((post) => (
            <Link
              href={`/post/${post.data.slug}`}
              key={post.data.slug}
              className="blogItem"
            >
              <div>
                <div className="image">
                  <Image
                    src={post.data.featuredImage}
                    alt={post.data.title}
                    width={500}
                    height={300}
                  />
                </div>
                <div className="postDate">
                  {moment(post.createdDate).format("MMM D, YYYY")}
                </div>
                <h2>{post.data.title}</h2>
              </div>
            </Link>
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Newer
          </button>
          <button onClick={handleNextPage} disabled={!hasMore}>
            Older
          </button>
        </div>
      </div>
      <ChatCaddy />

      <Footer />
    </>
  );
};

// Server-Side Rendering (SSR) - Fetch posts on each request
export async function getServerSideProps(context: any) {
  const page = parseInt(context.query.page as string, 10) || 1;
  const offset = (page - 1) * limit;
  const apiUrl = `https://cdn.builder.io/api/v3/content/blog?apiKey=4836aef3221441d0b11452a63e08992e&offset=${offset}&limit=${limit}`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  return {
    props: {
      initialPosts: data.results || [],
      initialPage: page,
      hasMorePosts: data.results.length === limit,
    },
  };
}

export default Page;
