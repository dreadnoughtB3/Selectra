
import { useState } from "react"
import { useFetcher } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import BasicInfo from "~/components/create/BasicInfo"
import InputParameter from "~/components/create/InputParameter"
import InputQuestions from "~/components/create/InputQuestions"
import InputRecommends from "~/components/create/InputRecommends"
import { Button } from "~/components/ui/button"
import { BasicInfoType } from "~/types/BasicInfoType"
import { QuestionType } from "~/types/QuestionType"
import { RecommendsType } from "~/types/RecommendsType"

const MAX_PHASE = 4
const MIN_PHASE = 1

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();

    const dataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      dataObject[key] = value as string;
    });

    return json({ success: true, data: dataObject });
  } catch (error) {
    console.error('Error processing FormData:', error);
    return json({ success: false, error: 'Failed to process FormData' }, { status: 500 });
  }
};

const Create = () => {

  const [basicInfo, setBasicInfo] = useState<BasicInfoType>({ title: "", author: "", description: "" });
  const [parameters, setParameters] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [recommends, setRecommends] = useState<RecommendsType[]>([]);
  const [currentPhase, setCurrentPhase] = useState(1)

  const fetcher = useFetcher();

  const transformData = () => {
    return {
      title: basicInfo.title,
      userName: basicInfo.author,
      description: basicInfo.description,
      paramsName: parameters,
      recommends: recommends.map(recommend => ({
        ...recommend,
        recommendParams: recommend.recommendParams.reduce((acc, param) => {
          acc[param.paramsName] = param.value;
          return acc;
        }, {} as Record<string, number>)
      })),
      createdAt: new Date().toISOString(),
      questions: questions.map((question, qIndex) => ({
        ...question,
        choices: question.choices.map((choice, cIndex) => ({
          ...choice,
          choiceId: `choice-${qIndex + 1}-${cIndex + 1}`
        }))
      }))
    };
  };

  const handleSubmit = () => {
    const transformedData = transformData();
    console.log(transformedData)
    fetcher.submit(
      { data: JSON.stringify(transformedData) },
      { method: 'POST' }
    );
  };

  const updateBasicInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const renderPhases = () => {
    switch (currentPhase) {
      case 1:
        return <BasicInfo value={basicInfo} updateValue={updateBasicInfo} />;
      case 2:
        return <InputParameter value={parameters} setParam={setParameters} />;
      case 3:
        return <InputQuestions value={questions} parameters={parameters} setQuestions={setQuestions} />
      case 4:
        return <InputRecommends value={recommends} parameters={parameters} setRecommends={setRecommends} />
      default:
        return null;
    }
  }

  const handlePhase = (isFront: boolean) => {
    // 次のフェーズ
    if (isFront && currentPhase != MAX_PHASE) {
      setCurrentPhase(currentPhase + 1)
    // 一個前のフェーズ
    } else if(!isFront && currentPhase != MIN_PHASE) {
      setCurrentPhase(currentPhase - 1)
    }
  }

  return (
    <div className="flex flex-col h-screen items-center mt-12 p-2">
      <div className="w-full max-w-2xl">
        {renderPhases()}
      </div>
      <div className="flex gap-2 mt-3">
        <Button onClick={() => handlePhase(false)}>戻る</Button>
        <Button onClick={() => handlePhase(true)}>次へ</Button>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={fetcher.state === 'submitting'}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {fetcher.state === 'submitting' ? 'Submitting...' : 'Submit Data'}
      </Button>
    </div>
  )
}

export default Create