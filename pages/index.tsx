import Select, { SelectOption } from 'common/select'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEventHandler, useRef } from 'react'
import { urls } from 'shared/urls'

export const AmountOptions: SelectOption[] = [
  { value: 10 },
  { value: 15 },
  { value: 20 },
  { value: 25 },
  { value: 30 },
]

const CategoryOptions: SelectOption[] = [{ value: 0, name: 'English' }]

const Home: NextPage = () => {
  const router = useRouter()

  const amountSelect = useRef<HTMLSelectElement>(null)
  const categorySelect = useRef<HTMLSelectElement>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event_) => {
    event_.preventDefault()

    const amount = Number(amountSelect.current?.value)
    const category = Number(categorySelect.current?.value)

    if (!Number.isNaN(amount) && !Number.isNaN(category)) {
      router.push({
        pathname: urls.QUIZ,
        query: {
          amount,
        },
      })
    }
  }

  return (
    <>
      <header className="bg-gray-200 mb-6">
        <nav className="container flex justify-between items-center font text-lg p-2">
          <Link href={urls.HOME}>
            <a className="p-3 hover:bg-gray-100 duration-300">FinalExam</a>
          </Link>
        </nav>
      </header>
      <main className="container">
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Select
            id="amount"
            name="amount"
            label="Number of questions"
            options={AmountOptions}
            ref={amountSelect}
          />

          <Select
            id="category"
            name="category"
            label="Select Category"
            options={CategoryOptions}
            ref={categorySelect}
          />

          <button
            className="p-2 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 duration-300
          hover:bg-white hover:text-indigo-500"
          >
            Start
          </button>
        </form>
      </main>
    </>
  )
}

export default Home
