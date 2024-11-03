import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { BasicInfoType } from "~/types/BasicInfoType"

interface BasicInfoProps {
  value: BasicInfoType;
  updateValue: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ value, updateValue}) => {
  return (
    <div>
      <div className="text-2xl text-center font-bold mb-3">マッチング作成: 基本情報</div>
      <div className="max-w-2xl border p-6 w-full rounded-lg">
        <Label htmlFor="title">タイトル</Label>
        <Input
            onChange={(e) => updateValue(e)}
            id="title"
            name="title"
            className="mb-3 h-8 focus-visible:outline-none focus-visible:ring-none"
            placeholder="タイトル"
            value={value.title} />
        <Label htmlFor="author">作成者</Label>
        <Input
            onChange={(e) => updateValue(e)}
            id="author"
            name="author"
            className="mb-3 h-8 focus-visible:outline-none focus-visible:ring-none"
            placeholder="タイトル"
            value={value.author} />
        <Label htmlFor="description">紹介文</Label>
        <Textarea
          onChange={(e) => updateValue(e)}
          id="description"
          name="description"
          className="resize-none"
          placeholder="紹介文"
          value={value.description} />
      </div>
    </div>
  )
}

export default BasicInfo