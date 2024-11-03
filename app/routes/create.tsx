
import { useEffect, useState } from "react"
import { useFetcher } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { Link } from "@remix-run/react";
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
    const jsonData = JSON.parse(formData.get('data') as string);

    const response = await fetch('https://einx281re1.execute-api.ap-northeast-1.amazonaws.com/prod/matching/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      console.log("データが送信されました")
    }

    const responseData = await response.json();
    if ('error' in responseData) {
      return "error"
    } else {
      return "success"
    }
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
  const [status, setStatus] = useState("")

  const fetcher = useFetcher();

  const transformData = () => {
    return {
      id: "hogehogegiepia",
      title: basicInfo.title,
      authorName: basicInfo.author,
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
    const res = fetcher.submit(
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

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      console.log('Response data:', fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="flex flex-col h-screen items-center mt-12 p-2">
      <div className="w-full max-w-2xl">
        {renderPhases()}
      </div>
      <div className="flex gap-2 mt-3">
        <Button disabled={currentPhase === MIN_PHASE} onClick={() => handlePhase(false)}>戻る</Button>
        <Button disabled={currentPhase === MAX_PHASE} onClick={() => handlePhase(true)}>次へ</Button>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={fetcher.state === 'submitting'}
        className="mt-2 px-12 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {fetcher.state === 'submitting' ? '保存中...' : '保存'}
        {fetcher.state === 'idle' && status ? <p>{status}</p> : <></> }
      </Button>
      <Link to="/" className="border py-2 mt-5 rounded px-4">トップページへ戻る</Link>
    </div>
  )
}

export default Create