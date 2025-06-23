import Tiptap from "./_components/TipTap";
import "./styles.scss";

function Dashboard() {
  return (
    <>
      <div className="w-2/3 rounded shadow bg-white text-black darrk:bg-gray-800 p-2">
        <Tiptap />
      </div>
      <div className=" grow bg-white shadow-sm text-black dark:text-white dark:bg-gray-800 rounded p-2">
        Tools
      </div>
    </>
  );
}

export default Dashboard;
