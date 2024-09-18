import React, { useCallback, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useQuery } from "@apollo/client";
import PostFeed from "../components/PostFeed";
import { GET_ALL_POSTS } from "../graphql/queries/GetPosts";
import { Post } from "../gql/graphql";

function Feed() {
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  const { data, fetchMore } = useQuery(GET_ALL_POSTS, {
    variables: { skip: 0, take: 2 },
  });

  const loadMorePosts = useCallback(async () => {
    try {
      await fetchMore({
        variables: {
          skip: data?.getPosts.length || 0,
          take: 2,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const newPosts = fetchMoreResult.getPosts.filter(
            (newPost: Post) =>
              !prev.getPosts.some((post: Post) => post.id === newPost.id)
          );
          return {
            getPosts: [...prev.getPosts, ...newPosts],
          };
        },
      });
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  }, [data?.getPosts.length, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    const loadMoreCurrentRef = loadMoreRef.current;
    if (loadMoreCurrentRef) {
      observer.observe(loadMoreCurrentRef);
    }

    return () => {
      if (loadMoreCurrentRef) {
        observer.unobserve(loadMoreCurrentRef);
      }
    };
  }, [loadMorePosts]);

  return (
    <MainLayout>
      <div className="pt-[80px] w-[calc(100%-90px)] max-w-[690px] ">
        {data?.getPosts.map((post: Post) => (
          <PostFeed key={post.id} post={post} />
        ))}
        <div className="h-20" ref={loadMoreRef}></div>
      </div>
    </MainLayout>
  );
}

export default Feed;
