import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Selectra" },
    { name: "description", content: "サポーターズハッカソン Vol.17用" },
  ];
};

export default function Index() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <p>トップページ</p>
    </div>
  );
}