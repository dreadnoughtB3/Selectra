import { data } from "@remix-run/react";
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { Button } from "~/components/ui/button";

const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [matching, setMatching] = useState({
  //   title: "パリーグ球団",
  //   authorName: "ななし",
  //   description: "独断と偏見であなたが推すべきパリーグの球団をお教えします！",
  //   params: [
  //     "param1",
  //     "param2",
  //     "param3"
  // ],
  //   questions: [
  //     {
  //       question: "あなたの応援スタイルは？",
  //       choices: [
  //         {
  //           choiceId: "0",
  //           choiceName: "勝利至上主義",
  //           paramChanges: [
  //             {
  //               targetParamName: "param1",
  //               changeValues: 100
  //             }
  //           ]
  //         },
  //         {
  //           choiceId: "1",
  //           choiceName: "負けても応援",
  //           paramChanges: [
  //             {
  //               targetParamName: "param1",
  //               changeValues: 0
  //             }
  //           ]
  //         }
  //       ],
  //       selectedOption: null
  //     },
  //     {
  //       question: "住むなら？",
  //       choices: [
  //         {
  //           choiceId: "0",
  //           choiceName: "田舎",
  //           paramChanges: [
  //             {
  //               targetParamName: "param2",
  //               changeValues: 100
  //             }
  //           ]
  //         },
  //         {
  //           choiceId: "1",
  //           choiceName: "都会",
  //           paramChanges: [
  //             {
  //               targetParamName: "param2",
  //               changeValues: 0
  //             }
  //           ]
  //         }
  //       ],
  //       selectedOption: null
  //     },
  //     {
  //       question: "お金は好き？",
  //       choices: [
  //         {
  //           choiceId: "0",
  //           choiceName: "大好き",
  //           paramChanges: [
  //             {
  //               targetParamName: "param3",
  //               changeValues: 100
  //             }
  //           ]
  //         },
  //         {
  //           choiceId: "1",
  //           choiceName: "そうでもない",
  //           paramChanges: [
  //             {
  //               targetParamName: "param3",
  //               changeValues: 0
  //             }
  //           ]
  //         }
  //       ],
  //       selectedOption: null
  //     }
  //   ]
  // });
  // const [matching, setMatching] = useState<Matching | null>(null);
  interface Matching {
    title: string;
    authorName: string;
    description: string;
    params: string[];
    questions: {
      question: string;
      choices: {
        choiceId: string;
        choiceName: string;
        paramChanges: {
          targetParamName: string;
          changeValues: number;
        }[];
      }[];
      selectedOption: string | null;
    }[];
    matchingRule: {
      highestParams: string;
      result: string;
      url: string;
    }[];
  }

  const [matching, setMatching] = useState(null);


  const matchingId =  location.state?.matchingId;
  // const matchingId = "1f3f2d2f-7c12-4218-ab2e-1512d4d86835";

  useEffect(() => {
    const fetchMatchingData = async () => {
      try {
        const response = await fetch(`https://einx281re1.execute-api.ap-northeast-1.amazonaws.com/prod/matching/match?id=${matchingId}`, {
          method: 'GET',
        });
        const data: Matching = await response.json();
        
        setMatching({
          ...data,
          questions: data.questions.map(q => ({
            ...q,
            selectedOption: null // selectedOptionを初期化
          }))
        });
      } catch (error) {
        console.error("Error fetching matching data:", error);
      }
    };

    fetchMatchingData();
  }, []);


  const handleOptionChange = (index: number, value: string) => {
    const newQuestions = matching.questions.map((q, i) =>
      i === index ? { ...q, selectedOption: value } : q
    );
    setMatching({ ...matching, questions: newQuestions });
  };

  const handleSubmit = async () => {
    const choiceParams = matching.questions.map((q) => ({
      choiceName: q.selectedOption,
      value: q.choices.find(choice => choice.choiceName === q.selectedOption)?.paramChanges[0]?.changeValues || 0
    }));
    
    const requestBody = {
      // matchingId: matchingId, // 適切なmatchingIdを設定
      // choiceParams: choiceParams
      matchingId: "1f3f2d2f-7c12-4218-ab2e-1512d4d86835",
      choiceParams:  [{"choiceName": "和食好き", "value": 10}, {"choiceName": "洋食好き", "value": 0}, {"choiceName": "辛さ耐性", "value": 5}, {"choiceName": "ベジタリアン適性", "value": 0}]
    };

    console.log(requestBody);

    try {
      const response = await fetch('https://einx281re1.execute-api.ap-northeast-1.amazonaws.com/prod/matching/result_output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content_Type'
        },
        body: JSON.stringify(requestBody)
      });

      const resultData = await response.json();

      navigate("/result", { state: { recommend: resultData.recommend, url: resultData.url } });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  if ( matching == null ){
    return (
      <>
        <span>Loading...</span>
      </>
    )
  }
  return (
      <div className="flex w-full h-screen items-center justify-center bg-blue-900">
        <div className="flex flex-col items-center justify-center w-4/5 h-4/5 bg-white">
          <div id="title" className="text-4xl">
            <span className="text-5xl">{ matching.title}</span>
          </div>
          <div id="introduction" 
          className="flex flex-col items-center justify-center w-3/5 bg-blue-50 border-2 m-3">
            { matching.authorName}
            { matching.description }
          </div>
          <div id="questions" className="flex flex-col items-center justify-center w-3/5">
            { matching.questions.map((q, index) => (
              <div key={index}
              className="flex flex-col items-center justify-center w-full bg-blue-50 border-2 m-3">
                <div className="flex flex-col items-center justify-center w-full">
                  <p>Q.{index+1}, {q.question}</p>
                  <div>
                    {q.choices.map((choice, choiceIndex) => (
                      <label key={choiceIndex} className="mx-2">
                        {choice.choiceName}
                        <input
                          type="radio"
                          value={choice.choiceId}
                          checked={q.selectedOption === choice.choiceName}
                          onChange={() => handleOptionChange(index, choice.choiceName)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
            </div>
            ))}
          </div>
          <Button onClick={ handleSubmit }
          className="bg-gray-100 text-brack border-4 border-black m-2">
            <Link to="/result">結果へ</Link>
          </Button>
        </div>
      </div>
    )
}

export default Play