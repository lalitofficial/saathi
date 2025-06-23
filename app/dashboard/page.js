"use client";
import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

function Dashboard() {
  const articles = useQuery(api.article.getArticles);

  if (articles === undefined) return <p>Loading...</p>;

  return (
    <>
      <div className="rounded m-2 text-black dark:bg-gray-800 p-2">
        <ul className="grid grid-cols-4 gap-2">
          {articles.map((article) => (
            <li key={article._id} className="bg-white shadow m-2 p-3 rounded">
              <a className="text-blue" href={"/editor?key=" + article._id}>
                <strong>{article.articleName}</strong>
              </a>
              <br />
              <hr className="my-2" />
              <p>
                Article ID: <small>{article._id}</small>
              </p>
              <span>
                By <small>{article.createdBy}</small>
              </span>
              <br />
              {/* <p>{article.articleContent}</p> */}
              <small>{new Date(article.creationDate).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Dashboard;
