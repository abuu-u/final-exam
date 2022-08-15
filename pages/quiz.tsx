import Loading from 'common/loading'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AmountOptions } from 'pages'
import { MouseEventHandler, useEffect, useState } from 'react'
import { urls } from 'shared/urls'

interface TestResponse {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

interface Test {
  category: string
  type: string
  difficulty: string
  question: string
  userAnswer?: number
  correctAnswer: number
  answers: string[]
}

const testResponseToTest = ({
  category,
  type,
  difficulty,
  question,
  correct_answer,
  incorrect_answers,
}: TestResponse): Test => {
  const answers = incorrect_answers
  const correctAnswer = Math.round(Math.random() * incorrect_answers.length)
  answers.splice(correctAnswer, 0, correct_answer)

  return {
    category,
    type,
    difficulty,
    question,
    answers,
    correctAnswer,
  }
}

const Quiz: NextPage = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [tests, setTests] = useState<Test[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (router.isReady) {
      const amount =
        Number(router.query.amount) || Number(AmountOptions[0].value)

      const fetchTests = async () => {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${amount}&category=9&difficulty=easy&type=multiple`,
        )
        setTests(
          ((await response.json()) as { results: TestResponse[] }).results.map(
            (element) => testResponseToTest(element),
          ),
        )
        setIsLoading(false)
      }

      fetchTests()
    }
  }, [router.isReady, router.query.amount])

  useEffect(() => {
    if (
      !isFinished &&
      tests.length > 0 &&
      tests.filter((it) => it.userAnswer !== undefined).length === tests.length
    ) {
      setIsFinished(true)
      setShowResults(true)
    }
  }, [current, isFinished, tests, tests.length])

  const handleTestNumberClick = (index: number) => {
    setCurrent(index)
  }

  const handleAnswerClick = (index: number) => {
    if (tests[current].userAnswer === undefined && !isFinished) {
      const testsCopy = [...tests]
      testsCopy[current].userAnswer = index
      setTests(testsCopy)
    }
  }

  const handleFinish = () => {
    setTests(tests.map((it) => ({ ...it, userAnswer: it.userAnswer ?? -1 })))
    setIsFinished(true)
    setShowResults(true)
  }

  const handlePreviousClick = () => setCurrent(current - 1)

  const handleNextClick = () => setCurrent(current + 1)

  const hideResults = () => setShowResults(false)

  const handleOutsideClick: MouseEventHandler<HTMLDivElement> = (event_) => {
    if (event_.target === event_.currentTarget) {
      hideResults()
    }
  }

  return (
    <>
      <header className="bg-gray-200 mb-6">
        <nav className="container flex justify-between items-center font text-lg p-2">
          <Link href={urls.HOME}>
            <a className="p-3 hover:bg-gray-100 duration-300">FinalExam</a>
          </Link>
          {current + 1}/{tests.length}
          <button
            className="p-2 rounded-md bg-red-500 text-white"
            onClick={handleFinish}
          >
            Finish
          </button>
        </nav>
      </header>
      <main className="container">
        {isLoading && <Loading />}

        {showResults && (
          <div
            className="fixed grid place-items-center w-[100vw] h-[100vh] bg-gray-700/30  left-0 top-0"
            onClick={handleOutsideClick}
          >
            <div className="p-5 bg-white rounded-lg grid text-center text-xl gap-2">
              Your results
              <p>
                {
                  tests.filter((it) => it.userAnswer === it.correctAnswer)
                    .length
                }{' '}
                / {tests.length}
              </p>
              <span>or</span>
              <p>
                {Math.round(
                  (tests.filter((it) => it.userAnswer === it.correctAnswer)
                    .length /
                    tests.length) *
                    100,
                )}{' '}
                %
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="bg-indigo-500 text-white rounded-md p-2"
                  onClick={hideResults}
                >
                  Ok
                </button>
                <Link href={urls.HOME}>
                  <a className="bg-indigo-500 text-white rounded-md p-2">
                    Go home
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}

        <ul className="list-none flex flex-wrap justify-center mb-4 pl-[1px] pt-[1px]">
          {tests.map((test, index) => (
            <li
              className={
                'border -ml-[1px] -mt-[1px] w-16 text-center p-3 cursor-pointer border-gray-500 ' +
                (current === index
                  ? 'bg-indigo-500 text-white'
                  : test.userAnswer !== undefined
                  ? test.userAnswer === test.correctAnswer
                    ? 'bg-green-400'
                    : 'bg-red-400'
                  : 'bg-white text-black hover:bg-gray-200')
              }
              key={index}
              onClick={() => handleTestNumberClick(index)}
            >
              {index + 1}
            </li>
          ))}
        </ul>

        {tests.length > 0 && (
          <div className="border border-gray-400 rounded-lg overflow-hidden max-w-3xl m-auto">
            <p className="text-lg bg-gray-200 p-4">{tests[current].question}</p>

            <ul className="list-none border-b border-t border-gray-400">
              {tests[current].answers.map((answer, index) => (
                <li
                  className={`px-4 py-2  cursor-pointer ${
                    index === tests[current].userAnswer
                      ? tests[current].userAnswer ===
                        tests[current].correctAnswer
                        ? 'bg-green-400'
                        : 'bg-red-400'
                      : index === tests[current].correctAnswer &&
                        (tests[current].userAnswer !== undefined || isFinished)
                      ? 'bg-green-400'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                >
                  {answer}
                </li>
              ))}
            </ul>

            <div className="text-lg bg-gray-200 p-4 flex justify-between ">
              <button
                disabled={current === 0}
                className="rounded-md  p-2 uppercase bg-indigo-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
                onClick={handlePreviousClick}
              >
                Previous
              </button>

              <button
                disabled={current === tests.length - 1}
                className="rounded-md  p-2 uppercase bg-indigo-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Quiz
