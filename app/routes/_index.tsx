import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Selectra" },
    { name: "description", content: "サポーターズハッカソン Vol.17用" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col  w-full h-screen items-center justify-center">
      <div className="text-3xl">トップページ</div>
      <div className="flex flex-row gap-3 mt-4">
        <Button>
          <Link to="/play" className="">遊ぶページ</Link>
        </Button>
        <Button>
          <Link to="/create" className="">作成ページ</Link>
        </Button>
      </div>
    </div>
  );
}