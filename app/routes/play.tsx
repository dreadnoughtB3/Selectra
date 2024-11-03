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
  const [currentStatus, setCurrentStatus] = useState(false)

  const fetcher = useFetcher();

  const handleResult = async () => {
    console.log(matching)
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
    setCurrentStatus(true)

    await fetcher.submit(formData, { method: "post" });
  };

  const matchingId = location.state?.matchingId;

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
            selectedOption: null
          }))
        });
      } catch (error) {
        console.error("Error fetching matching data:", error);
      }
    };


    if (fetcher.state === 'idle' && fetcher.data && currentStatus) {
      console.log(fetcher.data)
      navigate("/result", { state: { recommend: fetcher.data.recommend, url: fetcher.data.url } });
    }


    fetchMatchingData();
  }, [fetcher.state]);


  const handleOptionChange = (index: number, value: string) => {
    const newQuestions = matching.questions.map((q, i) =>
      i === index ? { ...q, selectedOption: value } : q
    );
    setMatching({ ...matching, questions: newQuestions });
    console.log(matching)
  };

  

  if ( matching == null ){
    return (
      <>
        <span>Loading...</span>
      </>
    )
  }
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex p-6 flex-col items-center justify-center rounded-lg border">
        <div id="title" className="text-4xl">
          <span className="text-5xl">{ matching.title}</span>
        </div>
        <div id="introduction" className="flex flex-col min-w-fit p-4 items-center justify-center bg-blue-50 border-2 m-3">
          <div>作成者: { matching.authorName }</div>
          <div className="my-1">{ matching.description }</div>
        </div>
        <div id="questions" className="flex flex-col items-center justify-center ">
          { matching.questions.map((q, index) => (
            <div key={index}
            className="flex flex-col w-full px-2 items-center justify-center bg-blue-50 border-2 m-3">
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
          {fetcher.state === 'submitting' ? '照合中...' : '結果を見る'}
        </Button>
      </div>
    </div>
    )
}

export default Play