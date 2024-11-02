import { data } from "@remix-run/react";
import { useState, useEffect } from "react"
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

const Play = () => {
  const [matching, setMatching] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [questions, setQuestions] = useState([
    {
      question: "What is your favorite color?",
      choice1: "Red",
      choice2: "Blue",
      selectedOption: ""
    },
    {
      question: "What is your favorite animal?",
      choice1: "Dog",
      choice2: "Cat",
      selectedOption: ""
    },
    {
      question: "What is your favorite food?",
      choice1: "Pizza",
      choice2: "Sushi",
      selectedOption: ""
    }
  ]);

  const handleOptionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].selectedOption = value;
    setQuestions(newQuestions);
  };
    

  // useEffect(() =>{
  //   fetch("matching/match")
  //   .then(resp => resp.json())
  //   .then(matching => setMatching(matching))
  //   .catch(e => console.log(e))
  // },[]);

  return (
      <div className="flex w-full h-screen items-center justify-center bg-blue-900">
        <div className="flex flex-col items-center justify-center w-4/5 h-4/5 bg-white">
          <div id="title" className="text-4xl">
            <p>あなたが推すべき</p>
            <span className="text-5xl">〇〇</span>は？
          </div>
          <div id="introduction" 
          className="flex flex-col items-center justify-center w-3/5 bg-blue-50 border-2 m-3">
            あいさつ。説明。
          </div>
          <div id="questions" className="flex flex-col items-center justify-center w-3/5">
            {questions.map((q, index) => (
              <div 
              className="flex flex-col items-center justify-center w-full bg-blue-50 border-2 m-3">
                <div key={index} className="flex flex-col items-center justify-center w-full">
                  <p>Q.{index+1}, {q.question}</p>
                  <div>
                    <label className="mx-2">
                      { q.choice1 }
                      <input
                      type="radio"
                      value="option1"
                      checked={q.selectedOption === 'option1'}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </label>
                    <label className="mx-2">
                      <input
                      type="radio"
                      value="option2"
                      checked={q.selectedOption === 'option2'}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </label>
                    <label className="mx-2">
                      <input
                      type="radio"
                      value="option3"
                      checked={q.selectedOption === 'option3'}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </label>
                    <label className="mx-2">
                      <input
                      type="radio"
                      value="option4"
                      checked={q.selectedOption === 'option4'}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                      { q.choice2 }
                    </label>
                  </div>
                </div>
            </div>
            ))}
          </div>
          <Button className="bg-gray-100 text-brack border-4 border-black m-2">
            <Link to="/play">結果へ</Link>
          </Button>
        </div>
      </div>
    )
}

export default Play