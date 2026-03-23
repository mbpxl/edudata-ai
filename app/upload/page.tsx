import { CenteredLayout } from "@/components/shared"

const Page = () => {
  return (
    <main>
      <CenteredLayout
        className="mt-10"
        heading={"Загрузка данных студентов"}
        text={"Загрузите данные об успеваемости студентов в формате CSV или Excel. Наш ИИ проанализирует данные и предоставит персонализированные инсайты."}
      />
    </main>
  )
}

export default Page