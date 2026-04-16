import { AiInfoTitle, Card, CenteredLayout, Container, Title } from "@/components/shared";
import { Button } from "@/components/ui";
import { ArrowRight, Brain, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function MainPage() {
  return (
    <main>
      <section className="bg-blue-50 pb-13">
        <Container className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <AiInfoTitle className="mt-10" />
            <Title size="xl" className="font-extrabold mb-5" text={"Персонализируйте обучение студентов с помощью ИИ"} />
            <Title size="sm" className="font-extralight mb-5" text={"Преобразуйте исходные данные студентов в практические идеи. Наш ИИ анализирует модели успеваемости, выявляет пробелы в обучении и предоставляет персонализированные рекомендации для каждого студента."} />

            <div className="flex gap-4">
              <Link href="/upload">
                <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                  Начать
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Узнать больше
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              className="w-full h-103.5 object-cover"
              src="/img/intro.jpg"
              alt="intro"
            />
          </div>
        </Container>
      </section>

      <Container>
        <CenteredLayout
          className="my-17"
          heading={"Интеллектуальный анализ данных"}
          text={"Используйте передовые алгоритмы ИИ для раскрытия инсайтов, скрытых в данных ваших студентов"}
        />

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <Card title={"Анализ на основе ИИ"} text={"Продвинутые модели машинного обучения анализируют модели успеваемости студентов и прогнозируют результаты обучения"} icon={Brain} bgColor={"blue"} />
          <Card title={"Отслеживание успеваемости"} text={"Визуализируйте прогресс студентов с помощью интерактивных графиков и комплексных панелей управления"} icon={TrendingUp} bgColor={"purple"} />
          <Card title={"Персонализированные инсайты"} text={"Получайте индивидуальные рекомендации для каждого студента на основе их уникального профиля обучения"} icon={Users} bgColor={"green"} />
        </section>
      </Container>


      <section className="py-20 bg-linear-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Готовы преобразовать ваши данные?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Загрузите данные студентов и начните получать практические инсайты за считанные секунды
          </p>
          <Link href="/upload">
            <Button size="lg" variant="secondary" className="px-10">
              Загрузить данные
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
