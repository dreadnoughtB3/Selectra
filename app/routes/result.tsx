import { data } from "@remix-run/react";
import { useState, useEffect } from "react"
import { Link, useLocation } from "@remix-run/react";
import { Button } from "~/components/ui/button";;

const Play = () => {
  const  recommend  =  "softbank" ;

  const location = useLocation();
  // const { recommend, url } = location.state || {};
  

  return (
      <div className="flex w-full h-screen items-center justify-center bg-blue-900">
        <div className="flex flex-col items-center justify-center w-4/5 h-4/5 bg-white">
          <div className="flex flex-col items-center justify-center w-4/5 text-3xl">
            <p className="w-full text-left">あなたにマッチするのは</p>
            <div className="text-5xl my-10">{ recommend }</div>
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