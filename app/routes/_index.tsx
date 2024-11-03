import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";


export const meta: MetaFunction = () => {
  return [
    { title: "Selectra" },
    { name: "description", content: "サポーターズハッカソン Vol.17用" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  // const [matchings, setMatchings] = useState([
  //   {
  //     matchingId: "1",
  //     title: "Title1",
  //     description: "こちら説明です。つらつら。おすすめの球団教えますよ。つらつら。説明説明。",
  //     createdAt: "",
  //     authorName: "test太郎"
  //   },
  //   {
  //     matchingId: "2",
  //     title: "Title2",
  //     description: "こちら説明です。つらつら。おすすめの球団教えますよ。つらつら。説明説明。",
  //     createdAt: "",
  //     authorName: "test太郎"
  //   },
  //   {
  //     matchingId: "3",
  //     title: "Title3",
  //     description: "こちら説明です。つらつら。おすすめの球団教えますよ。つらつら。説明説明。",
  //     createdAt: "",
  //     authorName: "test太郎"
  //   },
  //   {
  //     matchingId: "4",
  //     title: "Title4",
  //     description: "こちら説明です。つらつら。おすすめの球団教えますよ。つらつら。説明説明。",
  //     createdAt: "",
  //     authorName: "test太郎"
  //   },
  //   {
  //     matchingId: "5",
  //     title: "Title5",
  //     description: "こちら説明です。つらつら。おすすめの球団教えますよ。つらつら。説明説明。",
  //     createdAt: "",
  //     authorName: "test太郎"
  //   },
  //   {
  //     matchingId: "6",
  //     title: "Title6",
  //     description: "こちら説明です。つらつら。おすすめの球団教えますよ。つらつら。説明説明。",
  //     createdAt: "",
  //     authorName: "test太郎"
  //   }
  // ]);
  const [matchings, setMatchings] = useState([]);

  const handleNavigate = (matchingId) => {
    navigate(`/play`, {state: { matchingId }});
  };

  
  useEffect(() => {
    const fetchMatchingList = async () => {
      try {
        const response = await fetch("https://einx281re1.execute-api.ap-northeast-1.amazonaws.com/prod/matching/list", {
          method: 'GET',
        });
        console.log(response);
        const data = await response.json();
        setMatchings(data);
        console.log("Fetch completed");
      } catch (error) {
        console.error("Error fetching matchings:", error);
      }
    };
    fetchMatchingList();
  }, []);
  
  

  return (
    <div className="flex flex-col  w-full h-screen overflow-y-auto items-center justify-center bg-blue-900">
      <div className="flex flex-col items-center  w-full min-h-full">
        <div className="text-6xl text-white my-5">セレクトラ</div>
        <Button className="bg-gray-100 text-black border-4 border-black m-2">
          <Link to="/create" className="">つくる</Link>
        </Button>
        <div className="text-white">
          あなたにマッチする○○選んでみませんか？
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center w-4/5 gap-10 mt-4">
          {matchings.map((m, index) => (
            <div key={m.matchingId} onClick={ () => handleNavigate(m.matchingId) }
            className="flex flex-col w-1/4 items-center justify-center h-40 bg-blue-50">
              <div className="flex items-center justify-center border border w-full h-3/5 text-xl">{ m.title }</div>
              <div className="border border w-full h-2/5 overflow-hidden text-ellipsis p-1 bg-blue-50">
                <p className="text-xs pb-1">{ m.authorName }</p>
                <p className="truncate">{ m.description }</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}