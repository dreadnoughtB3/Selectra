import { data } from "@remix-run/react";
import { useState, useEffect } from "react"
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";;

const Play = () => {
  const [data, setData] = useState({
    match_title: "パリーグ球団", 
    title: "ソフトバンク"
});

  return (
      <div className="flex w-full h-screen items-center justify-center bg-blue-900">
        <div className="flex flex-col items-center justify-center w-4/5 h-4/5 bg-white">
          <div className="flex flex-col items-center justify-center w-4/5 text-3xl">
            <p className="w-full text-left">あなたにマッチする{ data.match_title }は</p>
            <div className="text-5xl my-10">{ data.title }</div>
            <p className="w-full text-right">です</p>
          </div>
          <Button className="bg-gray-100 text-brack border-4 border-black m-2">
            <Link to="/">トップページへ</Link>
          </Button>
        </div>
      </div>
    )
}

export default Play