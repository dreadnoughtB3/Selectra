import { data } from "@remix-run/react";
import { useState, useEffect } from "react"
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";

const Play = () => {
  const navigate = useNavigate();
  const [matching, setMatching] = useState({
    title: "パリーグ球団",
    authorName: "ななし",
    description: "独断と偏見であなたが推すべきパリーグの球団をお教えします！",
    params: [
      "param1",
      "param2",
      "param3"
  ],
    questions: [
      {
        question: "あなたの応援スタイルは？",
        choices: [
          {
            choiceId: 0,
            choiceName: "勝利至上主義",
            paramChanges: [
              {
                targetParamName: "param1",
                changeValues: 100
              }
            ]
          },
          {
            choiceId: 1,
            choiceName: "負けても応援",
            paramChanges: [
              {
                targetParamName: "param1",
                changeValues: 0
              }
            ]
          }
        ]
      },
      {
        question: "住むなら？",
        choices: [
          {
            choiceId: 0,
            choiceName: "田舎",
            paramChanges: [
              {
                targetParamName: "param2",
                changeValues: 100
              }
            ]
          },
          {
            choiceId: 1,
            choiceName: "都会",
            paramChanges: [
              {
                targetParamName: "param2",
                changeValues: 0
              }
            ]
          }
        ]
      },
      {
        question: "お金は好き？",
        choices: [
          {
            choiceId: 0,
            choiceName: "大好き",
            paramChanges: [
              {
                targetParamName: "param3",
                changeValues: 100
              }
            ]
          },
          {
            choiceId: 1,
            choiceName: "そうでもない",
            paramChanges: [
              {
                targetParamName: "param3",
                changeValues: 0
              }
            ]
          }
        ]
      }
    ],
    matchingRule:[
      {
        highestParams: "",
        result: "",
        url: ""
      }
    ]
  });

  const [selectedOption, setSelectedOption] = useState('');

  // const handleOptionChange = (index: number, value: string) => {
  //   const newQuestions = [...matching.questions];
  //   newQuestions[index].selectedOption = value;
  //   setQuestions(newQuestions);
  // };

  const handleOptionChange = (index: number, value: string) => {
    const newQuestions = matching.questions.map((q, i) =>
      i === index ? { ...q, selectedOption: value } : q
    );
    setMatching((prevState) => ({ ...prevState, questions: newQuestions }));
  };

  const handleSubmit = async () => {
    const choiceParams = matching.questions.map((q) => ({
      choiceId: q.selectedOption,
      value: q.choices.find(choice => choice.choiceId === q.selectedOption)?.paramChanges[0]?.changeValues || 0
    }));
    
    const requestBody = {
      matchingId: "exampleMatchingId", // 適切なmatchingIdを設定
      choiceParams: choiceParams
    };

    try {
      const response = await fetch('/matching/result_output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const resultData = await response.json();

      navigate("/result", { state: { recommend: resultData.recommend, url: resultData.url } });

    } catch (error) {
      console.error('Error:', error);
    }
  };

    

  useEffect(() =>{
    fetch("matching/match")
    .then(resp => resp.json())
    .then(matching => setMatching(matching))
    .catch(e => console.log(e))
  },[]);

  return (
      <div className="flex w-full h-screen items-center justify-center bg-blue-900">
        <div className="flex flex-col items-center justify-center w-4/5 h-4/5 bg-white">
          <div id="title" className="text-4xl">
            <p>あなたが推すべき</p>
            <span className="text-5xl">{ matching.title }</span>は？
          </div>
          <div id="introduction" 
          className="flex flex-col items-center justify-center w-3/5 bg-blue-50 border-2 m-3">
            { matching.authorName }
            { matching.description }
          </div>
          <div id="questions" className="flex flex-col items-center justify-center w-3/5">
            {matching.questions.map((q, index) => (
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
                          checked={q.selectedOption === choice.choiceId}
                          onChange={() => handleOptionChange(questionIndex, choice.choiceId)}
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