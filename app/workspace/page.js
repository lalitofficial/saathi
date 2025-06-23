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
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Title Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
            {/* <p>{article.articleContent}</p> */}
          </li>
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Title Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
          </li>
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Keywords Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
          </li>
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Description Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
          </li>
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Description Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
          </li>
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Description Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
          </li>
          <li className="bg-white shadow m-2 p-3 rounded">
            <a className="text-blue" href="#">
              <strong> Description Analyser</strong>
            </a>
            <br />
            <hr className="my-2" />
            <p></p>
            <span></span>
            <br />
          </li>
        </ul>
      </div>
    </>
  );
}

export default Dashboard;
