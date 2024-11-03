import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

import { useState, useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Selectra" },
    { name: "description", content: "サポーターズハッカソン Vol.17用" },
  ];
};

export default function Index() {

  const matchingId = "1f3f2d2f-7c12-4218-ab2e-1512d4d86835";

  useEffect(() => {
    const fetchMatchingData = async () => {
      try {
        const response = await fetch(`https://einx281re1.execute-api.ap-northeast-1.amazonaws.com/prod/matching/match?id=${matchingId}`, {
          method: 'GET',
          // headers: {
          //   'Content-Type': 'application/json'
          // }
        });
        console.log(response.json());

      }catch(error){console.log(error)}
    }
    fetchMatchingData();
    console.log("fetchMatchingData called")
  }, []);

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