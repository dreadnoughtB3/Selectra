import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
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
import { RecommendsType, RecommendsParam } from "~/types/RecommendsType"
import { useState } from "react"


interface InputRecommendsProps {
  value: RecommendsType[];
  parameters: string[];
  setRecommends: React.Dispatch<React.SetStateAction<RecommendsType[]>>
}

const InputRecommends: React.FC<InputRecommendsProps> = ({value, parameters, setRecommends}) => {
  const [newRecommend, setNewRecommend] = useState<RecommendsType>({recommendParams: [], recommendText: "", url: ""})
  const [newParamChange, setNewParamChange] = useState<RecommendsParam>({paramsName: "", value: 0})

  const handleRecommendParam = (val: string, index: string) => {
    setNewRecommend((prevReco) => ({
      ...prevReco,
      [index]: val,
    }))
  }

  const handleParamChange = (val: string | number, index: string) => {
    if (index == "paramsName") {
      setNewParamChange((prevInfo) => ({
        ...prevInfo,
        [index]: String(val),
      }))
    } else if(index == "value") {
      setNewParamChange((prevInfo) => ({
        ...prevInfo,
        [index]: Number(val),
      }))
    }
  }

  const addRecommend = () => {
    if (newRecommend.recommendText == "") {
      return
    }
    setRecommends((prevRecommends) => (
      [...prevRecommends, newRecommend]
    ))
    setNewRecommend({recommendParams: [], recommendText: "", url: ""})
  }

  const addParamChange = (recommendIndex: number) => {
    if (newParamChange.paramsName == "") {
      return
    }
    setRecommends(prevRecos => 
      prevRecos.map((recommend, rIdx) => 
        rIdx === recommendIndex
        ? {
          ...recommend,
          recommendParams: [...recommend.recommendParams, newParamChange]
        }
        : recommend
      )
    )
    setNewParamChange({paramsName: "", value: 0})
  }

  return (
    <div>
      <div className="text-2xl text-center font-bold mb-3">マッチング作成: お勧め作成</div>
      <div className="max-w-2xl border p-6 w-full rounded-lg">
        {
          value.map((recommend, recommendIndex) => {
            return (
              <Accordion type="single" collapsible key={recommendIndex}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex flex-col items-start">
                      <p>{recommend.recommendText}</p>
                      <p className="text-xs text-left">{recommend.url}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-12 border-b">
                      {
                        recommend.recommendParams.map((param, index) => {
                          return (
                            <div className="flex justify-between mr-5 col-span-12 p-2" key={index}>
                              <div>{param.paramsName}</div>
                              <div>{param.value}</div>
                            </div>
                          )
                        })
                      }
                      <div className="flex items-center col-span-9 border-b py-2">
                        <div className=" font-bold px-2">-</div>
                        <Select onValueChange={e => handleParamChange(e, "paramsName")}>
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
                        <Input type="number" name="changeValues" placeholder="基準値" onChange={e => handleParamChange(e.target.value, "value")} />
                      </div>
                      <div className="col border-b content-center">
                        <Button variant="ghost" size="icon" onClick={() => addParamChange(recommendIndex)}><PlusCircle /></Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          })
        }
        <div className="grid grid-cols-12">
          <div className="flex gap-2 items-center col-span-11 py-2">
            <Input placeholder="お勧め1" value={newRecommend.recommendText} onChange={e => handleRecommendParam(e.target.value, "recommendText")} />
            <Input placeholder="URL" value={newRecommend.url} onChange={e => handleRecommendParam(e.target.value, "url")} />
          </div>
          <div className="col content-center">
            <Button variant="ghost" size="icon" onClick={() => addRecommend()}><Plus /></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputRecommends