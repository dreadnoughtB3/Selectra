import { data } from "@remix-run/react";
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useFetcher } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const requestBody = JSON.parse(formData.get("requestBody"));

  try {
    const response = await fetch('https://einx281re1.execute-api.ap-northeast-1.amazonaws.com/prod/matching/result_output', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const result = await response.json();
    return json(result);

  } catch (error) {
    console.error('Error processing FormData:', error);
    return json({ success: false, error: 'Failed to process FormData' }, { status: 500 });
  }
};


const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const fetcher = useFetcher();

  const handleResult = async () => {
    const choiceParams = matching.questions.map((q) => ({
      choiceName: q.selectedOption,
      value: q.choices.find(choice => choice.choiceName === q.selectedOption)?.paramChanges[0]?.changeValues || 0
    }));
  
    const requestBody = {
      matchingId: matchingId,
      choiceParams: choiceParams
    };
  
    const formData = new FormData();
    formData.append("requestBody", JSON.stringify(requestBody));
  
    // Fetcherを使ってデータを送信
    await fetcher.submit(formData, { method: "post" });
  
    if (fetcher.data) {
      navigate("/result", { state: { recommend: fetcher.data.recommend, url: fetcher.data.url } });
    }
  };
  
  
  


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
          <Button onClick={ handleResult }
          className="bg-gray-100 text-brack border-4 border-black m-2">
            データ取得
          </Button>
          {/* {fetcher.state === "submitting" ? (
              <p>データを取得中...</p>
            ) : fetcher.data ? (
              // 取得結果の表示
              fetcher.data.error ? (
                <p>{fetcher.data.error}</p>
              ) : (
                <pre>{JSON.stringify(fetcher.data, null, 2)}</pre>
              )
            ) : null} */}
        </div>
      </div>
    )
}

export default Play