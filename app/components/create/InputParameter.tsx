import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Plus, X } from "lucide-react"
import React, { useState } from "react"

interface InputParameterProps {
  value: string[];
  setParam: React.Dispatch<React.SetStateAction<string[]>>
}

const InputParameter: React.FC<InputParameterProps> = ({ value, setParam }) => {
  const [newParam, setNewParam] = useState("")

  const addParam = () => {
    if (newParam != "") {
      setParam(value.concat([newParam]))
      setNewParam("")
    }
  }

  const removeParam = (index: number) => {
    const copied_array = [...value]
    copied_array.splice(index,1)
    setParam(copied_array)
  }

  return (
    <div>
      <div className="text-2xl text-center font-bold mb-3">マッチング作成: パラメータ作成</div>
      <div className="max-w-2xl border p-6 w-full rounded-lg">
        <div className="grid grid-cols-12 border-t">
          {value.map((item, index) => {
            return (
              <div className="flex px-2 items-center justify-between col-span-12 border-b" key={index}>
                <div>{item}</div>
                <Button variant="ghost" size="icon" onClick={() => removeParam(index)}><X /></Button>
              </div>
            )
          })}
          <div className="col-span-11 border-b py-2">
            <Input placeholder="パラメーター1" value={newParam} onChange={(e) => setNewParam(e.target.value)} />
          </div>
          <div className="border-b content-center">
            <Button variant="ghost" size="icon" onClick={() => addParam()}><Plus /></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputParameter