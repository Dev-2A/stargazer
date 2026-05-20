import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-night-950 text-night-100 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌠</div>
        <h1 className="text-3xl font-bold text-astral-200">길을 잃은 별</h1>
        <p className="mt-4 text-night-300">이 경로엔 별이 보이지 않아요.</p>
        <Link
          to="/"
          className="inline-block mt-8 px-5 py-2 rounded-lg bg-astral-500 text-white hover:bg-astral-400 transition shadow-lg shadow-astral-900/30"
        >
          천구로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
