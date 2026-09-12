import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Hank 的小工具箱．用 Next.js 打造</p>
        <div className="flex gap-4">
          <Link href="/lottery" className="hover:text-gray-800">
            抽獎轉盤
          </Link>
          <Link href="/pomodoro" className="hover:text-gray-800">
            番茄鐘
          </Link>
          <Link href="/fortune" className="hover:text-gray-800">
            好運抽籤
          </Link>
        </div>
      </div>
    </footer>
  );
}
