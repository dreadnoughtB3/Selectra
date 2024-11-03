import { QuestionType, ParamChangesType } from "~/types/QuestionType"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { PlusCircle, Plus } from 'lucide-react'
import { useState } from "react"

interface InputQuestionsProps {
  value: QuestionType[];
  parameters: string[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>
}

const InputQuestions: React.FC<InputQuestionsProps> = ({value, parameters, setQuestions}) => {
  const [newQuestioName, setNewQuestioName] = useState("");
  const [newParamChange, setNewParamChange] = useState<ParamChangesType>({targetParamName: "", changeValues: 0})

  const handleParamChange = (val: number | string, type: string) => {
    if (type == "string") {
      setNewParamChange((prevInfo) => ({
        ...prevInfo,
        ["targetParamName"]: String(val),
      }))
    } else {
      setNewParamChange((prevInfo) => ({
        ...prevInfo,
        ["changeValues"]: Number(val),
      }))
    }
  }

  const addParamChange = (questionIndex: number, choiceIndex: number) => {
    if (newParamChange.targetParamName == "") {
      return
    }
    setQuestions(prevQuestions =>
      prevQuestions.map((question, qIdx) =>
        qIdx === questionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, cIdx) =>
                cIdx === choiceIndex
                  ? {
                      ...choice,
                      paramChanges: [...choice.paramChanges, newParamChange]
                    }
                  : choice
              )
            }
          : question
      )
    );

  };

  const addQuestion = () => {
    if (newQuestioName != "") {
      const newQuestion = {
        question: newQuestioName,
        choices: [
          { choiceName: "", paramChanges: [] },
          { choiceName: "", paramChanges: [] }
        ]
      }
      setQuestions([...value, newQuestion])
      setNewQuestioName("")
    }
  }

  const updateChoiceName = (questionIndex: number, choiceIndex: number, newOptionName: string) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, qIdx) =>
        qIdx === questionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, cIdx) =>
                cIdx === choiceIndex ? { ...choice, choiceName: newOptionName } : choice
              )
            }
          : question
      )
    );
  };

  return (
    <div>
      <div className="text-2xl text-center font-bold mb-3">マッチング作成: 質問作成</div>
      <div className="max-w-2xl border p-6 w-full rounded-lg">
        {value.map((question, questionIndex) => {
          return (
            <Accordion type="single" collapsible key={questionIndex}>
            <AccordionItem className="" value="item-1">
              <AccordionTrigger className="p-2 h-10">{question.question}</AccordionTrigger>
              <AccordionContent>
                {question.choices.map((choice, choiceIndex) => {
                  return (
                    <Accordion type="single" collapsible key={choiceIndex}>
                    <AccordionItem className="border-b-0" value="item-1">
                      <AccordionTrigger className="p-2 bg-gray-900 text-white h-10 mb-1">質問{choiceIndex+1}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-12 border-b">
                        <Input className="col-span-12" name="changeValues" placeholder="質問名" onChange={(e) => updateChoiceName(questionIndex, choiceIndex, e.target.value)} />
                          {choice.paramChanges.map((paramChange, index) => {
                            return (
                            <div className="flex justify-between mr-5 col-span-12 p-2" key={index}>
                              <div>{paramChange.targetParamName}</div>
                              <div>{paramChange.changeValues}</div>
                            </div>
                            )
                          })}

                          <div className="flex items-center col-span-9 border-b py-2">
                            <div className=" font-bold px-2">-</div>
                            <Select onValueChange={e => handleParamChange(e, "string")}>
                              <SelectTrigger >
                                <SelectValue placeholder="パラメーター" />
                              </SelectTrigger>
                              <SelectContent>
                                {parameters.map((param, index) => {
                                  return (
                                    <SelectItem key={index} value={param}>{param}</SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 px-2 border-b py-2">
                            <Input type="number" name="changeValues" placeholder="増減値" onChange={(e) => handleParamChange(e.target.value, "number")} />
                          </div>
                          <div className="col border-b content-center">
                            <Button variant="ghost" size="icon" onClick={() => addParamChange(questionIndex, choiceIndex)}><PlusCircle /></Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          )
        })}
        <div className="grid grid-cols-12">
          <div className="flex items-center col-span-11 py-2">
            <Input placeholder="質問1" value={newQuestioName} onChange={(e) => setNewQuestioName(e.target.value)} />
          </div>
          <div className="col content-center">
            <Button variant="ghost" size="icon" onClick={() => addQuestion()}><Plus /></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputQuestions