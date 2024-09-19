import { useEffect, useRef } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { GetCommentsByPostIdQuery, Post } from "../gql/graphql";
import { GET_COMMENTS_BY_POST_ID } from "../graphql/queries/GetCommentsByPostId";
import { useQuery } from "@apollo/client";

function PostFeed({ post }: { post: Post }) {
  const navigate = useNavigate();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    video.current?.play();
  });

  const { data, loading, error } = useQuery<GetCommentsByPostIdQuery>(
    GET_COMMENTS_BY_POST_ID,
    {
      variables: { postId: post.id },
    }
  );

  const handleNavigate = () => navigate(`/post/${post.id}`);

  return (
    <div id="PostFeed" className="flex  border-b py-6">
      <div className="cursor-pointer">
        <img
          className="rounded-full max-h-[60px]"
          width="60"
          src={post.user.image ?? "https://picsum.photos/id/83/300/320"}
        />
      </div>
      <div className="pl-3 w-full px-4">
        <div className="flex items-center justify-between pb-0.5">
          <Link to={`/profile/${post.user.id}`}>
            <span className="font-bold hover:underline cursor-pointer">
              {post.user.fullname}
            </span>
          </Link>

          <button className="border text-[15px] px-[21px] py-.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
            Follow
          </button>
        </div>
        <div className="text-[15px] pb-0.5 break-words md:max-w-[480px] max-w-[300px]">
          {post.text}
        </div>
        <div className="text-[14px] text-gray-500 pb-0.5">
          #fun #cool #superAwesome
        </div>
        <div className="text-[14px] pb-0.5 flex itesm-center font-semibold">
          <BsMusicNoteBeamed size="17" />
          <div className="px-1">original - Awesome </div>
          <AiFillHeart size="20" />
        </div>
        <div className="mt-2.5 flex">
          <div className="relative cursor-pointer min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl">
            <video
              onClick={handleNavigate}
              ref={video}
              src={import.meta.env.VITE_DB_URL + post.video}
              loop
              muted
              className="rounded-xl object-cover mx-auto h-full"
            />
            <img
              className="absolute right-2 bottom-14"
              width="90"
              src="src/assets/images/tiktok-logo-white.png"
            />
          </div>
          <div className="relative mr-[75px]">
            <div className="absolute bottom-0 pl-2">
              <button
                onClick={handleNavigate}
                className="rounded-full bg-gray-200 p-2 cursor-pointer"
              >
                <AiFillHeart size="25" color="black" />
              </button>
              <span className="text-xs text-gray-800 font-semitbold">
                {post.likes?.length}
              </span>

              {/* <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                <IoIosShareAlt size="25" color="black" />
              </button>
              <span className="text-xs text-gray-800 font-semitbold">34</span> */}

              <button
                onClick={handleNavigate}
                className="rounded-full bg-gray-200 p-2 cursor-pointer"
              >
                <IoChatbubbleEllipses size="25" color="black" />
              </button>
              <span className="text-xs text-gray-800 font-semitbold">
                {" "}
                {data?.getCommentsByPostId.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostFeed;
